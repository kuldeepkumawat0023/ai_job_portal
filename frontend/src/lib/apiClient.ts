import axios from 'axios';
import { getCookie } from 'cookies-next';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

export interface AuthUser {
  _id: string;
  fullname: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  profilePhoto?: string;
  role: 'candidate' | 'recruiter' | 'admin';
  hasCompanyProfile: boolean;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the bearer token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - potential session expiry');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
