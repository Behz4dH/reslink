import DatabaseService from '../services/databaseService';
import path from 'path';
import fs from 'fs';

export class DatabaseInitializer {
  static async initializeDatabase(): Promise<boolean> {
    try {
      // Ensure data directory exists
      const dbPath = path.join(__dirname, '../../data/reslinks.db');
      const dbDir = path.dirname(dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log('📁 Created data directory');
      }

      const db = DatabaseService.getDatabase();
      
      console.log('🔧 Initializing database tables...');
      
      // Create users table
      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT CHECK(role IN ('superuser', 'guest')) NOT NULL,
          avatar_url TEXT,
          linkedin_url TEXT,
          created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME,
          last_login DATETIME,
          is_active INTEGER DEFAULT 1
        )
      `;

      db.exec(createUsersTable);
      console.log('✅ Users table ready');
      
      // Create reslinks table
      const createReslinkTable = `
        CREATE TABLE IF NOT EXISTS reslinks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          name TEXT NOT NULL,
          position TEXT NOT NULL, 
          company TEXT NOT NULL,
          created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          video_url TEXT,
          resume_url TEXT,
          status TEXT CHECK(status IN ('draft', 'published', 'viewed', 'multiple_views')) DEFAULT 'draft',
          view_count INTEGER DEFAULT 0,
          last_viewed DATETIME,
          unique_id TEXT UNIQUE NOT NULL,
          updated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          user_id INTEGER,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `;

      db.exec(createReslinkTable);
      console.log('✅ Reslinks table ready');
      
      // Create reslink_views table for engagement tracking
      const createReslinkViewsTable = `
        CREATE TABLE IF NOT EXISTS reslink_views (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          reslink_id INTEGER NOT NULL,
          viewer_identifier TEXT,
          viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          ip_address TEXT,
          user_agent TEXT,
          referrer TEXT,
          session_id TEXT,
          FOREIGN KEY (reslink_id) REFERENCES reslinks (id) ON DELETE CASCADE
        )
      `;

      db.exec(createReslinkViewsTable);
      console.log('✅ Reslink views table ready');
      
      // Create indexes for performance
      const createIndexes = [
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

      createIndexes.forEach(indexQuery => {
        db.exec(indexQuery);
      });
      console.log('✅ Database indexes created');
      
      // Verify tables were created
      const tables = db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `).all();
      
      console.log('📋 Database tables:');
      tables.forEach((table: any) => console.log(`  - ${table.name}`));
      
      console.log('🎉 Database initialization completed successfully!');
      return true;
      
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  static async resetDatabase(): Promise<boolean> {
    try {
      console.log('🔥 Resetting database...');
      const db = DatabaseService.getDatabase();
      
      // Drop tables in correct order (views first due to foreign key)
      db.exec('DROP TABLE IF EXISTS reslink_views');
      db.exec('DROP TABLE IF EXISTS reslinks');
      db.exec('DROP TABLE IF EXISTS users');
      console.log('🗑️  Dropped existing tables');
      
      // Recreate tables
      return await this.initializeDatabase();
      
    } catch (error) {
      console.error('❌ Database reset failed:', error);
      throw error;
    }
  }

  static async checkDatabase(): Promise<void> {
    try {
      const db = DatabaseService.getDatabase();
      
      console.log('🔍 Database health check...');
      
      // Check tables exist
      const tables = db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `).all();
      
      console.log('📋 Available tables:');
      tables.forEach((table: any) => {
        const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get() as any;
        console.log(`  - ${table.name}: ${count.count} records`);
      });
      
      // Test a simple query
      const testQuery = db.prepare('SELECT 1 as test').get();
      if (testQuery) {
        console.log('✅ Database connection working');
      }
      
    } catch (error) {
      console.error('❌ Database check failed:', error);
      throw error;
    }
  }
}

// CLI interface - run if called directly
async function main() {
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'init':
        await DatabaseInitializer.initializeDatabase();
        break;
      case 'reset':
        await DatabaseInitializer.resetDatabase();
        break;
      case 'check':
        await DatabaseInitializer.checkDatabase();
        break;
      default:
        console.log('Usage: node initializeDatabase.js [init|reset|check]');
        console.log('  init  - Initialize database tables');
        console.log('  reset - Drop and recreate all tables');
        console.log('  check - Check database health');
        process.exit(1);
    }
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export default DatabaseInitializer;