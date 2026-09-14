export interface Company {
  _id: string;
  name: string;
  logo?: string;
  website?: string;
  industry?: string;
  state?: string;
  city?: string;
  address?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ListingStatus = "published" | "closed" | "expired";
export type WorkMode = "onsite" | "remote" | "hybrid";

export interface Listing {
  _id: string;
  companyId: Company | string;
  title: string;
  description: string;
  locations?: string[];
  workMode?: WorkMode;
  internshipType?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  applicationDeadline?: string;
  requirements?: string[];
  skills?: string[];
  openings?: number;
  applicationUrl?: string;
  status: ListingStatus;
  closeReason?: string;
  applicationCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListingFilters {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  internshipType?: string;
  workMode?: string;
  category?: string;
  status?: string;
  companyId?: string;
}
