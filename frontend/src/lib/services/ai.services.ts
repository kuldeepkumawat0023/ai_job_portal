import apiClient from '../apiClient';
import { ApiResponse } from '../apiClient';

/**
 * 🤖 AI Service
 * Handles AI matching, job description generation, and coaching tips.
 */
export const aiService = {
  /**
   * Match current user's resume with a specific job
   * POST /api/v1/ai/match-job/:jobId
   */
  matchJob: async (jobId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post(`/ai/match-job/${jobId}`);
    return response.data;
  },

  /**
   * Get personalized career coaching tips
   * GET /api/v1/ai/coaching-tips
   */
  getCoachingTips: async (): Promise<ApiResponse<string[]>> => {
    const response = await apiClient.get('/ai/coaching-tips');
    return response.data;
  },

  /**
   * Generate interview questions for a job title/desc
   * POST /api/v1/ai/interview-questions
   */
  generateInterviewQuestions: async (data: { jobTitle: string, description?: string }): Promise<ApiResponse<string[]>> => {
    const response = await apiClient.post('/ai/interview-questions', data);
    return response.data;
  },

  /**
   * Generate AI Job Description (Recruiter)
   * POST /api/v1/ai/generate-job-desc
   */
  generateJobDescription: async (data: { title: string, company: string }): Promise<ApiResponse<string>> => {
    const response = await apiClient.post('/ai/generate-job-desc', data);
    return response.data;
  },
};
