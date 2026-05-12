import apiClient, { ApiResponse, AuthUser } from '../apiClient';

export const authService = {
  /**
   * Login user
   */
  login: async (data: any): Promise<ApiResponse<{ user: AuthUser; token: string }>> => {
    const response = await apiClient.post('/user/login', data);
    return response.data;
  },

  /**
   * Register user
   */
  register: async (data: any): Promise<ApiResponse<{ user: AuthUser }>> => {
    const response = await apiClient.post('/user/register', data);
    return response.data;
  },

  /**
   * Forgot Password - Trigger OTP
   */
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/user/forgot-password', { email });
    return response.data;
  },

  /**
   * Verify OTP
   */
  verifyOtp: async (data: { email: string; otp: string }): Promise<ApiResponse> => {
    const response = await apiClient.post('/user/verify-otp', data);
    return response.data;
  },

  /**
   * Reset Password
   */
  resetPassword: async (data: any): Promise<ApiResponse> => {
    const response = await apiClient.post('/user/reset-password', data);
    return response.data;
  },

  /**
   * Get Current User Profile
   */
  getProfile: async (): Promise<ApiResponse<{ user: AuthUser }>> => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },
};
