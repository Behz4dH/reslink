import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../data/reslinks.db');

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: Database;

  private constructor() {
    // Create data directory if it doesn't exist
    const fs = require('fs');
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Initialize database
    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database');
        this.initializeTables();
      }
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getDatabase(): Database {
    return this.db;
  }

  private initializeTables(): void {
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
        updated_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createReslinkTable, (err) => {
      if (err) {
        console.error('Error creating reslinks table:', err.message);
      } else {
        console.log('Reslinks table ready');
      }
    });
  }

  public close(): void {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

export default DatabaseConnection;