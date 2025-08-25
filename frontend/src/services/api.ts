import type { PitchInput, GeneratedPitch, ApiResponse } from '../types';
import type { Reslink } from '../types/reslink';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async generatePitch(input: PitchInput): Promise<GeneratedPitch> {
    const response = await this.request<GeneratedPitch>('/pitch/generate', {
      method: 'POST',
      body: JSON.stringify(input),
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to generate pitch');
    }

    return response.data;
  }

  // Reslink API methods
  async getAllReslinks(): Promise<Reslink[]> {
    const response = await this.request<Reslink[]>('/reslinks');

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch reslinks');
    }

    return response.data;
  }

  async getReslinkById(id: number): Promise<Reslink> {
    const response = await this.request<Reslink>(`/reslinks/${id}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch reslink');
    }

    return response.data;
  }

  async createReslink(reslink: Omit<Reslink, 'id' | 'created_date' | 'updated_date' | 'unique_id' | 'view_count'>): Promise<Reslink> {
    const response = await this.request<Reslink>('/reslinks', {
      method: 'POST',
      body: JSON.stringify(reslink),
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create reslink');
    }

    return response.data;
  }

  async updateReslink(id: number, updates: Partial<Reslink>): Promise<Reslink> {
    const response = await this.request<Reslink>(`/reslinks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update reslink');
    }

    return response.data;
  }

  async deleteReslink(id: number): Promise<void> {
    const response = await this.request<void>(`/reslinks/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete reslink');
    }
  }

  async trackReslinkView(uniqueId: string): Promise<any> {
    const response = await this.request<any>(`/reslinks/view/${uniqueId}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to track view');
    }

    return response.data;
  }

  // File Upload API methods
  async uploadVideo(videoFile: File): Promise<{ url: string; path: string; originalName: string; size: number }> {
    const formData = new FormData();
    formData.append('video', videoFile);

    const response = await fetch(`${API_BASE_URL}/upload/video`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Video upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to upload video');
    }

    return data.data;
  }

  async uploadResume(resumeFile: File): Promise<{ url: string; path: string; originalName: string; size: number }> {
    const formData = new FormData();
    formData.append('resume', resumeFile);

    const response = await fetch(`${API_BASE_URL}/upload/resume`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Resume upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to upload resume');
    }

    return data.data;
  }

  async deleteFile(type: 'video' | 'resume', path: string): Promise<void> {
    const response = await this.request<void>(`/upload/${type}/${path}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete file');
    }
  }
}

export const apiService = new ApiService();