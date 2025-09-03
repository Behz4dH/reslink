import express from 'express';
import bcrypt from 'bcrypt';
import multer from 'multer';
import AuthController from '../controllers/authController';
import { authenticateToken, requireSuperuser, AuthenticatedRequest } from '../middleware/auth';
import DatabaseService from '../services/databaseService';
import type { User, UserWithPassword } from '../types/auth';
import { Response } from 'express';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Public routes
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', authenticateToken, AuthController.me);

// Profile management routes
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, email, linkedin_url } = req.body;
    const userId = req.user!.userId;

    // Validation
    if (!username || !email) {
      return res.status(400).json({
        success: false,
        error: 'Username and email are required'
      });
    }

    // Check if username/email already exists for other users
    const existingUser = await DatabaseService.executeQuerySingle<User>(
      'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?',
      [username, email, userId]
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Username or email already exists'
      });
    }

    // Update user profile
    await DatabaseService.executeCommand(
      'UPDATE users SET username = ?, email = ?, linkedin_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [username, email, linkedin_url || null, userId]
    );

    // Get updated user data
    const updatedUser = await DatabaseService.executeQuerySingle<User>(
      'SELECT id, username, email, role, avatar_url, linkedin_url, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

router.post('/avatar', authenticateToken, upload.single('avatar'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Avatar file is required'
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: 'Only JPEG, PNG, and GIF images are allowed'
      });
    }

    // Upload to storage service
    const SupabaseStorageService = require('../services/supabaseService').default;
    const storageService = new SupabaseStorageService();
    
    const avatarPath = `avatars/user-${userId}-${Date.now()}.${req.file.mimetype.split('/')[1]}`;
    const avatarUrl = await storageService.uploadFile('reslinkVids', avatarPath, req.file.buffer);

    // Update user avatar URL in database
    await DatabaseService.executeCommand(
      'UPDATE users SET avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [avatarUrl, userId]
    );

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatar_url: avatarUrl
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload avatar'
    });
  }
});

router.post('/change-password', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.userId;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long'
      });
    }

    // Get current user with password hash
    const user = await DatabaseService.executeQuerySingle<UserWithPassword>(
      'SELECT id, password_hash FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await DatabaseService.executeCommand(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedNewPassword, userId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password'
    });
  }
});

// Superuser only routes
router.post('/register', authenticateToken, requireSuperuser, AuthController.register);
router.get('/users', authenticateToken, requireSuperuser, AuthController.getAllUsers);

export default router;