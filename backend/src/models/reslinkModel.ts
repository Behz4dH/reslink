import DatabaseConnection from '../database/connection';
import { Database } from 'sqlite3';

export interface Reslink {
  id?: number;
  title: string;
  name: string;
  position: string;
  company: string;
  created_date?: string;
  video_url?: string;
  resume_url?: string;
  status: 'draft' | 'published' | 'viewed' | 'multiple_views';
  view_count: number;
  last_viewed?: string;
  unique_id: string;
  updated_date?: string;
}

export class ReslinkModel {
  private db: Database;

  constructor() {
    this.db = DatabaseConnection.getInstance().getDatabase();
  }

  // Generate unique ID for tracking URLs
  private generateUniqueId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Create new reslink
  public create(reslink: Omit<Reslink, 'id' | 'created_date' | 'updated_date' | 'unique_id' | 'view_count'>): Promise<Reslink> {
    return new Promise((resolve, reject) => {
      const uniqueId = this.generateUniqueId();
      const query = `
        INSERT INTO reslinks (title, name, position, company, video_url, resume_url, status, unique_id, view_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      this.db.run(
        query,
        [reslink.title, reslink.name, reslink.position, reslink.company, 
         reslink.video_url, reslink.resume_url, reslink.status || 'draft', uniqueId, 0],
        function(err) {
          if (err) {
            reject(err);
          } else {
            // Get the created record
            const selectQuery = 'SELECT * FROM reslinks WHERE id = ?';
            DatabaseConnection.getInstance().getDatabase().get(selectQuery, [this.lastID], (err, row: Reslink) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          }
        }
      );
    });
  }

  // Get all reslinks
  public getAll(): Promise<Reslink[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM reslinks ORDER BY created_date DESC';
      this.db.all(query, [], (err, rows: Reslink[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get reslink by ID
  public getById(id: number): Promise<Reslink | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM reslinks WHERE id = ?';
      this.db.get(query, [id], (err, row: Reslink) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  // Get reslink by unique_id (for tracking)
  public getByUniqueId(uniqueId: string): Promise<Reslink | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM reslinks WHERE unique_id = ?';
      this.db.get(query, [uniqueId], (err, row: Reslink) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  // Update reslink
  public update(id: number, updates: Partial<Reslink>): Promise<Reslink | null> {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates).filter(key => key !== 'id');
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => (updates as any)[field]);
      
      const query = `
        UPDATE reslinks 
        SET ${setClause}, updated_date = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      
      this.db.run(query, [...values, id], function(err) {
        if (err) {
          reject(err);
        } else {
          // Get updated record
          const selectQuery = 'SELECT * FROM reslinks WHERE id = ?';
          DatabaseConnection.getInstance().getDatabase().get(selectQuery, [id], (err, row: Reslink) => {
            if (err) {
              reject(err);
            } else {
              resolve(row || null);
            }
          });
        }
      });
    });
  }

  // Delete reslink
  public delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM reslinks WHERE id = ?';
      this.db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  // Track view (increment view count and update status)
  public trackView(uniqueId: string): Promise<Reslink | null> {
    return new Promise((resolve, reject) => {
      // First get current reslink
      this.getByUniqueId(uniqueId)
        .then(reslink => {
          if (!reslink) {
            resolve(null);
            return;
          }

          const newViewCount = reslink.view_count + 1;
          let newStatus = reslink.status;

          // Update status based on view count
          if (newViewCount === 1 && reslink.status === 'published') {
            newStatus = 'viewed';
          } else if (newViewCount >= 2) {
            newStatus = 'multiple_views';
          }

          // Update the record
          const query = `
            UPDATE reslinks 
            SET view_count = ?, status = ?, last_viewed = CURRENT_TIMESTAMP, updated_date = CURRENT_TIMESTAMP
            WHERE unique_id = ?
          `;

          this.db.run(query, [newViewCount, newStatus, uniqueId], function(err) {
            if (err) {
              reject(err);
            } else {
              // Return updated record
              DatabaseConnection.getInstance().getDatabase().get(
                'SELECT * FROM reslinks WHERE unique_id = ?',
                [uniqueId],
                (err, row: Reslink) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(row || null);
                  }
                }
              );
            }
          });
        })
        .catch(reject);
    });
  }
}

export default ReslinkModel;