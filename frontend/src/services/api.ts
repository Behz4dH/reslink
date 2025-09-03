import type { PitchInput, GeneratedPitch, ApiResponse } from '../types';
import type { Reslink } from '../types/reslink';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle rate limiting and other non-JSON responses
      if (!response.ok) {
        let errorMessage = 'Request failed';
        
        try {
          const data = await response.json();
          errorMessage = data.error || data.message || 'Request failed';
        } catch (jsonError) {
          // If JSON parsing fails, use the response text
          const text = await response.text();
          errorMessage = text || `HTTP ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
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

  // Enhanced Reslinks API methods with query support
  async getReslinks(params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    filters?: Record<string, any>;
  } = {}): Promise<{
    data: Reslink[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    meta?: {
      sortBy?: string;
      sortOrder?: string;
      filters?: Record<string, any>;
    };
  }> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'filters' && typeof value === 'object') {
          Object.entries(value).forEach(([filterKey, filterValue]) => {
            if (filterValue !== undefined && filterValue !== null) {
              searchParams.append(filterKey, String(filterValue));
            }
          });
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const response = await this.request<{
      data: Reslink[];
      pagination: any;
      meta: any;
    }>(`/reslinks?${searchParams.toString()}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch reslinks');
    }

    return response.data;
  }

  // Legacy method for backward compatibility
  async getAllReslinks(): Promise<Reslink[]> {
    const result = await this.getReslinks({ limit: 100 }); // Get all with high limit
    return result.data;
  }

  // Convenience methods
  async getReslinksByStatus(status: string, params: any = {}) {
    return this.getReslinks({ ...params, filters: { status } });
  }

  async searchReslinks(search: string, params: any = {}) {
    return this.getReslinks({ ...params, search });
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
      headers: this.getAuthHeaders(),
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
      headers: this.getAuthHeaders(),
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

  // Analytics and engagement methods
  async getAnalytics(reslinkId: number, days: number = 30) {
    const response = await this.request<any>(`/reslinks/${reslinkId}/analytics?days=${days}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch analytics');
    }
    
    return response.data;
  }

  async getRecentViews(limit: number = 20) {
    const response = await this.request<any>(`/reslinks/recent-views?limit=${limit}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch recent views');
    }
    
    return response.data;
  }

  // User profile management methods
  async updateProfile(profileData: { [key: string]: any }) {
    const response = await this.request<any>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to update profile');
    }

    return response.data;
  }

  async uploadAvatar(avatarFile: File) {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to upload avatar');
    }

    return await response.json();
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }) {
    const response = await this.request<any>('/profile/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to change password');
    }

    return response.data;
  }

  async addBadgeToPDF(reslinkId: number, pdfFile: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('pdf', pdfFile);

    const response = await fetch(`${API_BASE_URL}/reslinks/${reslinkId}/add-badge`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to add badge to PDF');
    }

    return response.blob();
  }
}

export const apiService = new ApiService();