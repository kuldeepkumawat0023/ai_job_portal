import apiClient, { ApiResponse, AuthUser } from '../apiClient';

export interface Job {
  _id: string;
  user: Partial<AuthUser>;
  title: string;
  companyName: string;
  logo?: string;
  category?: string;
  description: string;
  requirements?: string;
  perks?: string;
  jobType: 'Full Time' | 'Part Time' | 'Contract' | 'Internship' | 'Freelance' | 'Remote' | 'Hybrid' | 'On-Site';
  location: string;
  salaryRange?: string;
  experienceRequired?: string;
  contactEmail?: string;
  contactMobile?: string;
  applyLink?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface JobListingData {
  jobs: Job[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

const JOB_PATHS = {
  BASE: '/job',
  GET_ONE: (id: string) => `/job/${id}`,
  GET_USER_JOBS: '/job/getadminjobs',
  POST: '/job/post',
};

export const jobService = {
  /**
   * Fetch all jobs (with optional filters)
   */
  getJobs: async (params?: Record<string, unknown>): Promise<ApiResponse<JobListingData>> => {
    const response = await apiClient.get(JOB_PATHS.BASE + '/get', { params });
    return response.data;
  },

  /**
   * Fetch a single job by ID
   */
  getJobById: async (id: string): Promise<ApiResponse<{ job: Job }>> => {
    const response = await apiClient.get(JOB_PATHS.GET_ONE(id));
    return response.data;
  },

  /**
   * Create a new job post
   */
  createJob: async (data: Partial<Job> | FormData): Promise<ApiResponse<{ job: Job }>> => {
    const response = await apiClient.post(JOB_PATHS.POST, data);
    return response.data;
  },

  /**
   * Fetch logged-in recruiter's jobs
   */
  getMyJobs: async (): Promise<ApiResponse<{ jobs: Job[] }>> => {
    const response = await apiClient.get(JOB_PATHS.GET_USER_JOBS);
    return response.data;
  },
};
