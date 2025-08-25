"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const supabaseService_1 = __importDefault(require("../services/supabaseService"));
const supabaseService = new supabaseService_1.default();
exports.uploadRouter = (0, express_1.Router)();
// Test route for debugging
exports.uploadRouter.get('/test', (req, res) => {
    res.json({ message: 'Upload router is working!' });
});
// Configure multer for temporary file storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../uploads/temp');
        // Create temp directory if it doesn't exist
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// File filter for videos and PDFs
const fileFilter = (req, file, cb) => {
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const allowedDocumentTypes = ['application/pdf'];
    if (allowedVideoTypes.includes(file.mimetype) || allowedDocumentTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only MP4, WebM, MOV videos and PDF files are allowed.'));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    }
});
// POST /api/upload/video - Upload video file
exports.uploadRouter.post('/video', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No video file provided'
            });
        }
        console.log('Uploading video to Supabase:', req.file.filename);
        // Upload to Supabase Storage
        const result = await supabaseService.uploadVideo(req.file.path, req.file.originalname);
        console.log('Video uploaded successfully:', result.url);
        res.json({
            success: true,
            data: {
                url: result.url,
                path: result.path,
                originalName: req.file.originalname,
                size: req.file.size
            },
            message: 'Video uploaded successfully'
        });
    }
    catch (error) {
        console.error('Video upload error:', error);
        // Clean up temp file if it exists
        if (req.file?.path && fs_1.default.existsSync(req.file.path)) {
            try {
                fs_1.default.unlinkSync(req.file.path);
            }
            catch (cleanupError) {
                console.error('Error cleaning up temp file:', cleanupError);
            }
        }
        res.status(500).json({
            success: false,
            message: 'Failed to upload video',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// POST /api/upload/resume - Upload resume file
exports.uploadRouter.post('/resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No resume file provided'
            });
        }
        console.log('Uploading resume to Supabase:', req.file.filename);
        // Upload to Supabase Storage
        const result = await supabaseService.uploadResume(req.file.path, req.file.originalname);
        console.log('Resume uploaded successfully:', result.url);
        res.json({
            success: true,
            data: {
                url: result.url,
                path: result.path,
                originalName: req.file.originalname,
                size: req.file.size
            },
            message: 'Resume uploaded successfully'
        });
    }
    catch (error) {
        console.error('Resume upload error:', error);
        // Clean up temp file if it exists
        if (req.file?.path && fs_1.default.existsSync(req.file.path)) {
            try {
                fs_1.default.unlinkSync(req.file.path);
            }
            catch (cleanupError) {
                console.error('Error cleaning up temp file:', cleanupError);
            }
        }
        res.status(500).json({
            success: false,
            message: 'Failed to upload resume',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// DELETE /api/upload/:type/:path - Delete uploaded file
exports.uploadRouter.delete('/:type/:path', async (req, res) => {
    try {
        const { type, path: filePath } = req.params;
        if (!['video', 'resume'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid file type'
            });
        }
        await supabaseService.deleteFile(filePath);
        res.json({
            success: true,
            message: `${type} deleted successfully`
        });
    }
    catch (error) {
        console.error('File delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete file',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = exports.uploadRouter;
//# sourceMappingURL=uploadController.js.map