import apiClient from '../apiClient';
import { ApiResponse } from '../apiClient';

export interface Resume {
  _id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  isDefault: boolean;
  score?: number;
  summary?: string;
  skills?: string[];
  strengths?: string[];
  weaknesses?: string[];
  coachingTips?: string[];
  experience?: string;
  recommendedRoles?: string[];
  isAnalyzed?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 📄 Resume Service
 * Handles resume uploads, AI analysis, and version management.
 */
export const resumeService = {
  /**
   * Upload a new resume
   * POST /api/v1/resume/upload
   */
  uploadResume: async (formData: FormData): Promise<ApiResponse<Resume>> => {
    const response = await apiClient.post('/resume/upload', formData);
    return response.data;
  },

  /**
   * Analyze a resume using AI
   * POST /api/v1/resume/analyze/:id
   */
  analyzeResume: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post(`/resume/analyze/${id}`);
    return response.data;
  },

  /**
   * Get resume analysis history
   * GET /api/v1/resume/history
   */
  getResumeHistory: async (): Promise<ApiResponse<Resume[]>> => {
    const response = await apiClient.get('/resume/history');
    return response.data;
  },

  /**
   * Get all resumes uploaded by the current user
   * GET /api/v1/resume/my-resumes
   */
  getMyResumes: async (): Promise<ApiResponse<Resume[]>> => {
    const response = await apiClient.get('/resume/my-resumes');
    return response.data;
  },

  /**
   * Set a specific resume as the default for applications
   * PUT /api/v1/resume/set-default/:id
   */
  setDefaultResume: async (id: string): Promise<ApiResponse<Resume>> => {
    const response = await apiClient.put(`/resume/set-default/${id}`);
    return response.data;
  },

  /**
   * Delete a resume
   * DELETE /api/v1/resume/:id
   */
  deleteResume: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/resume/${id}`);
    return response.data;
  },
};
