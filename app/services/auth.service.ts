import { axiosInstance } from "../lib/axios";
import { AuthResponse, MessageResponse } from "../types/auth";

export const authService = {
  getMe: async (): Promise<AuthResponse> => {
    const { data } = await axiosInstance.get<AuthResponse>("/api/auth/me");
    return data;
  },

  login: async (payload: any): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>("/api/auth/login", payload);
    return data;
  },

  register: async (payload: any): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>("/api/auth/register", payload);
    return data;
  },

  logout: async (): Promise<MessageResponse> => {
    const { data } = await axiosInstance.post<MessageResponse>("/api/auth/logout");
    return data;
  },

  verifyEmail: async (payload: any): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>("/api/auth/verify-email", payload);
    return data;
  },
  
  resendVerification: async (payload: { email: string }): Promise<MessageResponse> => {
    const { data } = await axiosInstance.post<MessageResponse>("/api/auth/resend-verification", payload);
    return data;
  },

  forgotPassword: async (payload: { email: string }): Promise<MessageResponse> => {
    const { data } = await axiosInstance.post<MessageResponse>("/api/auth/forgot-password", payload);
    return data;
  },

  verifyPasswordReset: async (payload: any): Promise<MessageResponse> => {
    const { data } = await axiosInstance.post<MessageResponse>("/api/auth/verify-password-reset", payload);
    return data;
  },

  resetPassword: async (payload: any): Promise<MessageResponse> => {
    const { data } = await axiosInstance.post<MessageResponse>("/api/auth/reset-password", payload);
    return data;
  },
};
