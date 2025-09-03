import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import ProductionDatabaseService from './productionDatabaseService';

// SQLite Database connection with WAL mode for better concurrency  
let db: DatabaseType | null = null;

// Initialize SQLite only in development
if (process.env.NODE_ENV !== 'production') {
  db = new Database(path.join(__dirname, '../../data/reslinks.db'));
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('cache_size = 1000');
  db.pragma('temp_store = MEMORY');
}

export class DatabaseService {
  
  // Check if we're using PostgreSQL (production) or SQLite (development)
  static isProduction(): boolean {
    return ProductionDatabaseService.isProduction();
  }

  // Initialize database for production
  static async initializeProduction(): Promise<void> {
    if (this.isProduction()) {
      await ProductionDatabaseService.initializeProductionDatabase();
    }
  }

  // Execute raw query
  static async executeQuery<T = any>(
    query: string, 
    params: any[] = [],
    useTransaction = false
  ): Promise<T[]> {
    if (this.isProduction()) {
      return ProductionDatabaseService.executeQuery<T>(query, params);
    }
    
    // SQLite logic
    const executeQuery = (database: DatabaseType) => {
      const stmt = database.prepare(query);
      return stmt.all(...params) as T[];
    };

    if (useTransaction && db) {
      const transaction = db.transaction(() => {
        return executeQuery(db!);
      });
      return transaction();
    }
    
    if (!db) throw new Error('SQLite database not initialized');
    return executeQuery(db);
  }

  // Execute single query that returns one result
  static async executeQuerySingle<T = any>(
    query: string, 
    params: any[] = [],
    useTransaction = false
  ): Promise<T | null> {
    if (this.isProduction()) {
      return ProductionDatabaseService.executeQuerySingle<T>(query, params);
    }

    // SQLite logic
    const executeQuery = (database: DatabaseType) => {
      const stmt = database.prepare(query);
      const result = stmt.get(...params) as T | undefined;
      return result ?? null;
    };

    if (useTransaction && db) {
      const transaction = db.transaction(() => {
        return executeQuery(db!);
      });
      return transaction();
    }
    
    if (!db) throw new Error('SQLite database not initialized');
    return executeQuery(db);
  }

  // Execute insert/update/delete
  static async executeCommand(
    query: string, 
    params: any[] = [],
    useTransaction = false
  ): Promise<any> {
    if (this.isProduction()) {
      await ProductionDatabaseService.executeCommand(query, params);
      return { changes: 1, lastInsertRowid: null }; // Mock SQLite response for compatibility
    }

    // SQLite logic
    const executeCommand = (database: DatabaseType) => {
      const stmt = database.prepare(query);
      return stmt.run(...params);
    };

    if (useTransaction && db) {
      const transaction = db.transaction(() => {
        return executeCommand(db!);
      });
      return transaction();
    }
    
    if (!db) throw new Error('SQLite database not initialized');
    return executeCommand(db);
  }

  // Transaction wrapper (SQLite only, PostgreSQL handles transactions internally)
  static async executeTransaction<T>(operations: (db: DatabaseType) => Promise<T> | T): Promise<T> {
    if (this.isProduction()) {
      throw new Error('Use individual queries in production - transactions handled at PostgreSQL level');
    }

    if (!db) throw new Error('SQLite database not initialized');
    
    const transaction = db.transaction(() => {
      return operations(db!);
    });
    
    try {
      return transaction();
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  // Batch operations in a single transaction
  static async executeBatch<T>(operations: Array<() => Promise<T> | T>): Promise<T[]> {
    if (this.isProduction()) {
      // Execute operations sequentially in production
      const results: T[] = [];
      for (const operation of operations) {
        const result = await operation();
        results.push(result);
      }
      return results;
    }

    // SQLite transaction logic
    return this.executeTransaction(async () => {
      const results: T[] = [];
      for (const operation of operations) {
        const result = await operation();
        results.push(result);
      }
      return results;
    });
  }

  // Get database instance for complex operations (SQLite only)
  static getDatabase(): DatabaseType {
    if (this.isProduction()) {
      throw new Error('Direct database access not available in production - use query methods');
    }
    
    if (!db) throw new Error('SQLite database not initialized');
    return db;
  }

  // Close database connection
  static async close(): Promise<void> {
    if (this.isProduction()) {
      await ProductionDatabaseService.close();
    } else if (db) {
      db.close();
    }
  }
}

export default DatabaseService;