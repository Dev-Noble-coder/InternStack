import { axiosInstance } from "../lib/axios";
import { ApiResponse, PaginatedResponse } from "../types/common";
import { Notification, UnreadCountResponse } from "../types/notification";

export const notificationService = {
  // Get paginated notifications
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    isRead?: string;
  }): Promise<PaginatedResponse<Notification>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<Notification>>("/api/notifications", {
      params,
    });
    return data;
  },

  // Get unread notification count
  getUnreadCount: async (): Promise<ApiResponse<UnreadCountResponse>> => {
    const { data } = await axiosInstance.get<ApiResponse<UnreadCountResponse>>("/api/notifications/unread-count");
    return data;
  },

  // Mark single notification as read
  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    const { data } = await axiosInstance.patch<ApiResponse<Notification>>(`/api/notifications/${id}/read`);
    return data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    const { data } = await axiosInstance.patch<ApiResponse<Record<string, unknown>>>("/api/notifications/read-all");
    return data;
  },
};
