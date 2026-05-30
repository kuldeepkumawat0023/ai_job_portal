import apiClient from '../apiClient';
import { ApiResponse } from '../apiClient';
import axios from 'axios';

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

interface CloudinarySignature {
  timestamp: number;
  signature: string;
  cloudName: string;
  apiKey: string;
  folder: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB client-side limit

/**
 * 📄 Resume Service
 * Handles resume uploads (direct to Cloudinary), AI analysis, and version management.
 */
export const resumeService = {
  /**
   * Get a signed Cloudinary upload signature from the backend.
   * GET /api/v1/resume/cloudinary-sign
   */
  getCloudinarySignature: async (): Promise<CloudinarySignature> => {
    const response = await apiClient.get('/resume/cloudinary-sign');
    return response.data.data;
  },

  /**
   * Upload a file directly to Cloudinary from the browser.
   * Returns the secure Cloudinary URL.
   * @param file - The File object to upload
   * @param signData - Signed upload params from the backend
   * @param onProgress - Optional progress callback (0-100)
   */
  uploadToCloudinary: async (
    file: File,
    signData: CloudinarySignature,
    onProgress?: (percent: number) => void
  ): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signData.apiKey);
    formData.append('timestamp', String(signData.timestamp));
    formData.append('signature', signData.signature);
    formData.append('folder', signData.folder);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${signData.cloudName}/raw/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      }
    );

    return res.data.secure_url;
  },

  /**
   * Helper to attempt client-side compression for PDFs.
   * Loads the PDF and saves it, which strips unused objects and sometimes reduces file size.
   */
  compressPDF: async (file: File): Promise<File> => {
    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      // Saving without any modifications can sometimes reduce file size by stripping out garbage
      const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
      
      // Wrap the Uint8Array in an Array to satisfy the File constructor's BlobPart[] type
      return new File([pdfBytes as any], file.name, { type: 'application/pdf' });
    } catch (error) {
      console.error('Failed to compress PDF', error);
      return file; // fallback to original file
    }
  },

  /**
   * Full upload flow: sign → upload to Cloudinary → save URL to backend.
   * POST /api/v1/resume/upload
   * @param file - The File object to upload
   * @param onProgress - Optional progress callback (0-100)
   */
  uploadResume: async (
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<ApiResponse<Resume>> => {
    let finalFile = file;

    // 1. Client-side file size validation & compression
    if (file.type === 'application/pdf' && file.size > 5 * 1024 * 1024) {
      finalFile = await resumeService.compressPDF(file);
    }

    if (finalFile.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit even after compression`);
    }

    // 2. Get signed upload params from backend (tiny JSON request)
    const signData = await resumeService.getCloudinarySignature();

    // 3. Upload file directly to Cloudinary (bypasses Vercel's body limit)
    const fileUrl = await resumeService.uploadToCloudinary(finalFile, signData, onProgress);

    // 4. Save the Cloudinary URL to backend (tiny JSON request)
    const response = await apiClient.post('/resume/upload', { fileUrl });
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

