import DatabaseService from '../services/databaseService';
import { QueryParams, QueryResult } from '../types/query';

export abstract class BaseRepository<T> {
  protected abstract tableName: string;
  protected abstract selectableFields: string[];
  protected abstract sortableFields: string[];
  protected abstract searchableFields: string[];

  async findMany(params: QueryParams = {}): Promise<QueryResult<T>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_date',
      sortOrder = 'desc',
      filters = {},
      search,
      searchFields = this.searchableFields
    } = params;

    // Validate limit (max 100)
    const validLimit = Math.min(Math.max(limit, 1), 100);

    // Build WHERE clause
    const whereConditions: string[] = [];
    const whereParams: any[] = [];

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (this.selectableFields.includes(key)) {
          whereConditions.push(`${key} = ?`);
          whereParams.push(value);
        }
      }
    });

    // Add search
    if (search && searchFields.length > 0) {
      const validSearchFields = searchFields.filter(field => this.selectableFields.includes(field));
      if (validSearchFields.length > 0) {
        const searchConditions = validSearchFields.map(field => `${field} LIKE ?`);
        whereConditions.push(`(${searchConditions.join(' OR ')})`);
        validSearchFields.forEach(() => whereParams.push(`%${search}%`));
      }
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    // Validate and build ORDER BY
    const validSortBy = this.sortableFields.includes(sortBy) ? sortBy : this.sortableFields[0] || 'id';
    const validSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';
    const orderByClause = `ORDER BY ${validSortBy} ${validSortOrder}`;

    // Pagination
    const offset = (page - 1) * validLimit;
    const limitClause = `LIMIT ${validLimit} OFFSET ${offset}`;

    // Build queries
    const selectFields = this.selectableFields.join(', ');
    const dataQuery = `
      SELECT ${selectFields} 
      FROM ${this.tableName} 
      ${whereClause} 
      ${orderByClause} 
      ${limitClause}
    `;

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM ${this.tableName} 
      ${whereClause}
    `;

    try {
      // Execute queries
      const [data, countResult] = await Promise.all([
        DatabaseService.executeQuery<T>(dataQuery, whereParams),
        DatabaseService.executeQuerySingle<{ total: number }>(countQuery, whereParams)
      ]);

      const total = countResult?.total || 0;
      const totalPages = Math.ceil(total / validLimit);

      return {
        data,
        pagination: {
          page,
          limit: validLimit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        meta: {
          sortBy: validSortBy,
          sortOrder: validSortOrder,
          filters
        }
      };
    } catch (error) {
      console.error(`Error in ${this.tableName} repository findMany:`, error);
      throw error;
    }
  }

  async findById(id: number): Promise<T | null> {
    const query = `SELECT ${this.selectableFields.join(', ')} FROM ${this.tableName} WHERE id = ?`;
    return DatabaseService.executeQuerySingle<T>(query, [id]);
  }

  async create(data: Omit<T, 'id' | 'created_date' | 'updated_date'>): Promise<T> {
    const fields = Object.keys(data as any);
    const values = Object.values(data as any);
    const placeholders = fields.map(() => '?').join(', ');
    
    const query = `
      INSERT INTO ${this.tableName} (${fields.join(', ')}) 
      VALUES (${placeholders})
    `;

    try {
      const result = await DatabaseService.executeCommand(query, values);
      const created = await this.findById(result.lastInsertRowid as number);
      if (!created) {
        throw new Error('Failed to retrieve created record');
      }
      return created;
    } catch (error) {
      console.error(`Error creating record in ${this.tableName}:`, error);
      throw error;
    }
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    const fields = Object.keys(data as any).filter(key => key !== 'id');
    const values = fields.map(field => (data as any)[field]);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const query = `
      UPDATE ${this.tableName} 
      SET ${setClause}, updated_date = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;

    try {
      await DatabaseService.executeCommand(query, [...values, id]);
      return this.findById(id);
    } catch (error) {
      console.error(`Error updating record in ${this.tableName}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    
    try {
      const result = await DatabaseService.executeCommand(query, [id]);
      return result.changes > 0;
    } catch (error) {
      console.error(`Error deleting record from ${this.tableName}:`, error);
      throw error;
    }
  }

  async count(filters: Record<string, any> = {}): Promise<number> {
    const whereConditions: string[] = [];
    const whereParams: any[] = [];

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (this.selectableFields.includes(key)) {
          whereConditions.push(`${key} = ?`);
          whereParams.push(value);
        }
      }
    });

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    const query = `SELECT COUNT(*) as total FROM ${this.tableName} ${whereClause}`;
    
    try {
      const result = await DatabaseService.executeQuerySingle<{ total: number }>(query, whereParams);
      return result?.total || 0;
    } catch (error) {
      console.error(`Error counting records in ${this.tableName}:`, error);
      throw error;
    }
  }
}