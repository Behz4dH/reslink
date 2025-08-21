export interface PitchInput {
  description: string;
  length?: 30 | 60 | 90;
  tone?: 'professional' | 'casual' | 'enthusiastic';
}

export interface GeneratedPitch {
  script: string;
  wordCount: number;
  estimatedDuration: number;
  createdAt: Date;
}

export interface TeleprompterSettings {
  fontSize: 'small' | 'medium' | 'large';
  scrollSpeed: 1 | 2 | 3 | 4 | 5;
  isPlaying: boolean;
  currentPosition: number;
}

export interface VideoRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  recordedBlob: Blob | null;
  duration: number;
  error: string | null;
}

export interface MediaConstraints {
  video: {
    width: { ideal: number };
    height: { ideal: number };
    frameRate: { ideal: number };
  };
  audio: {
    echoCancellation: boolean;
    noiseSuppression: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}