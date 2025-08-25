import { Request, Response, Router } from 'express';
import ReslinkModel, { Reslink } from '../models/reslinkModel';

const reslinkModel = new ReslinkModel();
export const reslinkRouter = Router();

// GET /api/reslinks - Get all reslinks
reslinkRouter.get('/', async (req: Request, res: Response) => {
  try {
    const reslinks = await reslinkModel.getAll();
    res.json({
      success: true,
      data: reslinks
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
reslinkRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reslink ID'
      });
    }

    const reslink = await reslinkModel.getById(id);
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
reslinkRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { title, name, position, company, video_url, resume_url, status } = req.body;

    // Validation
    if (!title || !name || !position || !company) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, name, position, company'
      });
    }

    const newReslink = await reslinkModel.create({
      title,
      name,
      position,
      company,
      video_url,
      resume_url,
      status: status || 'draft'
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
reslinkRouter.put('/:id', async (req: Request, res: Response) => {
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

    const updatedReslink = await reslinkModel.update(id, updates);
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
reslinkRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reslink ID'
      });
    }

    const deleted = await reslinkModel.delete(id);
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
    
    // Track the view
    const reslink = await reslinkModel.trackView(uniqueId);
    if (!reslink) {
      return res.status(404).json({
        success: false,
        message: 'Reslink not found'
      });
    }

    // Return reslink data for the viewing page
    res.json({
      success: true,
      data: {
        title: reslink.title,
        name: reslink.name,
        position: reslink.position,
        company: reslink.company,
        video_url: reslink.video_url,
        view_count: reslink.view_count
      },
      message: 'View tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track view',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default reslinkRouter;