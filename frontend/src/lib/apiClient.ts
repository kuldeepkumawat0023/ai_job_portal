import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * 🚀 Advanced AI Job Portal API Client
 * Perfectly synced with Node.js backend & Market-Ready.
 */

// ─── Storage Keys ────────────────────────────────────────────────────────────
export const TOKEN_KEY = 'portal_token';
export const USER_KEY = 'portal_user';

// ─── Synchronized Types (AJP Backend Model: User.js) ─────────────────────────
export interface Education {
  degree: string;
  university: string;
  cgpa: string;
  year: string;
}

export interface WorkExperience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface Project {
  title: string;
  stack: string[];
  description: string;
  link: string;
}

export interface AuthUser {
  _id: string;
  fullname: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  role: 'candidate' | 'recruiter' | 'admin';
  profilePhoto?: string;
  location?: string;
  bio?: string;
  skills: string[];
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
  experience: number;
  hasCompanyProfile: boolean;
  isPremium: boolean;
  resume?: string;
  jobSearches: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

// ─── Base URL Configuration ──────────────────────────────────────────────────
export const getBackendBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
};

const apiClient = axios.create({
  baseURL: getBackendBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor (Security & Files) ──────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // 1. Dual-Storage Token Recovery
      let token = Cookies.get(TOKEN_KEY);
      if (!token) {
        token = localStorage.getItem(TOKEN_KEY) || undefined;
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 2. Automatic Multipart/Form-Data Handling (for Resumes/Photos)
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor (Anti-Crash & Auto-Logout) ─────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const resData = error.response?.data;

    // 1. Global Logout on 401 (Unauthorized) or 403 (Suspended)
    if (error.response?.status === 401 || (error.response?.status === 403 && resData?.message?.toLowerCase().includes('deactivated'))) {
      if (typeof window !== 'undefined') {
        Cookies.remove(TOKEN_KEY, { path: '/' });
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/';
        }
      }
    }

    // 2. Extract Backend Error Message (Prevents Generic "Axios Error")
    if (resData && resData.message) {
      error.message = resData.message;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
