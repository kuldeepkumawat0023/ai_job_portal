import apiClient from '../apiClient';
import { ApiResponse } from '../apiClient';

export interface MockInterviewSession {
  _id: string;
  userId: string;
  jobTitle: string;
  questions: string[];
  answers: { question: string, answer: string, feedback?: any }[];
  status: 'started' | 'completed';
  createdAt: string;
  updatedAt: string;
}

/**
 * 🎤 Mock Interview Service
 * Handles AI-driven interview simulation and feedback.
 */
export const mockInterviewService = {
  /**
   * Generate interview questions based on job preferences
   * POST /api/v1/mock-interview/generate
   */
  generateQuestions: async (data: { jobTitle: string, jobDescription?: string }): Promise<ApiResponse<MockInterviewSession>> => {
    const response = await apiClient.post('/mock-interview/generate', data);
    return response.data;
  },

  /**
   * Submit an answer for a specific session question
   * POST /api/v1/mock-interview/:id/submit
   */
  submitAnswer: async (sessionId: string, data: { question: string, answer: string }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post(`/mock-interview/${sessionId}/submit`, data);
    return response.data;
  },

  /**
   * Get final AI result and feedback for an interview
   * GET /api/v1/mock-interview/:id/result
   */
  getInterviewResult: async (sessionId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/mock-interview/${sessionId}/result`);
    return response.data;
  },

  /**
   * Get all past mock interview sessions
   * GET /api/v1/mock-interview/my-sessions
   */
  getMySessions: async (): Promise<ApiResponse<MockInterviewSession[]>> => {
    const response = await apiClient.get('/mock-interview/my-sessions');
    return response.data;
  },
};
