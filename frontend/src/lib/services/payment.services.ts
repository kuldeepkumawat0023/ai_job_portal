import apiClient from '../apiClient';
import { ApiResponse } from '../apiClient';

export interface PlanDetails {
  plan: 'free' | 'premium' | 'enterprise';
  jobPostsRemaining: number;
  aiAnalyzesRemaining: number;
  expiryDate?: string;
  isPremium: boolean;
}

/**
 * 💳 Payment Service
 * Handles subscriptions, Stripe checkout, and usage plans.
 */
export const paymentService = {
  /**
   * Create a Stripe checkout session for subscription
   * POST /api/v1/payment/checkout
   */
  createCheckout: async (planId: string): Promise<ApiResponse<{ url: string }>> => {
    const response = await apiClient.post('/payment/checkout', { planId });
    return response.data;
  },

  /**
   * Get current user's subscription plan and usage limits
   * GET /api/v1/payment/my-plan
   */
  getMyPlan: async (): Promise<ApiResponse<PlanDetails>> => {
    const response = await apiClient.get('/payment/my-plan');
    return response.data;
  },
};
