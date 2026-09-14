export type NotificationType =
  | "APPLICATION_SUBMITTED"
  | "APPLICATION_REVIEWED"
  | "APPLICATION_ACCEPTED"
  | "APPLICATION_REJECTED"
  | "APPLICATION_WITHDRAWN"
  | "PLACEMENT_CONFIRMED"
  | "LISTING_CLOSED"
  | "LISTING_EXPIRED"
  | "PROFILE_CV_ISSUE"
  | "ADMIN_INVITATION";

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: {
    applicationId?: string;
    listingId?: string;
    companyId?: string;
    studentId?: string;
    [key: string]: unknown;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UnreadCountResponse {
  count: number;
}
