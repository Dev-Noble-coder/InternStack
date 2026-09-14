import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/admin.service";
import { Company, Listing } from "../types/listing";

export const ADMIN_QUERY_KEYS = {
  dashboard: ["admin", "dashboard"] as const,
  users: (params?: Record<string, unknown>) => ["admin", "users", params] as const,
  user: (id: string) => ["admin", "user", id] as const,
  studentProfile: (id: string) => ["admin", "student-profile", id] as const,
  companies: (params?: Record<string, unknown>) => ["admin", "companies", params] as const,
  company: (id: string) => ["admin", "company", id] as const,
  listings: (params?: Record<string, unknown>) => ["admin", "listings", params] as const,
  listing: (id: string) => ["admin", "listing", id] as const,
  submissions: (params?: Record<string, unknown>) => ["admin", "submissions", params] as const,
  submission: (id: string) => ["admin", "submission", id] as const,
  applications: (params?: Record<string, unknown>) => ["admin", "applications", params] as const,
  application: (id: string) => ["admin", "application", id] as const,
  auditLogs: (params?: Record<string, unknown>) => ["admin", "audit-logs", params] as const,
  invitations: (params?: Record<string, unknown>) => ["admin", "invitations", params] as const,
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.dashboard,
    queryFn: () => adminService.getDashboard(),
    select: (res) => res.data,
  });
};

// User Hooks
export const useAdminUsers = (params?: { page?: number; limit?: number; role?: string; status?: string; search?: string }) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.users(params),
    queryFn: () => adminService.getUsers(params),
    select: (res) => res.data,
  });
};

export const useAdminUser = (id: string) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.user(id),
    queryFn: () => adminService.getUserById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.suspendUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

export const useReactivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.reactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

export const useAdminStudentProfile = (id: string) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.studentProfile(id),
    queryFn: () => adminService.getStudentProfile(id),
    select: (res) => res.data,
    enabled: !!id,
  });
};

export const useFlagStudentProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminService.flagStudentProfile(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

// Company Hooks
export const useAdminCompanies = (params?: { page?: number; limit?: number; search?: string; state?: string }) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.companies(params),
    queryFn: () => adminService.getCompanies(params),
    select: (res) => res.data,
  });
};

export const useAdminCompany = (id: string) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.company(id),
    queryFn: () => adminService.getCompanyById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, force }: { data: Partial<Company>; force?: boolean }) =>
      adminService.createCompany(data, force),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) =>
      adminService.updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

// Listing Hooks
export const useAdminListings = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.listings(params),
    queryFn: () => adminService.getListings(params),
    select: (res) => res.data,
  });
};

export const useAdminListing = (id: string) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.listing(id),
    queryFn: () => adminService.getListingById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Listing>) => adminService.createListing(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Listing> }) =>
      adminService.updateListing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

export const useCloseListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, closeReason }: { id: string; closeReason?: string }) =>
      adminService.closeListing(id, closeReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

export const useExpireListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.expireListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

// Submissions Hooks
export const useAdminSubmissions = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.submissions(params),
    queryFn: () => adminService.getSubmissions(params),
    select: (res) => res.data,
  });
};

export const useAdminSubmission = (id: string) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.submission(id),
    queryFn: () => adminService.getSubmissionById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
};

export const useApproveSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { companyId: string; [key: string]: unknown } }) =>
      adminService.approveSubmission(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "submissions"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

export const useRejectSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adminNote }: { id: string; adminNote?: string }) =>
      adminService.rejectSubmission(id, adminNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "submissions"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

// Application Workflow Hooks
export const useAdminApplications = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.applications(params),
    queryFn: () => adminService.getApplications(params),
    select: (res) => res.data,
  });
};

export const useAdminApplication = (id: string) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.application(id),
    queryFn: () => adminService.getApplicationById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
};

export const useReviewApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.reviewApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

export const useAcceptApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.acceptApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

export const useRejectApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.rejectApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

export const useConfirmPlacement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { startDate?: string; endDate?: string; note?: string } }) =>
      adminService.confirmPlacement(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

// Audit Logs Hooks
export const useAdminAuditLogs = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.auditLogs(params),
    queryFn: () => adminService.getAuditLogs(params),
    select: (res) => res.data,
  });
};

// Invitations Hooks (Super Admin)
export const useAdminInvitations = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.invitations(params),
    queryFn: () => adminService.getInvitations(params),
    select: (res) => res.data,
  });
};

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { email: string; role?: "admin" | "super_admin" }) =>
      adminService.createInvitation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "invitations"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

export const useResendInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.resendInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "invitations"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

export const useRevokeInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.revokeInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "invitations"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};
