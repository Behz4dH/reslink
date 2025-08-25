export interface Reslink {
    id?: number;
    title: string;
    name: string;
    position: string;
    company: string;
    created_date?: string;
    video_url?: string;
    resume_url?: string;
    status: 'draft' | 'published' | 'viewed' | 'multiple_views';
    view_count: number;
    last_viewed?: string;
    unique_id: string;
    updated_date?: string;
}
export declare class ReslinkModel {
    private db;
    constructor();
    private generateUniqueId;
    create(reslink: Omit<Reslink, 'id' | 'created_date' | 'updated_date' | 'unique_id' | 'view_count'>): Promise<Reslink>;
    getAll(): Promise<Reslink[]>;
    getById(id: number): Promise<Reslink | null>;
    getByUniqueId(uniqueId: string): Promise<Reslink | null>;
    update(id: number, updates: Partial<Reslink>): Promise<Reslink | null>;
    delete(id: number): Promise<boolean>;
    trackView(uniqueId: string): Promise<Reslink | null>;
}
export default ReslinkModel;
//# sourceMappingURL=reslinkModel.d.ts.map