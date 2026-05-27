import apiClient, { ApiResponse, AuthUser } from '../apiClient';

export const authService = {
  login: async (data: any): Promise<ApiResponse<{ user: AuthUser; token: string }>> => {
    const response = await apiClient.post('/user/login', data);
    return response.data;
  },

  googleLogin: async (idToken: string): Promise<ApiResponse<{ user: AuthUser; token: string }>> => {
    const response = await apiClient.post('/user/google-login', { idToken });
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<{ user: AuthUser }>> => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await apiClient.post('/user/logout');
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/user/forgot-password', { email });
    return response.data;
  },

  verifyOtp: async (data: { email: string; otp: string }): Promise<ApiResponse> => {
    const response = await apiClient.post('/user/verify-otp', data);
    return response.data;
  },

  resetPassword: async (data: { email: string | null; newPassword: string; confirmPassword: string }): Promise<ApiResponse> => {
    const response = await apiClient.post('/user/reset-password', data);
    return response.data;
  },

  reactivateAccount: async (data: { email: string | null; newPassword: string; confirmPassword: string }): Promise<ApiResponse> => {
    const response = await apiClient.post('/user/reactivate-account', data);
    return response.data;
  },
};
