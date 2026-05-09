import apiClient, { ApiResponse } from '../apiClient';

// ─── API Paths ──────────────────────────────────────────────────────────────

const ADMIN_PATHS = {
  STATS: 'admin/dashboard-stats',
  USERS: 'admin/users',
  COMPANIES: 'admin/companies',
  JOBS: 'admin/jobs',
};

// ─── Payload Types ────────────────────────────────────────────────────────────

export interface DashboardStatsData {
  totalUsers: number;
  totalCandidates: number;
  totalRecruiters: number;
  totalCompanies: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalRevenue: number;
  
  // Live analytics arrays for graphs
  revenueByMonth?: { month: string; amount: number }[];
  applicationsByDay?: { day: string; count: number }[];
}

// ─── The Admin Service ────────────────────────────────────────────────────────

export const adminService = {
  /**
   * Fetch Global Dashboard Stats (All project status at once)
   */
  getDashboardStats: async (params?: Record<string, any>): Promise<ApiResponse<DashboardStatsData>> => {
    const response = await apiClient.get(ADMIN_PATHS.STATS, { params });
    return response.data;
  },

  /**
   * Fetch All Users
   */
  getUsers: async (params?: Record<string, any>): Promise<ApiResponse> => {
    const response = await apiClient.get(ADMIN_PATHS.USERS, { params });
    return response.data;
  },

  /**
   * Fetch All Companies
   */
  getCompanies: async (params?: Record<string, any>): Promise<ApiResponse> => {
    const response = await apiClient.get(ADMIN_PATHS.COMPANIES, { params });
    return response.data;
  },

  /**
   * Fetch All Jobs
   */
  getJobs: async (params?: Record<string, any>): Promise<ApiResponse> => {
    const response = await apiClient.get(ADMIN_PATHS.JOBS, { params });
    return response.data;
  },
};
