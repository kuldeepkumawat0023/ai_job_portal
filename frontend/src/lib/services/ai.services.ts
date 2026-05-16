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
   * Generate interview questions based on a specific resume
   * POST /api/v1/ai/resume-questions/:resumeId
   */
  generateResumeQuestions: async (resumeId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post(`/ai/resume-questions/${resumeId}`);
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

  /**
   * Get personalized career suggestions and skill radar data
   * GET /api/v1/ai/career-suggestions
   */
  getCareerSuggestions: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/ai/career-suggestions');
    return response.data;
  },

  /**
   * Analyze interview answer
   * POST /api/v1/ai/analyze-answer
   */
  analyzeAnswer: async (question: string, answer: string, context?: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/ai/analyze-answer', { question, answer, context });
    return response.data;
  },

  /**
   * Analyze feedback from a real company interview
   * POST /api/v1/ai/real-interview-feedback
   */
  analyzeRealInterviewFeedback: async (data: { 
    questions: string; 
    experience: string; 
    companyName?: string; 
    role?: string; 
  }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/ai/real-interview-feedback', data);
    return response.data;
  },
};
