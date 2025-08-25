"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseStorageService = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const fs_1 = __importDefault(require("fs"));
// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
let supabase = null;
if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-supabase') || supabaseKey.includes('your-supabase')) {
    console.warn('Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
}
else {
    try {
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
            throw new Error('Supabase client not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
        }
        try {
            // Read the file
            const fileBuffer = fs_1.default.readFileSync(filePath);
            // Generate unique filename with timestamp
            const timestamp = Date.now();
            const uniqueFileName = `${timestamp}-${fileName}`;
            const storagePath = `videos/${uniqueFileName}`;
            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from(this.bucketName)
                .upload(storagePath, fileBuffer, {
                contentType: 'video/mp4',
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
    // Upload resume file to Supabase Storage
    async uploadResume(filePath, fileName) {
        if (!supabase) {
            throw new Error('Supabase client not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
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
    // Check if bucket exists and create if needed
    async initializeBucket() {
        if (!supabase) {
            console.log('Skipping Supabase bucket initialization - client not configured');
            return;
        }
        try {
            // Try to get bucket info
            const { data: buckets } = await supabase.storage.listBuckets();
            const bucketExists = buckets?.some((bucket) => bucket.name === this.bucketName);
            if (!bucketExists) {
                // Create bucket
                const { error } = await supabase.storage.createBucket(this.bucketName, {
                    public: true,
                    allowedMimeTypes: ['video/mp4', 'video/webm', 'application/pdf'],
                    fileSizeLimit: 100 * 1024 * 1024 // 100MB limit
                });
                if (error) {
                    console.error('Error creating bucket:', error);
                }
                else {
                    console.log(`Created Supabase storage bucket: ${this.bucketName}`);
                }
            }
            else {
                console.log(`Supabase storage bucket '${this.bucketName}' already exists`);
            }
        }
        catch (error) {
            console.error('Error initializing Supabase bucket:', error);
        }
    }
}
exports.SupabaseStorageService = SupabaseStorageService;
exports.default = SupabaseStorageService;
//# sourceMappingURL=supabaseService.js.map