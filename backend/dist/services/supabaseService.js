"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseStorageService = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
let supabase = null;
if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-supabase') || supabaseKey.includes('your-supabase')) {
    console.warn('Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
}
else {
    try {
        const keyType = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service_role' : 'anon';
        console.log(`Supabase client initialized with ${keyType} key`);
        console.log('Key starts with:', supabaseKey.substring(0, 20) + '...');
        supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        console.log('Supabase client initialized successfully');
    }
    catch (error) {
        console.error('Error initializing Supabase client:', error);
    }
}
class SupabaseStorageService {
    constructor() {
        this.bucketName = 'reslinkVids';
    }
    // Upload video file to Supabase Storage
    async uploadVideo(filePath, fileName) {
        if (!supabase) {
            throw new Error('Supabase client not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
        }
        try {
            // Read the file
            const fileBuffer = fs_1.default.readFileSync(filePath);
            // Generate unique filename with timestamp
            const timestamp = Date.now();
            const uniqueFileName = `${timestamp}-${fileName}`;
            const storagePath = `videos/${uniqueFileName}`;
            // Determine content type based on file extension
            const ext = path_1.default.extname(fileName).toLowerCase();
            let contentType = 'video/mp4'; // default
            if (ext === '.webm')
                contentType = 'video/webm';
            else if (ext === '.mov')
                contentType = 'video/quicktime';
            console.log(`Uploading to bucket: ${this.bucketName}, path: ${storagePath}, size: ${fileBuffer.length} bytes`);
            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from(this.bucketName)
                .upload(storagePath, fileBuffer, {
                contentType,
                upsert: false
            });
            if (error) {
                console.error('Detailed Supabase error:', JSON.stringify(error, null, 2));
                throw new Error(`Supabase upload error: ${error.message}`);
            }
            // Get public URL
            const { data: urlData } = supabase.storage
                .from(this.bucketName)
                .getPublicUrl(storagePath);
            // Clean up temp file
            fs_1.default.unlinkSync(filePath);
            return {
                url: urlData.publicUrl,
                path: storagePath
            };
        }
        catch (error) {
            // Clean up temp file on error
            try {
                fs_1.default.unlinkSync(filePath);
            }
            catch (cleanupError) {
                console.error('Error cleaning up temp file:', cleanupError);
            }
            throw error;
        }
    }
    // Upload resume file to Supabase Storage
    async uploadResume(filePath, fileName) {
        if (!supabase) {
            throw new Error('Supabase client not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
        }
        try {
            // Read the file
            const fileBuffer = fs_1.default.readFileSync(filePath);
            // Generate unique filename with timestamp
            const timestamp = Date.now();
            const uniqueFileName = `${timestamp}-${fileName}`;
            const storagePath = `resumes/${uniqueFileName}`;
            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from(this.bucketName)
                .upload(storagePath, fileBuffer, {
                contentType: 'application/pdf',
                upsert: false
            });
            if (error) {
                throw new Error(`Supabase upload error: ${error.message}`);
            }
            // Get public URL
            const { data: urlData } = supabase.storage
                .from(this.bucketName)
                .getPublicUrl(storagePath);
            // Clean up temp file
            fs_1.default.unlinkSync(filePath);
            return {
                url: urlData.publicUrl,
                path: storagePath
            };
        }
        catch (error) {
            // Clean up temp file on error
            try {
                fs_1.default.unlinkSync(filePath);
            }
            catch (cleanupError) {
                console.error('Error cleaning up temp file:', cleanupError);
            }
            throw error;
        }
    }
    // Delete file from Supabase Storage
    async deleteFile(storagePath) {
        const { error } = await supabase.storage
            .from(this.bucketName)
            .remove([storagePath]);
        if (error) {
            throw new Error(`Supabase delete error: ${error.message}`);
        }
    }
    // Check if bucket exists (skip creation since it's done manually)
    async initializeBucket() {
        if (!supabase) {
            console.log('Skipping Supabase bucket initialization - client not configured');
            return;
        }
        console.log(`Using existing Supabase storage bucket: ${this.bucketName}`);
    }
}
exports.SupabaseStorageService = SupabaseStorageService;
exports.default = SupabaseStorageService;
//# sourceMappingURL=supabaseService.js.map