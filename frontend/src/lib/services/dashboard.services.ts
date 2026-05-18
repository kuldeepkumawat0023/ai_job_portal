import apiClient from '../apiClient';
import { ApiResponse } from '../apiClient';

/**
 * 📊 Dashboard Service
 * Provides statistical data for Candidate and Recruiter dashboards.
 */
export const dashboardService = {
  /**
   * Get statistics for candidate (Applied jobs, Saved, etc.)
   * GET /api/v1/dashboard/candidate
   */
  getCandidateStats: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/dashboard/candidate');
    return response.data;
  },

  /**
   * Get statistics for recruiter (Job counts, Applicant counts, etc.)
   * GET /api/v1/dashboard/recruiter
   */
  getRecruiterStats: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/dashboard/recruiter');
    return response.data;
  },

  /**
   * Get detailed analytics for recruiter (Funnel, Quality, Trends)
   * GET /api/v1/dashboard/analytics
   */
  getRecruiterAnalytics: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/dashboard/analytics');
    return response.data;
  },
};
