interface Reslink {
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
  unique_id?: string;
  updated_date?: string;
  avatar_url?: string;
  linkedin_url?: string;
}

export type { Reslink };