import apiClient from '../apiClient';
import { ApiResponse } from '../apiClient';

export interface Interview {
  _id: string;
  jobId: {
    _id: string;
    title: string;
  } | string;
  candidateId: {
    _id: string;
    fullname: string;
    email: string;
    profilePhoto?: string;
  } | string;
  companyId: {
    _id: string;
    name: string;
    logo?: string;
  } | string;
  date: string;
  time: string;
  mode: 'Google Meet';
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 🗓️ Interview Service
 * Manages interview scheduling and status tracking.
 */
export const interviewService = {
  /**
   * Schedule a new interview (Recruiter)
   * POST /api/v1/interview/schedule
   */
  scheduleInterview: async (data: any): Promise<ApiResponse<Interview>> => {
    const response = await apiClient.post('/interview/schedule', data);
    return response.data;
  },

  /**
   * Get all interviews for current user (Candidate/Recruiter)
   * GET /api/v1/interview/my-interviews
   */
  getMyInterviews: async (): Promise<ApiResponse<Interview[]>> => {
    const response = await apiClient.get('/interview/my-interviews');
    return response.data;
  },

  /**
   * Update interview status
   * PUT /api/v1/interview/:id/status
   */
  updateStatus: async (id: string, status: string): Promise<ApiResponse<Interview>> => {
    const response = await apiClient.put(`/interview/${id}/status`, { status });
    return response.data;
  },

  /**
   * Submit interview feedback & rating (Candidate)
   * PUT /api/v1/interview/:id/feedback
   */
  submitFeedback: async (id: string, feedback: string, rating: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/interview/${id}/feedback`, { feedback, rating });
    return response.data;
  },
};

