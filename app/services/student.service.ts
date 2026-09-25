import { axiosInstance } from "../lib/axios";
import { ApiResponse, PaginatedResponse } from "../types/common";
import {
  StudentProfile,
  StudentDashboardSummary,
  Application,
  ListingSubmission,
} from "../types/student";

export const studentService = {
  // Get student dashboard overview
  getDashboard: async (): Promise<ApiResponse<StudentDashboardSummary>> => {
    const { data } = await axiosInstance.get<ApiResponse<StudentDashboardSummary>>("/api/student/dashboard");
    return data;
  },

  // Get student profile
  getProfile: async (): Promise<ApiResponse<StudentProfile>> => {
    const { data } = await axiosInstance.get<ApiResponse<StudentProfile>>("/api/student/profile");
    return data;
  },

  // Update student profile
  updateProfile: async (payload: Partial<StudentProfile>): Promise<ApiResponse<StudentProfile>> => {
    const { data } = await axiosInstance.put<ApiResponse<StudentProfile>>("/api/student/profile", payload);
    return data;
  },

  // Get student applications
  getApplications: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Application>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<Application>>("/api/student/applications", {
      params,
    });
    return data;
  },

  // Get single application
  getApplication: async (id: string): Promise<ApiResponse<Application>> => {
    const { data } = await axiosInstance.get<ApiResponse<Application>>(`/api/student/applications/${id}`);
    return data;
  },

  // Withdraw application within 24h
  withdrawApplication: async (id: string): Promise<ApiResponse<Application>> => {
    const { data } = await axiosInstance.delete<ApiResponse<Application>>(`/api/student/applications/${id}`);
    return data;
  },

  // Submit internship (URL or manual)
  submitListing: async (payload: {
    type: "url" | "manual";
    sourceUrl?: string;
    title?: string;
    company?: string;
    description?: string;
    location?: string;
    // workMode?: string;
    internshipType?: string;
    startPeriod?: string;
    endPeriod?: string;
    requirements?: string | string[];
    skills?: string[];
    applicationUrl?: string;
    deadline?: string;
  }): Promise<ApiResponse<{ submissionId: string; status: string }>> => {
    const { data } = await axiosInstance.post<ApiResponse<{ submissionId: string; status: string }>>(
      "/api/submissions",
      payload
    );
    return data;
  },

  // Get student submissions
  getSubmissions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<ListingSubmission>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<ListingSubmission>>("/api/student/submissions", {
      params,
    });
    return data;
  },
};
