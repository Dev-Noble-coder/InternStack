import { axiosInstance } from "../lib/axios";
import { ApiResponse, PaginatedResponse } from "../types/common";
import { Listing, ListingFilters } from "../types/listing";
import { Application } from "../types/student";

export const listingService = {
  // Public / Student browse listings
  getListings: async (filters?: ListingFilters): Promise<PaginatedResponse<Listing>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<Listing>>("/api/listings", {
      params: filters,
    });
    return data;
  },

  // Get single listing details
  getListingById: async (id: string): Promise<ApiResponse<Listing>> => {
    const { data } = await axiosInstance.get<ApiResponse<Listing>>(`/api/listings/${id}`);
    return data;
  },

  // Apply to listing
  applyToListing: async (listingId: string): Promise<ApiResponse<Application>> => {
    const { data } = await axiosInstance.post<ApiResponse<Application>>("/api/applications", {
      listingId,
    });
    return data;
  },
};
