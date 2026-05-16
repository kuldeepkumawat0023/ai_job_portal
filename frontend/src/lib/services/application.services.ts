import apiClient from '../apiClient';
import { ApiResponse, AuthUser } from '../apiClient';
import { Job } from './job.services';

/**
 * 📝 Application Interface (Synced with Backend Application model)
 */
export interface Application {
  _id: string;
  jobId: Job | string;
  applicantId: AuthUser | string;
  status: 'pending' | 'accepted' | 'rejected' | 'interview' | 'shortlisted' | 'hired';
  createdAt: string;
  updatedAt: string;
}

/**
 * 📝 Application Service
 * Perfectly synchronized with ApplicationController.js
 */
export const applicationService = {
  /**
   * Apply for a job
   * POST /api/v1/application/apply/:id
   */
  applyJob: async (jobId: string): Promise<ApiResponse<Application>> => {
    const response = await apiClient.post(`/application/apply/${jobId}`);
    return response.data;
  },

  /**
   * Get candidate's applied jobs
   * GET /api/v1/application/applied
   */
  getAppliedJobs: async (): Promise<ApiResponse<Application[]>> => {
    const response = await apiClient.get('/application/applied');
    return response.data;
  },

  /**
   * Get Kanban pipeline for a specific job (Recruiter view - grouped by status)
   * GET /api/v1/application/pipeline/:jobId
   */
  getPipeline: async (jobId: string): Promise<ApiResponse<{
    pending: Application[],
    shortlisted: Application[],
    interview: Application[],
    hired: Application[],
    rejected: Application[]
  }>> => {
    const response = await apiClient.get(`/application/pipeline/${jobId}`);
    return response.data;
  },

  /**
   * Get flat list of applicants for a specific job (Recruiter view)
   * GET /api/v1/application/:id/applicants
   */
  getApplicants: async (jobId: string): Promise<ApiResponse<Application[]>> => {
    const response = await apiClient.get(`/application/${jobId}/applicants`);
    return response.data;
  },

  /**
   * Update application status (ATS)
   * PUT /api/v1/application/status/:id/update
   */
  updateStatus: async (applicationId: string, status: string): Promise<ApiResponse<Application>> => {
    const response = await apiClient.put(`/application/status/${applicationId}/update`, { status });
    return response.data;
  },
};
