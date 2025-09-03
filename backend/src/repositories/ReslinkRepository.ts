import { BaseRepository } from './BaseRepository';
import { QueryParams, QueryResult } from '../types/query';
import DatabaseService from '../services/databaseService';

export interface Reslink {
  id: number;
  title: string;
  name: string;
  position: string;
  company: string;
  created_date: string;
  updated_date: string;
  video_url: string;
  resume_url: string;
  status: 'draft' | 'published' | 'viewed' | 'multiple_views';
  view_count: number;
  last_viewed: string | null;
  unique_id: string;
  user_id: number;
}

export class ReslinkRepository extends BaseRepository<Reslink> {
  protected tableName = 'reslinks';
  protected selectableFields = [
    'id', 'title', 'name', 'position', 'company', 
    'created_date', 'updated_date', 'video_url', 'resume_url', 
    'status', 'view_count', 'last_viewed', 'unique_id', 'user_id'
  ];
  protected sortableFields = [
    'created_date', 'updated_date', 'title', 'name', 'position', 
    'company', 'status', 'view_count', 'last_viewed'
  ];
  protected searchableFields = [
    'title', 'name', 'position', 'company'
  ];

  // Custom methods for specific business logic
  async findByStatus(status: Reslink['status'], params: QueryParams = {}): Promise<QueryResult<Reslink>> {
    return this.findMany({
      ...params,
      filters: { ...params.filters, status }
    });
  }

  async findRecentlyViewed(params: QueryParams = {}): Promise<QueryResult<Reslink>> {
    return this.findMany({
      ...params,
      sortBy: 'last_viewed',
      sortOrder: 'desc',
      filters: { 
        ...params.filters, 
        status: 'viewed' 
      }
    });
  }

  async findByUniqueId(uniqueId: string): Promise<Reslink | null> {
    const query = `SELECT ${this.selectableFields.join(', ')} FROM ${this.tableName} WHERE unique_id = ?`;
    return DatabaseService.executeQuerySingle<Reslink>(query, [uniqueId]);
  }

  async incrementViewCount(id: number): Promise<Reslink | null> {
    const updateQuery = `
      UPDATE ${this.tableName} 
      SET view_count = view_count + 1, 
          last_viewed = CURRENT_TIMESTAMP,
          status = CASE 
            WHEN view_count = 0 THEN 'viewed'
            WHEN view_count >= 1 THEN 'multiple_views'
            ELSE status
          END,
          updated_date = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    try {
      await DatabaseService.executeCommand(updateQuery, [id]);
      return this.findById(id);
    } catch (error) {
      console.error('Error incrementing view count:', error);
      throw error;
    }
  }

  async findByCompany(company: string, params: QueryParams = {}): Promise<QueryResult<Reslink>> {
    return this.findMany({
      ...params,
      filters: { ...params.filters, company }
    });
  }

  async findByPosition(position: string, params: QueryParams = {}): Promise<QueryResult<Reslink>> {
    return this.findMany({
      ...params,
      filters: { ...params.filters, position }
    });
  }

  async getStatusCounts(): Promise<{ [key: string]: number }> {
    const query = `
      SELECT status, COUNT(*) as count 
      FROM ${this.tableName} 
      GROUP BY status
    `;

    try {
      const results = await DatabaseService.executeQuery<{ status: string; count: number }>(query);
      const counts: { [key: string]: number } = {};
      results.forEach(({ status, count }) => {
        counts[status] = count;
      });
      return counts;
    } catch (error) {
      console.error('Error getting status counts:', error);
      throw error;
    }
  }

  async getRecentActivity(limit = 10): Promise<Reslink[]> {
    const query = `
      SELECT ${this.selectableFields.join(', ')} 
      FROM ${this.tableName} 
      WHERE last_viewed IS NOT NULL 
      ORDER BY last_viewed DESC 
      LIMIT ?
    `;

    try {
      return DatabaseService.executeQuery<Reslink>(query, [limit]);
    } catch (error) {
      console.error('Error getting recent activity:', error);
      throw error;
    }
  }

  // Transaction example: Create reslink with file uploads
  async createWithFiles(
    reslinkData: Omit<Reslink, 'id' | 'created_date' | 'updated_date'>,
    videoFile?: { path: string; originalName: string },
    resumeFile?: { path: string; originalName: string }
  ): Promise<Reslink> {
    return DatabaseService.executeTransaction(async () => {
      // This would typically include file upload operations
      // For now, just create the reslink
      return this.create(reslinkData);
    });
  }
}

// Export singleton instance
export const reslinkRepository = new ReslinkRepository();