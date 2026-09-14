import { axiosInstance } from "../lib/axios";
import { ApiResponse, PaginatedResponse } from "../types/common";
import { User } from "../types/auth";
import { StudentProfile, Application, ListingSubmission } from "../types/student";
import { Listing, Company } from "../types/listing";
import {
  AdminDashboardData,
  AdminApplicationDetail,
  AdminUserDetail,
  AuditLog,
  AdminInvitation,
} from "../types/admin";

export const adminService = {
  // Dashboard stats and overview
  getDashboard: async (): Promise<ApiResponse<AdminDashboardData>> => {
    const { data } = await axiosInstance.get<ApiResponse<AdminDashboardData>>("/api/admin/dashboard");
    return data;
  },

  // Users Management
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<User>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<User>>("/api/admin/users", {
      params,
    });
    return data;
  },

  getUserById: async (id: string): Promise<ApiResponse<AdminUserDetail>> => {
    const { data } = await axiosInstance.get<ApiResponse<AdminUserDetail>>(`/api/admin/users/${id}`);
    return data;
  },

  suspendUser: async (id: string): Promise<ApiResponse<User>> => {
    const { data } = await axiosInstance.patch<ApiResponse<User>>(`/api/admin/users/${id}/suspend`);
    return data;
  },

  reactivateUser: async (id: string): Promise<ApiResponse<User>> => {
    const { data } = await axiosInstance.patch<ApiResponse<User>>(`/api/admin/users/${id}/reactivate`);
    return data;
  },

  deactivateUser: async (id: string): Promise<ApiResponse<User>> => {
    const { data } = await axiosInstance.patch<ApiResponse<User>>(`/api/admin/users/${id}/deactivate`);
    return data;
  },

  getStudentProfile: async (id: string): Promise<ApiResponse<StudentProfile>> => {
    const { data } = await axiosInstance.get<ApiResponse<StudentProfile>>(`/api/admin/students/${id}/profile`);
    return data;
  },

  flagStudentProfile: async (id: string, reason?: string): Promise<ApiResponse<Record<string, unknown>>> => {
    const { data } = await axiosInstance.post<ApiResponse<Record<string, unknown>>>(
      `/api/admin/students/${id}/flag`,
      { reason }
    );
    return data;
  },

  // Companies Management
  getCompanies: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    state?: string;
  }): Promise<PaginatedResponse<Company>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<Company>>("/api/admin/companies", {
      params,
    });
    return data;
  },

  getCompanyById: async (id: string): Promise<ApiResponse<Company & { listings?: Listing[] }>> => {
    const { data } = await axiosInstance.get<ApiResponse<Company & { listings?: Listing[] }>>(
      `/api/admin/companies/${id}`
    );
    return data;
  },

  createCompany: async (payload: Partial<Company>, force?: boolean): Promise<ApiResponse<Company>> => {
    const { data } = await axiosInstance.post<ApiResponse<Company>>("/api/admin/companies", payload, {
      params: force ? { force: true } : undefined,
    });
    return data;
  },

  updateCompany: async (id: string, payload: Partial<Company>): Promise<ApiResponse<Company>> => {
    const { data } = await axiosInstance.put<ApiResponse<Company>>(`/api/admin/companies/${id}`, payload);
    return data;
  },

  // Listings Management
  getListings: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    companyId?: string;
    internshipType?: string;
    workMode?: string;
    category?: string;
    search?: string;
  }): Promise<PaginatedResponse<Listing>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<Listing>>("/api/admin/listings", {
      params,
    });
    return data;
  },

  getListingById: async (id: string): Promise<ApiResponse<Listing & { applicationCount?: number }>> => {
    const { data } = await axiosInstance.get<ApiResponse<Listing & { applicationCount?: number }>>(
      `/api/admin/listings/${id}`
    );
    return data;
  },

  createListing: async (payload: Partial<Listing>): Promise<ApiResponse<Listing>> => {
    const { data } = await axiosInstance.post<ApiResponse<Listing>>("/api/admin/listings", payload);
    return data;
  },

  updateListing: async (id: string, payload: Partial<Listing>): Promise<ApiResponse<Listing>> => {
    const { data } = await axiosInstance.put<ApiResponse<Listing>>(`/api/admin/listings/${id}`, payload);
    return data;
  },

  closeListing: async (id: string, closeReason?: string): Promise<ApiResponse<Listing>> => {
    const { data } = await axiosInstance.patch<ApiResponse<Listing>>(`/api/admin/listings/${id}/close`, {
      closeReason,
    });
    return data;
  },

  expireListing: async (id: string): Promise<ApiResponse<Listing>> => {
    const { data } = await axiosInstance.patch<ApiResponse<Listing>>(`/api/admin/listings/${id}/expire`);
    return data;
  },

  // Submissions Queue
  getSubmissions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<ListingSubmission>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<ListingSubmission>>("/api/admin/submissions", {
      params,
    });
    return data;
  },

  getSubmissionById: async (id: string): Promise<ApiResponse<ListingSubmission>> => {
    const { data } = await axiosInstance.get<ApiResponse<ListingSubmission>>(`/api/admin/submissions/${id}`);
    return data;
  },

  approveSubmission: async (
    id: string,
    payload: { companyId: string; [key: string]: unknown }
  ): Promise<ApiResponse<{ submission: ListingSubmission; listing: Listing }>> => {
    const { data } = await axiosInstance.patch<ApiResponse<{ submission: ListingSubmission; listing: Listing }>>(
      `/api/admin/submissions/${id}/approve`,
      payload
    );
    return data;
  },

  rejectSubmission: async (id: string, adminNote?: string): Promise<ApiResponse<ListingSubmission>> => {
    const { data } = await axiosInstance.patch<ApiResponse<ListingSubmission>>(
      `/api/admin/submissions/${id}/reject`,
      { adminNote }
    );
    return data;
  },

  // Applications Vetting & Workflow
  getApplications: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    listingId?: string;
    companyId?: string;
    studentId?: string;
    search?: string;
  }): Promise<PaginatedResponse<Application>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<Application>>("/api/admin/applications", {
      params,
    });
    return data;
  },

  getApplicationById: async (id: string): Promise<ApiResponse<AdminApplicationDetail>> => {
    const { data } = await axiosInstance.get<ApiResponse<AdminApplicationDetail>>(
      `/api/admin/applications/${id}`
    );
    return data;
  },

  reviewApplication: async (id: string): Promise<ApiResponse<Application>> => {
    const { data } = await axiosInstance.patch<ApiResponse<Application>>(`/api/admin/applications/${id}/review`);
    return data;
  },

  acceptApplication: async (id: string): Promise<ApiResponse<Application>> => {
    const { data } = await axiosInstance.patch<ApiResponse<Application>>(`/api/admin/applications/${id}/accept`);
    return data;
  },

  rejectApplication: async (id: string): Promise<ApiResponse<Application>> => {
    const { data } = await axiosInstance.patch<ApiResponse<Application>>(`/api/admin/applications/${id}/reject`);
    return data;
  },

  confirmPlacement: async (
    id: string,
    payload: { startDate?: string; endDate?: string; note?: string }
  ): Promise<ApiResponse<Application>> => {
    const { data } = await axiosInstance.patch<ApiResponse<Application>>(
      `/api/admin/applications/${id}/confirm-placement`,
      payload
    );
    return data;
  },

  // Audit Logs
  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    action?: string;
    performedById?: string;
    targetType?: string;
    targetId?: string;
    from?: string;
    to?: string;
  }): Promise<PaginatedResponse<AuditLog>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<AuditLog>>("/api/admin/audit-logs", {
      params,
    });
    return data;
  },

  // Admin Invitations (Super Admin)
  getInvitations: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<AdminInvitation>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<AdminInvitation>>("/api/admin/invitations", {
      params,
    });
    return data;
  },

  createInvitation: async (payload: {
    email: string;
    role?: "admin" | "super_admin";
  }): Promise<ApiResponse<{ id: string; status: string }>> => {
    const { data } = await axiosInstance.post<ApiResponse<{ id: string; status: string }>>(
      "/api/admin/invitations",
      payload
    );
    return data;
  },

  resendInvitation: async (id: string): Promise<ApiResponse<{ invitation: AdminInvitation }>> => {
    const { data } = await axiosInstance.post<ApiResponse<{ invitation: AdminInvitation }>>(
      `/api/admin/invitations/${id}/resend`
    );
    return data;
  },

  revokeInvitation: async (id: string): Promise<ApiResponse<AdminInvitation>> => {
    const { data } = await axiosInstance.delete<ApiResponse<AdminInvitation>>(`/api/admin/invitations/${id}`);
    return data;
  },
};
