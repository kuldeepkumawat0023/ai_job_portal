import apiClient from '../apiClient';
import { AuthUser, ApiResponse } from '../apiClient';
import { resumeService } from './resume.services';

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
   * Update resume — uploads directly to Cloudinary from the browser,
   * then sends the resulting URL to the backend.
   * PUT /api/v1/user/profile/resume/:id
   */
  updateResume: async (
    id: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<ApiResponse<AuthUser>> => {
    let finalFile = file;

    // 1. Client-side file size validation & compression
    if (file.type === 'application/pdf' && file.size > 5 * 1024 * 1024) {
      finalFile = await resumeService.compressPDF(file);
    }

    // 2. Get signed upload params from backend
    const signData = await resumeService.getCloudinarySignature();

    // 3. Upload file directly to Cloudinary (bypasses Vercel's body limit)
    const resumeUrl = await resumeService.uploadToCloudinary(finalFile, signData, onProgress);

    // 4. Send the Cloudinary URL to backend (tiny JSON request)
    const response = await apiClient.put(`/user/profile/resume/${id}`, { resumeUrl });
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


  /**
   * Get team members
   * GET /api/v1/user/team/all
   */
  getTeamMembers: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/user/team/all');
    return response.data;
  },

  /**
   * Invite team member
   * POST /api/v1/user/team/invite
   */
  inviteTeamMember: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/user/team/invite', data);
    return response.data;
  },

  /**
   * Remove team member
   * DELETE /api/v1/user/team/remove/:id
   */
  removeTeamMember: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/user/team/remove/${id}`);
    return response.data;
  },

  /**
   * Get billing & subscription usage
   * GET /api/v1/user/billing/usage
   */
  getBillingUsage: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/user/billing/usage');
    return response.data;
  },
};
