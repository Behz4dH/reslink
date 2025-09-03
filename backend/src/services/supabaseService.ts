import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase: any = null;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-supabase') || supabaseKey.includes('your-supabase')) {
  console.warn('Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
} else {
  try {
    const keyType = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service_role' : 'anon';
    console.log(`Supabase client initialized with ${keyType} key`);
    console.log('Key starts with:', supabaseKey.substring(0, 20) + '...');
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
  }
}

export class SupabaseStorageService {
  private bucketName = 'reslinkVids';

  // Upload video file to Supabase Storage
  async uploadVideo(filePath: string, fileName: string): Promise<{ url: string; path: string }> {
    if (!supabase) {
      throw new Error('Supabase client not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
    }

    try {
      // Read the file
      const fileBuffer = fs.readFileSync(filePath);
      
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${fileName}`;
      const storagePath = `videos/${uniqueFileName}`;

      // Determine content type based on file extension
      const ext = path.extname(fileName).toLowerCase();
      let contentType = 'video/mp4'; // default
      if (ext === '.webm') contentType = 'video/webm';
      else if (ext === '.mov') contentType = 'video/quicktime';

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
      fs.unlinkSync(filePath);

      return {
        url: urlData.publicUrl,
        path: storagePath
      };
    } catch (error) {
      // Clean up temp file on error
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
      
      throw error;
    }
  }

  // Upload resume file to Supabase Storage
  async uploadResume(filePath: string, fileName: string): Promise<{ url: string; path: string }> {
    if (!supabase) {
      throw new Error('Supabase client not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
    }

    try {
      // Read the file
      const fileBuffer = fs.readFileSync(filePath);
      
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
      fs.unlinkSync(filePath);

      return {
        url: urlData.publicUrl,
        path: storagePath
      };
    } catch (error) {
      // Clean up temp file on error
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
      
      throw error;
    }
  }

  // Upload file from buffer (for profile pictures, etc.)
  async uploadFile(buffer: Buffer, fileName: string, contentType: string): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
    if (!supabase) {
      return {
        success: false,
        error: 'Supabase client not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env'
      };
    }

    try {
      console.log(`Uploading to bucket: ${this.bucketName}, path: ${fileName}, size: ${buffer.length} bytes`);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, buffer, {
          contentType,
          upsert: false
        });

      if (error) {
        console.error('Detailed Supabase error:', JSON.stringify(error, null, 2));
        return {
          success: false,
          error: `Supabase upload error: ${error.message}`
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName);

      return {
        success: true,
        publicUrl: urlData.publicUrl
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown upload error'
      };
    }
  }

  // Delete file from Supabase Storage
  async deleteFile(storagePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([storagePath]);

    if (error) {
      throw new Error(`Supabase delete error: ${error.message}`);
    }
  }

  // Check if bucket exists (skip creation since it's done manually)
  async initializeBucket(): Promise<void> {
    if (!supabase) {
      console.log('Skipping Supabase bucket initialization - client not configured');
      return;
    }

    console.log(`Using existing Supabase storage bucket: ${this.bucketName}`);
  }
}

export default SupabaseStorageService;