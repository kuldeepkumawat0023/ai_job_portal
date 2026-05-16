import apiClient from '../apiClient';
import { ApiResponse } from '../apiClient';

/**
 * 💼 Job Interface (Synced with Backend Job.js Model)
 */
export interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  salary: string; 
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
  experience: number;
  category: string;
  companyId: any; // Populated company details (name, logo, etc.)
  postedBy: string;
  applications: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 💼 Job Service
 * Perfectly synchronized with JobController.js
 */
export const jobService = {
  /**
   * Get all jobs with optional filters (keyword, location, category, jobType)
   * GET /api/v1/job/all
   */
  getAllJobs: async (params?: { keyword?: string, location?: string, category?: string, jobType?: string }): Promise<ApiResponse<Job[]>> => {
    const response = await apiClient.get('/job/all', { params });
    return response.data;
  },

  /**
   * Get job details by ID
   * GET /api/v1/job/get/:id
   */
  getJobById: async (id: string): Promise<ApiResponse<Job>> => {
    const response = await apiClient.get(`/job/get/${id}`);
    return response.data;
  },

  /**
   * Get recommended jobs based on candidate's profile
   * GET /api/v1/job/recommended
   */
  getRecommendedJobs: async (): Promise<ApiResponse<Job[]>> => {
    const response = await apiClient.get('/job/recommended');
    return response.data;
  },

  /**
   * Post a new job (Recruiter/Admin)
   * POST /api/v1/job/post
   */
  postJob: async (data: {
    title: string;
    description: string;
    requirements?: string | string[];
    salary?: string;
    location: string;
    jobType?: string;
    experience?: number;
    category: string;
    companyId: string;
  }): Promise<ApiResponse<Job>> => {
    const response = await apiClient.post('/job/post', data);
    return response.data;
  },

  /**
   * Get jobs posted by the current recruiter
   * GET /api/v1/job/admin/jobs
   */
  getAdminJobs: async (): Promise<ApiResponse<Job[]>> => {
    const response = await apiClient.get('/job/admin/jobs');
    return response.data;
  },

  /**
   * Update a job posting
   * PUT /api/v1/job/update/:id
   */
  updateJob: async (id: string, data: Partial<Job>): Promise<ApiResponse<Job>> => {
    const response = await apiClient.put(`/job/update/${id}`, data);
    return response.data;
  },

  /**
   * Delete a job posting
   * DELETE /api/v1/job/delete/:id
   */
  deleteJob: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/job/delete/${id}`);
    return response.data;
  },
};
