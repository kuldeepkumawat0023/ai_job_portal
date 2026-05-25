import apiClient, { ApiResponse, AuthUser } from '../apiClient';

/**
 * 🔐 Advanced Auth Service
 * Perfectly matched to the Node.js backend controllers.
 */
export const authService = {
  /**
   * Login user
   */
  login: async (data: any): Promise<ApiResponse<{ user: AuthUser; token: string }>> => {
    const response = await apiClient.post('/user/login', data);
    return response.data;
  },

  /**
   * Google Login (Social)
   */
  googleLogin: async (idToken: string): Promise<ApiResponse<{ user: AuthUser; token: string }>> => {
    const response = await apiClient.post('/user/google-login', { idToken });
    return response.data;
  },

  /**
   * Register user
   */
  register: async (data: any): Promise<ApiResponse<{ user: AuthUser; token?: string; isReactivation?: boolean }>> => {
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
   * Verify OTP (Step 2 of Password Reset or Reactivation)
   */
  verifyOtp: async (data: { email: string; otp: string }): Promise<ApiResponse> => {
    const response = await apiClient.post('/user/verify-otp', data);
    return response.data;
  },

  /**
   * Reset Password (Step 3)
   */
  resetPassword: async (data: any): Promise<ApiResponse> => {
    const response = await apiClient.post('/user/reset-password', data);
    return response.data;
  },

  /**
   * Reactivate Account (After soft-delete)
   */
  reactivateAccount: async (data: any): Promise<ApiResponse> => {
    const response = await apiClient.post('/user/reactivate-account', data);
    return response.data;
  },

  /**
   * Send OTP for Hiring Mode transition
   */
  sendHiringOtp: async (): Promise<ApiResponse> => {
    const response = await apiClient.post('/user/send-hiring-otp');
    return response.data;
  },

  /**
   * Verify OTP for Hiring Mode transition
   */
  verifyHiringOtp: async (otp: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/user/verify-hiring-otp', { otp });
    return response.data;
  },

  /**
   * Get Current User Profile
   */
  getProfile: async (): Promise<ApiResponse<{ user: AuthUser }>> => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse> => {
    const response = await apiClient.post('/user/logout');
    return response.data;
  },
};
