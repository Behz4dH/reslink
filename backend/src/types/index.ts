export interface PitchInput {
  description: string;
  resume?: string;
  length?: 30 | 60 | 90; // seconds
  tone?: 'professional' | 'casual' | 'enthusiastic';
}

export interface GeneratedPitch {
  script: string;
  wordCount: number;
  estimatedDuration: number;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}