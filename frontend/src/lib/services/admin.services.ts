import apiClient from '../apiClient';
import { ApiResponse, AuthUser } from '../apiClient';

/**
 * 🛡️ Admin Service
 * Handles administrative operations, user management, and system stats.
 */
export const adminService = {
  /**
   * Get high-level system statistics
   * GET /api/v1/admin/stats
   */
  getDashboardStats: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },

  /**
   * Get revenue and transaction reports
   * GET /api/v1/admin/transactions
   */
  getTransactions: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/transactions');
    return response.data;
  },

  /**
   * Bulk import jobs via CSV/Excel
   * POST /api/v1/admin/jobs/bulk-import
   */
  importBulkJobs: async (formData: FormData): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/admin/jobs/bulk-import', formData);
    return response.data;
  },

  /**
   * Get all users in the system
   * GET /api/v1/admin/users
   */
  getAllUsers: async (): Promise<ApiResponse<AuthUser[]>> => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  /**
   * Suspend a user account
   * PUT /api/v1/admin/user/:id/suspend
   */
  suspendUser: async (id: string): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.put(`/admin/user/${id}/suspend`);
    return response.data;
  },

  /**
   * Activate a suspended account
   * PUT /api/v1/admin/user/:id/activate
   */
  activateUser: async (id: string): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.put(`/admin/user/${id}/activate`);
    return response.data;
  },

  /**
   * Update any user's profile data
   * PUT /api/v1/admin/user/:id/update
   */
  updateUser: async (id: string, data: any): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.put(`/admin/user/${id}/update`, data);
    return response.data;
  },

  /**
   * Delete a user permanently
   * DELETE /api/v1/admin/user/:id/delete
   */
  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/admin/user/${id}/delete`);
    return response.data;
  },
};
