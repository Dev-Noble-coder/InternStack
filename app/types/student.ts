import { Listing, Company } from "./listing";

export interface StudentCV {
  url: string;
  filename: string;
  uploadedAt?: string;
}

export interface StudentProfile {
  _id?: string;
  userId?: string;
  phone?: string;
  bio?: string;
  institution?: string;
  matricNumber?: string;
  faculty?: string;
  department?: string;
  level?: string;
  internshipType?: string;
  internshipStartPeriod?: string;
  internshipEndPeriod?: string;
  preferredLocations?: string[];
  skills?: string[];
  cv?: StudentCV;
  profilePictureUrl?: string;
  completionPercentage?: number;
  isReadyToApply?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentDashboardSummary {
  profile: {
    firstName: string;
    profilePicture?: string | null;
    completionPercentage: number;
    isReadyToApply: boolean;
  };
  applications: {
    active: number;
    total: number;
  };
  suggestedListings: Listing[];
  notifications: {
    unreadCount: number;
  };
}

export type ApplicationStatus =
  | "applied"
  | "reviewed"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "placement confirmed";

export interface ApplicationPlacement {
  confirmed: boolean;
  startDate?: string;
  endDate?: string;
  note?: string;
}

export interface Application {
  _id: string;
  studentId: string | { _id: string; firstName: string; lastName: string; email: string };
  listingId: Listing | { _id: string; title: string; status: string; companyId?: Company };
  companyId?: Company | { _id: string; name: string; logo?: string };
  status: ApplicationStatus;
  cvSnapshot?: { url: string; filename: string };
  canWithdraw?: boolean;
  placement?: ApplicationPlacement;
  appliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus =
  | "pending"
  | "processing"
  | "reviewed"
  | "failed"
  | "approved"
  | "rejected";

export interface ListingSubmission {
  _id: string;
  submittedBy: string;
  type: "url" | "manual";
  sourceUrl?: string;
  extractedData?: {
    title?: string;
    description?: string;
    companyName?: string;
    location?: string;
    requirements?: string[];
    skills?: string[];
    applicationUrl?: string;
    deadline?: string;
  };
  manualData?: {
    title?: string;
    companyName?: string;
    description?: string;
    location?: string;
    workMode?: string;
    internshipType?: string;
    applicationUrl?: string;
    requirements?: string[];
    skills?: string[];
    deadline?: string;
  };
  status: SubmissionStatus;
  adminNote?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}
