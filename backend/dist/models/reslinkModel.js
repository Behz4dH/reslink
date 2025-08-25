"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReslinkModel = void 0;
const connection_1 = __importDefault(require("../database/connection"));
class ReslinkModel {
    constructor() {
        this.db = connection_1.default.getInstance().getDatabase();
    }
    // Generate unique ID for tracking URLs
    generateUniqueId() {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    // Create new reslink
    create(reslink) {
        return new Promise((resolve, reject) => {
            const uniqueId = this.generateUniqueId();
            const query = `
        INSERT INTO reslinks (title, name, position, company, video_url, resume_url, status, unique_id, view_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
            this.db.run(query, [reslink.title, reslink.name, reslink.position, reslink.company,
                reslink.video_url, reslink.resume_url, reslink.status || 'draft', uniqueId, 0], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    // Get the created record
                    const selectQuery = 'SELECT * FROM reslinks WHERE id = ?';
                    connection_1.default.getInstance().getDatabase().get(selectQuery, [this.lastID], (err, row) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(row);
                        }
                    });
                }
            });
        });
    }
    // Get all reslinks
    getAll() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM reslinks ORDER BY created_date DESC';
            this.db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    // Get reslink by ID
    getById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM reslinks WHERE id = ?';
            this.db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row || null);
                }
            });
        });
    }
    // Get reslink by unique_id (for tracking)
    getByUniqueId(uniqueId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM reslinks WHERE unique_id = ?';
            this.db.get(query, [uniqueId], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row || null);
                }
            });
        });
    }
    // Update reslink
    update(id, updates) {
        return new Promise((resolve, reject) => {
            const fields = Object.keys(updates).filter(key => key !== 'id');
            const setClause = fields.map(field => `${field} = ?`).join(', ');
            const values = fields.map(field => updates[field]);
            const query = `
        UPDATE reslinks 
        SET ${setClause}, updated_date = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
            this.db.run(query, [...values, id], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    // Get updated record
                    const selectQuery = 'SELECT * FROM reslinks WHERE id = ?';
                    connection_1.default.getInstance().getDatabase().get(selectQuery, [id], (err, row) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(row || null);
                        }
                    });
                }
            });
        });
    }
    // Delete reslink
    delete(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM reslinks WHERE id = ?';
            this.db.run(query, [id], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.changes > 0);
                }
            });
        });
    }
    // Track view (increment view count and update status)
    trackView(uniqueId) {
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
                }
                else if (newViewCount >= 2) {
                    newStatus = 'multiple_views';
                }
                // Update the record
                const query = `
            UPDATE reslinks 
            SET view_count = ?, status = ?, last_viewed = CURRENT_TIMESTAMP, updated_date = CURRENT_TIMESTAMP
            WHERE unique_id = ?
          `;
                this.db.run(query, [newViewCount, newStatus, uniqueId], function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        // Return updated record
                        connection_1.default.getInstance().getDatabase().get('SELECT * FROM reslinks WHERE unique_id = ?', [uniqueId], (err, row) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(row || null);
                            }
                        });
                    }
                });
            })
                .catch(reject);
        });
    }
}
exports.ReslinkModel = ReslinkModel;
exports.default = ReslinkModel;
//# sourceMappingURL=reslinkModel.js.map