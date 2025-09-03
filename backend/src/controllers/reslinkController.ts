import { Request, Response, Router } from 'express';
import { reslinkRepository, Reslink } from '../repositories/ReslinkRepository';
import { QueryParams } from '../types/query';
import PDFBadgeService from '../services/pdfBadgeService';
import EngagementService from '../services/engagementService';
import DatabaseService from '../services/databaseService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { parseSlug, isValidSlug, createSlug } from '../utils/slugUtils';
import multer from 'multer';

export const reslinkRouter = Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// GET /api/reslinks - Get all reslinks with query support  
reslinkRouter.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const queryParams: QueryParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: Math.min(parseInt(req.query.limit as string) || 10, 100), // Max 100
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
      search: req.query.search as string,
      filters: {
        status: req.query.status,
        company: req.query.company,
        position: req.query.position,
        user_id: req.user?.userId
      }
    };

    console.log('🚀 Backend query params:', queryParams);
    const result = await reslinkRepository.findMany(queryParams);
    console.log('🎯 Backend result:', { dataCount: result.data.length, pagination: result.pagination });
    
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      meta: result.meta
    });
  } catch (error) {
    console.error('Error fetching reslinks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reslinks',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/reslinks/:id - Get reslink by ID
reslinkRouter.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reslink ID'
      });
    }

    const reslink = await reslinkRepository.findById(id);
    if (!reslink) {
      return res.status(404).json({
        success: false,
        message: 'Reslink not found'
      });
    }

    res.json({
      success: true,
      data: reslink
    });
  } catch (error) {
    console.error('Error fetching reslink:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reslink',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/reslinks - Create new reslink
reslinkRouter.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, name, position, company, video_url, resume_url, status } = req.body;

    // Validation
    if (!title || !name || !position || !company) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, name, position, company'
      });
    }

    const newReslink = await reslinkRepository.create({
      title,
      name,
      position,
      company,
      video_url: video_url || '',
      resume_url: resume_url || '',
      user_id: req.user!.userId,
      status: status || 'draft',
      view_count: 0,
      last_viewed: null,
      unique_id: Math.random().toString(36).substring(2, 10)
    });

    res.status(201).json({
      success: true,
      data: newReslink,
      message: 'Reslink created successfully'
    });
  } catch (error) {
    console.error('Error creating reslink:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create reslink',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/reslinks/:id - Update reslink
reslinkRouter.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reslink ID'
      });
    }

    const updates = req.body;
    delete updates.id; // Don't allow ID updates
    delete updates.created_date; // Don't allow created_date updates
    delete updates.unique_id; // Don't allow unique_id updates

    const updatedReslink = await reslinkRepository.update(id, updates);
    if (!updatedReslink) {
      return res.status(404).json({
        success: false,
        message: 'Reslink not found'
      });
    }

    res.json({
      success: true,
      data: updatedReslink,
      message: 'Reslink updated successfully'
    });
  } catch (error) {
    console.error('Error updating reslink:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reslink',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/reslinks/:id - Delete reslink
reslinkRouter.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reslink ID'
      });
    }

    const deleted = await reslinkRepository.delete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Reslink not found'
      });
    }

    res.json({
      success: true,
      message: 'Reslink deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting reslink:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete reslink',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/view/:uniqueId - Public endpoint for tracking views (used by resume badge)
reslinkRouter.get('/view/:uniqueId', async (req: Request, res: Response) => {
  try {
    const { uniqueId } = req.params;
    
    // Find the reslink
    const reslink = await reslinkRepository.findByUniqueId(uniqueId);
    if (!reslink) {
      return res.status(404).send('Reslink not found');
    }

    // Check if video URL exists
    if (!reslink.video_url) {
      return res.status(404).send('Video not available');
    }

    // Track the detailed view with engagement service
    await EngagementService.trackView(reslink.id, req);

    // Update the reslink view count and status
    await reslinkRepository.incrementViewCount(reslink.id);

    // Redirect directly to the video URL
    res.redirect(reslink.video_url);

  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).send('Error accessing video');
  }
});

// POST /api/reslinks/:id/add-badge - Add reslink badge to PDF
reslinkRouter.post('/:id/add-badge', authenticateToken, upload.single('pdf'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('📥 Badge request received for reslink ID:', req.params.id);
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      console.error('❌ Invalid reslink ID:', req.params.id);
      return res.status(400).json({
        success: false,
        message: 'Invalid reslink ID'
      });
    }

    if (!req.file) {
      console.error('❌ No PDF file uploaded');
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
      });
    }

    console.log('📄 PDF file received:', req.file.originalname, 'Size:', req.file.size);

    // Get the reslink to get the unique_id
    const reslink = await reslinkRepository.findById(id);
    if (!reslink) {
      console.error('❌ Reslink not found for ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Reslink not found'
      });
    }

    console.log('✅ Reslink found:', reslink.unique_id);

    // Validate PDF
    console.log('🔍 Validating PDF...');
    const isValidPDF = await PDFBadgeService.validatePDF(req.file.buffer);
    if (!isValidPDF) {
      console.error('❌ Invalid PDF file');
      return res.status(400).json({
        success: false,
        message: 'Invalid PDF file'
      });
    }

    console.log('✅ PDF validation passed');

    // Add badge to PDF
    console.log('🏷️ Adding badge to PDF...');
    const badgedPdfBuffer = await PDFBadgeService.generateBadgedPDF(
      req.file.buffer,
      reslink.unique_id,
      process.env.BACKEND_URL || 'http://localhost:3001/api/reslinks'
    );

    console.log('✅ Badge added successfully, buffer size:', badgedPdfBuffer.length);

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${reslink.name}-resume-with-reslink-badge.pdf"`);
    res.setHeader('Content-Length', badgedPdfBuffer.length);

    // Send the badged PDF
    res.send(badgedPdfBuffer);

  } catch (error) {
    console.error('Error adding badge to PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add badge to PDF',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/reslinks/:id/analytics - Get engagement analytics for a reslink
reslinkRouter.get('/:id/analytics', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reslink ID'
      });
    }

    // Verify reslink exists
    const reslink = await reslinkRepository.findById(id);
    if (!reslink) {
      return res.status(404).json({
        success: false,
        message: 'Reslink not found'
      });
    }

    const days = parseInt(req.query.days as string) || 30;

    // Get view statistics and detailed analytics
    const [viewStats, detailedAnalytics] = await Promise.all([
      EngagementService.getViewStats(id),
      EngagementService.getDetailedAnalytics(id, days)
    ]);

    res.json({
      success: true,
      data: {
        reslink: {
          id: reslink.id,
          title: reslink.title,
          name: reslink.name
        },
        stats: viewStats,
        analytics: detailedAnalytics,
        period_days: days
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/reslinks/public/:slug - Get reslink by position-company slug for public access
reslinkRouter.get('/public/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    if (!slug || !isValidSlug(slug)) {
      return res.status(400).json({
        success: false,
        message: 'Valid slug is required (format: position-company)'
      });
    }

    // Parse slug to get position and company
    const parsed = parseSlug(slug);
    if (!parsed) {
      return res.status(400).json({
        success: false,
        message: 'Invalid slug format'
      });
    }

    const { position, company } = parsed;

    // Find the reslink by position and company with user information
    const query = `
      SELECT 
        r.id, r.title, r.name, r.position, r.company, 
        r.video_url, r.resume_url, r.unique_id, r.created_date,
        u.avatar_url, u.linkedin_url
      FROM reslinks r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE LOWER(r.position) = LOWER(?) AND LOWER(r.company) = LOWER(?)
      ORDER BY r.created_date DESC
      LIMIT 1
    `;
    
    const reslinkWithUser = await DatabaseService.executeQuerySingle(query, [position, company]);
    
    if (!reslinkWithUser) {
      return res.status(404).json({
        success: false,
        message: 'Reslink not found'
      });
    }

    // Return the reslink data with user info (no authentication required for public access)
    res.json({
      success: true,
      reslink: {
        id: reslinkWithUser.id,
        title: reslinkWithUser.title,
        name: reslinkWithUser.name,
        position: reslinkWithUser.position,
        company: reslinkWithUser.company,
        video_url: reslinkWithUser.video_url,
        resume_url: reslinkWithUser.resume_url,
        unique_id: reslinkWithUser.unique_id,
        created_date: reslinkWithUser.created_date,
        avatar_url: reslinkWithUser.avatar_url,
        linkedin_url: reslinkWithUser.linkedin_url
      }
    });

  } catch (error) {
    console.error('Error fetching public reslink:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reslink',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/reslinks/recent-views - Get recent views across all reslinks
reslinkRouter.get('/recent-views', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    
    const recentViews = await EngagementService.getRecentViews(limit);

    res.json({
      success: true,
      data: recentViews
    });

  } catch (error) {
    console.error('Error fetching recent views:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent views',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default reslinkRouter;