export declare class SupabaseStorageService {
    private bucketName;
    uploadVideo(filePath: string, fileName: string): Promise<{
        url: string;
        path: string;
    }>;
    uploadResume(filePath: string, fileName: string): Promise<{
        url: string;
        path: string;
    }>;
    deleteFile(storagePath: string): Promise<void>;
    initializeBucket(): Promise<void>;
}
export default SupabaseStorageService;
//# sourceMappingURL=supabaseService.d.ts.map