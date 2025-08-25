import { Database } from 'sqlite3';
declare class DatabaseConnection {
    private static instance;
    private db;
    private constructor();
    static getInstance(): DatabaseConnection;
    getDatabase(): Database;
    private initializeTables;
    close(): void;
}
export default DatabaseConnection;
//# sourceMappingURL=connection.d.ts.map