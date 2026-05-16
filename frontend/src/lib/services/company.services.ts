import apiClient from '../apiClient';
import { ApiResponse } from '../apiClient';

export interface Company {
  _id: string;
  name: string;
  description: string;
  website: string;
  location: string;
  logo?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 🏢 Company Service
 * Handles company registration and profile management.
 */
export const companyService = {
  /**
   * Register a new company
   * POST /api/v1/company/register
   */
  registerCompany: async (data: any): Promise<ApiResponse<Company>> => {
    const response = await apiClient.post('/company/register', data);
    return response.data;
  },

  /**
   * Get all companies
   * GET /api/v1/company/all
   */
  getCompanies: async (): Promise<ApiResponse<Company[]>> => {
    const response = await apiClient.get('/company/all');
    return response.data;
  },

  /**
   * Get company details by ID
   * GET /api/v1/company/:id
   */
  getCompanyById: async (id: string): Promise<ApiResponse<Company>> => {
    const response = await apiClient.get(`/company/${id}`);
    return response.data;
  },

  /**
   * Update company profile (including logo)
   * PUT /api/v1/company/update/:id
   */
  updateCompany: async (id: string, data: FormData | any): Promise<ApiResponse<Company>> => {
    const response = await apiClient.put(`/company/update/${id}`, data);
    return response.data;
  },
};
