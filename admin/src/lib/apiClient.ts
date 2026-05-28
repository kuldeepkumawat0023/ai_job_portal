import axios from 'axios';
import Cookies from 'js-cookie';

export const TOKEN_KEY = 'portal_token';
export const USER_KEY = 'portal_user';

export interface Education {
  degree: string;
  university: string;
  board?: string;
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

export interface Certificate {
  name: string;
  issuer: string;
  year: string;
}

export interface PersonalDetail {
  dob?: string;
  gender?: string;
  languages?: string;
  hobbies?: string;
}

export interface AuthUser {
  _id: string;
  fullname: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  role: 'candidate' | 'recruiter' | 'admin' | 'super_admin';
  profilePhoto?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  categorizedSkills?: Array<{ title: string; skills: string[] }>;
  education: Education[];
  certificates?: Certificate[];
  personalDetail?: PersonalDetail;
  workExperience: WorkExperience[];
  projects: Project[];
  experience: number;
  hasCompanyProfile: boolean;
  companyId?: string;
  isPremium: boolean;
  resume?: string;
  isFresher?: boolean;
  jobSearches: number;
  isActive: boolean;
  jobRole?: string;
  department?: string;
  twoFactorEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

export const getBackendBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
};

const apiClient = axios.create({
  baseURL: getBackendBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      let token = Cookies.get(TOKEN_KEY);
      if (!token) {
        token = localStorage.getItem(TOKEN_KEY) || undefined;
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const resData = error.response?.data;
    if (
      error.response?.status === 401 ||
      (error.response?.status === 403 && resData?.message?.toLowerCase().includes('deactivated'))
    ) {
      if (typeof window !== 'undefined') {
        Cookies.remove(TOKEN_KEY, { path: '/' });
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    if (resData && resData.message) {
      error.message = resData.message;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
