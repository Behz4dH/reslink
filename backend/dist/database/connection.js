"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const DB_PATH = path_1.default.join(__dirname, '../../data/reslinks.db');
class DatabaseConnection {
    constructor() {
        // Create data directory if it doesn't exist
        const fs = require('fs');
        const dbDir = path_1.default.dirname(DB_PATH);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }
        // Initialize database
        this.db = new sqlite3_1.default.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
            }
            else {
                console.log('Connected to SQLite database');
                this.initializeTables();
            }
        });
    }
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
    getDatabase() {
        return this.db;
    }
    initializeTables() {
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
            }
            else {
                console.log('Reslinks table ready');
            }
        });
    }
    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            }
            else {
                console.log('Database connection closed');
            }
        });
    }
}
exports.default = DatabaseConnection;
//# sourceMappingURL=connection.js.map