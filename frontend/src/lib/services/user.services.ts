import apiClient from '../apiClient';
import { AuthUser, ApiResponse } from '../apiClient';

/**
 * 👤 User Service
 * Handles profile management, updates, and user queries.
 */
export const userService = {
  /**
   * Get all users (Admin)
   * GET /api/v1/user/all
   */
  getUsers: async (): Promise<ApiResponse<AuthUser[]>> => {
    const response = await apiClient.get('/user/all');
    return response.data;
  },

  /**
   * Get profile by ID
   * GET /api/v1/user/profile/:id
   */
  getProfile: async (id: string): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.get(`/user/profile/${id}`);
    return response.data;
  },

  /**
   * Update profile data
   * PUT /api/v1/user/profile/update/:id
   */
  updateProfile: async (id: string, data: any): Promise<ApiResponse<AuthUser>> => {
    // If data is FormData (for photo), apiClient interceptor handles Content-Type
    const response = await apiClient.put(`/user/profile/update/${id}`, data);
    return response.data;
  },

  /**
   * Update resume
   * PUT /api/v1/user/profile/resume/:id
   */
  updateResume: async (id: string, formData: FormData): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.put(`/user/profile/resume/${id}`, formData);
    return response.data;
  },

  /**
   * Delete profile
   * DELETE /api/v1/user/profile/delete/:id
   */
  deleteProfile: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/user/profile/delete/${id}`);
    return response.data;
  },
};
