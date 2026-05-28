import apiClient from '../apiClient';
import { ApiResponse, AuthUser } from '../apiClient';

export const adminService = {
  getDashboardStats: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },

  getTransactions: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/transactions');
    return response.data;
  },

  importBulkJobs: async (formData: FormData): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/admin/jobs/bulk-import', formData);
    return response.data;
  },

  getAllUsers: async (): Promise<ApiResponse<AuthUser[]>> => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  suspendUser: async (id: string): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.put(`/admin/user/${id}/suspend`);
    return response.data;
  },

  activateUser: async (id: string): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.put(`/admin/user/${id}/activate`);
    return response.data;
  },

  updateUser: async (id: string, data: any): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.put(`/admin/user/${id}/update`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/admin/user/${id}/delete`);
    return response.data;
  },
};
