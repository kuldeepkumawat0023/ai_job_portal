import apiClient from '../apiClient';
import { AuthUser, ApiResponse } from '../apiClient';

export const userService = {
  getUsers: async (): Promise<ApiResponse<AuthUser[]>> => {
    const response = await apiClient.get('/user/all');
    return response.data;
  },

  getProfile: async (id: string): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.get(`/user/profile/${id}`);
    return response.data;
  },

  updateProfile: async (id: string, data: any): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.put(`/user/profile/update/${id}`, data);
    return response.data;
  },

  deleteProfile: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/user/profile/delete/${id}`);
    return response.data;
  },

  getTeamMembers: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/user/team/all');
    return response.data;
  },

  inviteTeamMember: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/user/team/invite', data);
    return response.data;
  },

  removeTeamMember: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/user/team/remove/${id}`);
    return response.data;
  },

  getBillingUsage: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/user/billing/usage');
    return response.data;
  },
};
