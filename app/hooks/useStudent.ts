import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "../services/student.service";
import { StudentProfile } from "../types/student";

export const STUDENT_QUERY_KEYS = {
  dashboard: ["student", "dashboard"] as const,
  profile: ["student", "profile"] as const,
  applications: (params?: Record<string, unknown>) => ["student", "applications", params] as const,
  application: (id: string) => ["student", "application", id] as const,
  submissions: (params?: Record<string, unknown>) => ["student", "submissions", params] as const,
};

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: STUDENT_QUERY_KEYS.dashboard,
    queryFn: () => studentService.getDashboard(),
    select: (res) => res.data,
  });
};

export const useStudentProfile = () => {
  return useQuery({
    queryKey: STUDENT_QUERY_KEYS.profile,
    queryFn: () => studentService.getProfile(),
    select: (res) => res.data,
  });
};

export const useUpdateStudentProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<StudentProfile>) => studentService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_QUERY_KEYS.profile });
      queryClient.invalidateQueries({ queryKey: STUDENT_QUERY_KEYS.dashboard });
    },
  });
};

export const useStudentApplications = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: STUDENT_QUERY_KEYS.applications(params),
    queryFn: () => studentService.getApplications(params),
    select: (res) => res.data,
  });
};

export const useStudentApplication = (id: string) => {
  return useQuery({
    queryKey: STUDENT_QUERY_KEYS.application(id),
    queryFn: () => studentService.getApplication(id),
    select: (res) => res.data,
    enabled: !!id,
  });
};

export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentService.withdrawApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "applications"] });
      queryClient.invalidateQueries({ queryKey: STUDENT_QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};

export const useSubmitListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentService.submitListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "submissions"] });
    },
  });
};

export const useStudentSubmissions = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: STUDENT_QUERY_KEYS.submissions(params),
    queryFn: () => studentService.getSubmissions(params),
    select: (res) => res.data,
    refetchInterval: (query) => {
      // If any submission is pending or processing, poll every 5 seconds
      const hasProcessing = query.state.data?.data?.items?.some(
        (s) => s.status === "pending" || s.status === "processing"
      );
      return hasProcessing ? 5000 : false;
    },
  });
};
