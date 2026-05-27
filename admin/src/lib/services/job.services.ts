import apiClient from '../apiClient';
import { ApiResponse } from '../apiClient';

export interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  salary: string;
  location: string;
  jobType: string[];
  experience: number;
  category: string;
  companyId: any;
  postedBy: string;
  applications: string[];
  perks?: string[];
  createdAt: string;
  updatedAt: string;
  status?: string;
}

export const jobService = {
  getAllJobs: async (params?: { keyword?: string, location?: string, category?: string, jobType?: string }): Promise<ApiResponse<Job[]>> => {
    const response = await apiClient.get('/job/all', { params });
    return response.data;
  },

  getJobById: async (id: string): Promise<ApiResponse<Job>> => {
    const response = await apiClient.get(`/job/get/${id}`);
    return response.data;
  },

  postJob: async (data: any): Promise<ApiResponse<Job>> => {
    const response = await apiClient.post('/job/post', data);
    return response.data;
  },

  getAdminJobs: async (): Promise<ApiResponse<Job[]>> => {
    const response = await apiClient.get('/job/admin/jobs');
    return response.data;
  },

  updateJob: async (id: string, data: Partial<Job>): Promise<ApiResponse<Job>> => {
    const response = await apiClient.put(`/job/update/${id}`, data);
    return response.data;
  },

  deleteJob: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/job/delete/${id}`);
    return response.data;
  },

  approveJob: async (id: string): Promise<ApiResponse<Job>> => {
    const response = await apiClient.put(`/job/approve/${id}`);
    return response.data;
  },
};
