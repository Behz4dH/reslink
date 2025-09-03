import { Pool, Client } from 'pg';
import path from 'path';

class ProductionDatabaseService {
  private pool: Pool | null = null;

  constructor() {
    if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      });
    }
  }

  isProduction(): boolean {
    return process.env.NODE_ENV === 'production' && !!process.env.DATABASE_URL;
  }

  async initializeProductionDatabase(): Promise<void> {
    if (!this.pool) throw new Error('PostgreSQL pool not initialized');

    const client = await this.pool.connect();
    
    try {
      console.log('🔧 Initializing production PostgreSQL database...');
      
      // Create users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) CHECK(role IN ('superuser', 'guest')) NOT NULL,
          avatar_url TEXT,
          linkedin_url TEXT,
          created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP,
          last_login TIMESTAMP,
          is_active BOOLEAN DEFAULT true
        )
      `);

      // Create reslinks table
      await client.query(`
        CREATE TABLE IF NOT EXISTS reslinks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          position VARCHAR(255) NOT NULL, 
          company VARCHAR(255) NOT NULL,
          created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          video_url TEXT,
          resume_url TEXT,
          status VARCHAR(50) CHECK(status IN ('draft', 'published', 'viewed', 'multiple_views')) DEFAULT 'draft',
          view_count INTEGER DEFAULT 0,
          last_viewed TIMESTAMP,
          unique_id VARCHAR(255) UNIQUE NOT NULL,
          updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          user_id INTEGER,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Create reslink_views table
      await client.query(`
        CREATE TABLE IF NOT EXISTS reslink_views (
          id SERIAL PRIMARY KEY,
          reslink_id INTEGER NOT NULL,
          viewer_identifier VARCHAR(255),
          viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          ip_address VARCHAR(255),
          user_agent TEXT,
          referrer TEXT,
          session_id VARCHAR(255),
          FOREIGN KEY (reslink_id) REFERENCES reslinks (id) ON DELETE CASCADE
        )
      `);

      // Create indexes
      const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)',
        'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
        'CREATE INDEX IF NOT EXISTS idx_reslinks_unique_id ON reslinks(unique_id)',
        'CREATE INDEX IF NOT EXISTS idx_reslinks_status ON reslinks(status)',
        'CREATE INDEX IF NOT EXISTS idx_reslinks_created_date ON reslinks(created_date)',
        'CREATE INDEX IF NOT EXISTS idx_reslinks_user_id ON reslinks(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_reslink_views_reslink_id ON reslink_views(reslink_id)',
        'CREATE INDEX IF NOT EXISTS idx_reslink_views_viewed_at ON reslink_views(viewed_at)',
        'CREATE INDEX IF NOT EXISTS idx_reslink_views_viewer_identifier ON reslink_views(viewer_identifier)'
      ];

      for (const indexQuery of indexes) {
        await client.query(indexQuery);
      }

      console.log('✅ Production database initialized successfully!');
      
    } catch (error) {
      console.error('❌ Production database initialization failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Convert SQLite-style ? placeholders to PostgreSQL $1, $2, $3
  private convertQuery(query: string): string {
    let index = 1;
    return query.replace(/\?/g, () => `$${index++}`);
  }

  async executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
    if (!this.pool) throw new Error('Database pool not initialized');
    
    const client = await this.pool.connect();
    try {
      const pgQuery = this.convertQuery(query);
      const result = await client.query(pgQuery, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async executeQuerySingle<T = any>(query: string, params: any[] = []): Promise<T | null> {
    const results = await this.executeQuery<T>(query, params);
    return results.length > 0 ? results[0] : null;
  }

  async executeCommand(query: string, params: any[] = []): Promise<void> {
    if (!this.pool) throw new Error('Database pool not initialized');
    
    const client = await this.pool.connect();
    try {
      const pgQuery = this.convertQuery(query);
      await client.query(pgQuery, params);
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

export default new ProductionDatabaseService();