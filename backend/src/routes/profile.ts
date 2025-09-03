import express from 'express';
import bcrypt from 'bcrypt';
import multer from 'multer';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import DatabaseService from '../services/databaseService';
import SupabaseStorageService from '../services/supabaseService';
import type { User, UserWithPassword } from '../types/auth';
import { Response } from 'express';

const router = express.Router();

// Configure multer for avatar uploads
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

// GET /profile - Get current user profile
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await DatabaseService.executeQuerySingle<User>(
      'SELECT id, username, email, role, avatar_url, linkedin_url, created_date, last_login, is_active FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
});

// PUT /profile - Update user profile (partial updates supported)
router.put('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('🔍 Profile update request received');
    console.log('👤 User ID:', req.user?.userId);
    console.log('📝 Request body:', req.body);

    const userId = req.user!.userId;
    const allowedFields = ['username', 'email', 'linkedin_url'];
    
    // Filter out only the fields that are provided and allowed
    const updates: { [key: string]: any } = {};
    const updateFields: string[] = [];
    const values: any[] = [];
    
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key) && req.body[key] !== undefined) {
        updates[key] = req.body[key];
        updateFields.push(`${key} = ?`);
        values.push(req.body[key]);
        console.log(`✅ Added field: ${key} = ${req.body[key]}`);
      } else {
        console.log(`⚠️ Skipped field: ${key} (not allowed or undefined)`);
      }
    });

    console.log('🚀 Final updates:', updates);
    console.log('📝 Update fields:', updateFields);
    console.log('💾 Values:', values);

    // If no valid fields to update, return error
    if (updateFields.length === 0) {
      console.log('❌ No valid fields to update');
      return res.status(400).json({
        success: false,
        error: 'No valid fields provided for update'
      });
    }

    // Special validation for username and email uniqueness
    if (updates.username || updates.email) {
      const checkFields = [];
      const checkValues = [];
      
      if (updates.username) {
        checkFields.push('username = ?');
        checkValues.push(updates.username);
      }
      
      if (updates.email) {
        checkFields.push('email = ?');
        checkValues.push(updates.email);
      }
      
      checkValues.push(userId);
      
      const existingUser = await DatabaseService.executeQuerySingle<User>(
        `SELECT id FROM users WHERE (${checkFields.join(' OR ')}) AND id != ?`,
        checkValues
      );

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'Username or email already exists'
        });
      }
    }

    // Add updated_at timestamp and user ID
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    // Execute the update
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    await DatabaseService.executeCommand(query, values);

    // Get updated user data
    const updatedUser = await DatabaseService.executeQuerySingle<User>(
      'SELECT id, username, email, role, avatar_url, linkedin_url, created_date FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// POST /profile/avatar - Update avatar only
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

    // Upload to Supabase Storage
    const supabaseService = new SupabaseStorageService();
    
    // Generate unique filename for avatar
    const fileExtension = req.file.mimetype.split('/')[1];
    const filename = `avatars/user-${userId}-${Date.now()}.${fileExtension}`;
    
    console.log(`📸 Uploading avatar for user ${userId}: ${filename}`);
    
    // Upload file to Supabase
    const uploadResult = await supabaseService.uploadFile(
      req.file.buffer,
      filename,
      req.file.mimetype
    );

    if (!uploadResult.success) {
      console.error('❌ Avatar upload failed:', uploadResult.error);
      return res.status(500).json({
        success: false,
        error: 'Failed to upload avatar to storage'
      });
    }

    console.log(`✅ Avatar uploaded successfully: ${uploadResult.publicUrl}`);

    // Update user avatar URL in database
    await DatabaseService.executeCommand(
      'UPDATE users SET avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [uploadResult.publicUrl, userId]
    );

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: { avatar_url: uploadResult.publicUrl }
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload avatar'
    });
  }
});

// PUT /profile/password - Change password only
router.put('/password', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
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

export default router;