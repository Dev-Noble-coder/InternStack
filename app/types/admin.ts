import { User } from "./auth";
import { Application, StudentProfile } from "./student";
import { Listing } from "./listing";

export interface AdminDashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalAdmins: number;
  totalListings: number;
  totalCompanies: number;
  activeApplications: number;
  placementsConfirmed: number;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  recentUsers: User[];
  recentApplications: Application[];
  notifications: {
    unreadCount: number;
  };
  pendingSubmissions: number;
}

export interface VettingBreakdown {
  profileCompleteness: number;
  cvPresent: number;
  skillsMatch: number;
  eligibility: number;
}

export interface AdminApplicationDetail extends Omit<Application, "studentId" | "listingId"> {
  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
  listingId: Listing;
  vettingScore: number;
  vettingBreakdown: VettingBreakdown;
}

export interface AdminUserDetail extends User {
  profile?: StudentProfile | null;
  applicationCount?: number;
  activeApplications?: number;
}

export interface AuditLog {
  _id: string;
  action: string;
  performedBy:
    | {
        _id: string;
        firstName?: string;
        lastName?: string;
        email?: string;
      }
    | string;
  targetType: "User" | "Company" | "Listing" | "Application" | "Submission" | "Invitation" | string;
  targetId: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  createdAt: string;
}

export interface AdminInvitation {
  _id: string;
  email: string;
  role: "admin" | "super_admin";
  status: "pending" | "accepted" | "expired" | "revoked";
  expiresAt: string;
  invitedBy?: string | { firstName: string; lastName: string; email: string };
  createdAt: string;
}
