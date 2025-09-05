import DatabaseService from './databaseService';
import crypto from 'crypto';
import { Request } from 'express';

export interface ReslinkView {
  id: number;
  reslink_id: number;
  viewer_identifier: string;
  viewed_at: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  session_id?: string;
}

export interface ViewerStats {
  total_views: number;
  unique_viewers: number;
  last_viewed: string | null;
  views_today: number;
  views_this_week: number;
  views_this_month: number;
}

export interface DetailedAnalytics {
  daily_views: Array<{ date: string; count: number }>;
  hourly_distribution: Array<{ hour: number; count: number }>;
  viewer_locations: Array<{ ip_prefix: string; count: number }>;
  referrer_stats: Array<{ referrer: string; count: number }>;
}

export class EngagementService {
  
  /**
   * Track a view for a reslink
   */
  static async trackView(
    reslinkId: number,
    req: Request,
    additionalData?: Partial<ReslinkView>
  ): Promise<ReslinkView> {
    try {
      const viewerIdentifier = this.generateViewerIdentifier(req);
      const ipAddress = this.extractIPAddress(req);
      const sessionId = this.generateSessionId(req);
      
      const viewData = {
        reslink_id: reslinkId,
        viewer_identifier: viewerIdentifier,
        ip_address: ipAddress,
        user_agent: req.headers['user-agent'] || null,
        referrer: req.headers['referer'] || req.headers['referrer'] || null,
        session_id: sessionId,
        ...additionalData
      };

      const insertQuery = `
        INSERT INTO reslink_views (
          reslink_id, viewer_identifier, viewed_at, ip_address, 
          user_agent, referrer, session_id
        ) VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?)
      `;

      const result = await DatabaseService.executeCommand(
        insertQuery,
        [
          viewData.reslink_id,
          viewData.viewer_identifier,
          viewData.ip_address,
          viewData.user_agent,
          viewData.referrer,
          viewData.session_id
        ]
      );

      // Get the created view record (different for SQLite vs PostgreSQL)
      let view: ReslinkView | null = null;
      
      if (result.lastInsertRowid) {
        // SQLite - use lastInsertRowid
        const selectQuery = `SELECT * FROM reslink_views WHERE id = ?`;
        view = await DatabaseService.executeQuerySingle<ReslinkView>(
          selectQuery,
          [result.lastInsertRowid]
        );
      } else {
        // PostgreSQL - get the most recently created view for this reslink and viewer
        const selectQuery = `
          SELECT * FROM reslink_views 
          WHERE reslink_id = ? AND viewer_identifier = ? 
          ORDER BY viewed_at DESC LIMIT 1
        `;
        view = await DatabaseService.executeQuerySingle<ReslinkView>(
          selectQuery,
          [viewData.reslink_id, viewData.viewer_identifier]
        );
      }

      if (!view) {
        throw new Error('Failed to retrieve created view record');
      }

      return view;

    } catch (error) {
      console.error('Error tracking view:', error);
      throw error;
    }
  }

  /**
   * Get view statistics for a specific reslink
   */
  static async getViewStats(reslinkId: number): Promise<ViewerStats> {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_views,
          COUNT(DISTINCT viewer_identifier) as unique_viewers,
          MAX(viewed_at) as last_viewed,
          COUNT(CASE WHEN DATE(viewed_at) = DATE('now') THEN 1 END) as views_today,
          COUNT(CASE WHEN viewed_at >= DATE('now', '-7 days') THEN 1 END) as views_this_week,
          COUNT(CASE WHEN viewed_at >= DATE('now', '-30 days') THEN 1 END) as views_this_month
        FROM reslink_views 
        WHERE reslink_id = ?
      `;

      const stats = await DatabaseService.executeQuerySingle<ViewerStats>(
        statsQuery,
        [reslinkId]
      );

      if (!stats) {
        return {
          total_views: 0,
          unique_viewers: 0,
          last_viewed: null,
          views_today: 0,
          views_this_week: 0,
          views_this_month: 0
        };
      }

      return stats;

    } catch (error) {
      console.error('Error getting view stats:', error);
      throw error;
    }
  }

  /**
   * Get detailed analytics for a reslink
   */
  static async getDetailedAnalytics(
    reslinkId: number,
    days: number = 30
  ): Promise<DetailedAnalytics> {
    try {
      // Daily views for the past N days
      const dailyViewsQuery = `
        SELECT 
          DATE(viewed_at) as date,
          COUNT(*) as count
        FROM reslink_views 
        WHERE reslink_id = ? 
          AND viewed_at >= DATE('now', '-${days} days')
        GROUP BY DATE(viewed_at)
        ORDER BY date ASC
      `;

      // Hourly distribution
      const hourlyDistributionQuery = `
        SELECT 
          CAST(strftime('%H', viewed_at) AS INTEGER) as hour,
          COUNT(*) as count
        FROM reslink_views 
        WHERE reslink_id = ?
          AND viewed_at >= DATE('now', '-${days} days')
        GROUP BY hour
        ORDER BY hour ASC
      `;

      // Referrer stats
      const referrerStatsQuery = `
        SELECT 
          COALESCE(referrer, 'Direct') as referrer,
          COUNT(*) as count
        FROM reslink_views 
        WHERE reslink_id = ?
          AND viewed_at >= DATE('now', '-${days} days')
        GROUP BY referrer
        ORDER BY count DESC
        LIMIT 10
      `;

      // IP location stats (simplified - just IP prefixes for privacy)
      const locationQuery = `
        SELECT 
          SUBSTR(ip_address, 1, INSTR(ip_address || '.', '.') + 
                 INSTR(SUBSTR(ip_address, INSTR(ip_address, '.') + 1) || '.', '.') - 1) as ip_prefix,
          COUNT(*) as count
        FROM reslink_views 
        WHERE reslink_id = ?
          AND viewed_at >= DATE('now', '-${days} days')
          AND ip_address IS NOT NULL
        GROUP BY ip_prefix
        ORDER BY count DESC
        LIMIT 10
      `;

      const [dailyViews, hourlyDistribution, referrerStats, viewerLocations] = 
        await Promise.all([
          DatabaseService.executeQuery<{date: string; count: number}>(dailyViewsQuery, [reslinkId]),
          DatabaseService.executeQuery<{hour: number; count: number}>(hourlyDistributionQuery, [reslinkId]),
          DatabaseService.executeQuery<{referrer: string; count: number}>(referrerStatsQuery, [reslinkId]),
          DatabaseService.executeQuery<{ip_prefix: string; count: number}>(locationQuery, [reslinkId])
        ]);

      return {
        daily_views: dailyViews,
        hourly_distribution: hourlyDistribution,
        viewer_locations: viewerLocations,
        referrer_stats: referrerStats
      };

    } catch (error) {
      console.error('Error getting detailed analytics:', error);
      throw error;
    }
  }

  /**
   * Get recent views for all reslinks (for dashboard)
   */
  static async getRecentViews(limit: number = 20): Promise<Array<ReslinkView & {reslink_title: string}>> {
    try {
      const query = `
        SELECT 
          rv.*,
          r.title as reslink_title
        FROM reslink_views rv
        JOIN reslinks r ON rv.reslink_id = r.id
        ORDER BY rv.viewed_at DESC
        LIMIT ?
      `;

      return DatabaseService.executeQuery<ReslinkView & {reslink_title: string}>(
        query, 
        [limit]
      );

    } catch (error) {
      console.error('Error getting recent views:', error);
      throw error;
    }
  }

  /**
   * Generate a unique but anonymous viewer identifier
   */
  private static generateViewerIdentifier(req: Request): string {
    const components = [
      req.headers['user-agent'] || '',
      this.extractIPAddress(req),
      req.headers['accept-language'] || '',
      // Don't include exact fingerprinting for privacy
    ].join('|');

    return crypto
      .createHash('sha256')
      .update(components)
      .digest('hex')
      .substring(0, 16); // Shorter hash for storage efficiency
  }

  /**
   * Generate a session identifier
   */
  private static generateSessionId(req: Request): string {
    const sessionData = [
      this.extractIPAddress(req),
      req.headers['user-agent'] || '',
      Date.now().toString()
    ].join('|');

    return crypto
      .createHash('md5')
      .update(sessionData)
      .digest('hex')
      .substring(0, 12);
  }

  /**
   * Extract IP address from request (handling proxies)
   */
  private static extractIPAddress(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    const realIp = req.headers['x-real-ip'];
    
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    
    if (typeof realIp === 'string') {
      return realIp;
    }
    
    return req.socket.remoteAddress || 'unknown';
  }

  /**
   * Check if viewer has viewed this reslink before (within timeframe)
   */
  static async isReturningViewer(
    reslinkId: number, 
    viewerIdentifier: string,
    withinHours: number = 24
  ): Promise<boolean> {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM reslink_views
        WHERE reslink_id = ? 
          AND viewer_identifier = ?
          AND viewed_at >= datetime('now', '-${withinHours} hours')
      `;

      const result = await DatabaseService.executeQuerySingle<{count: number}>(
        query,
        [reslinkId, viewerIdentifier]
      );

      return (result?.count || 0) > 0;

    } catch (error) {
      console.error('Error checking returning viewer:', error);
      return false;
    }
  }
}

export default EngagementService;