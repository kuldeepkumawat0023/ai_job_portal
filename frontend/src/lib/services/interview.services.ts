import apiClient from '../apiClient';
import { ApiResponse } from '../apiClient';

export interface Interview {
  _id: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  scheduledAt: string;
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
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
};
