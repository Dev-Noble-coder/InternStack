import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listingService } from "../services/listing.service";
import { ListingFilters } from "../types/listing";

export const LISTING_QUERY_KEYS = {
  all: ["listings"] as const,
  list: (filters?: ListingFilters) => ["listings", "list", filters] as const,
  detail: (id: string) => ["listings", "detail", id] as const,
};

export const useListings = (filters?: ListingFilters) => {
  return useQuery({
    queryKey: LISTING_QUERY_KEYS.list(filters),
    queryFn: () => listingService.getListings(filters),
    select: (res) => res.data,
  });
};

export const useListing = (id: string) => {
  return useQuery({
    queryKey: LISTING_QUERY_KEYS.detail(id),
    queryFn: () => listingService.getListingById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
};

export const useApplyToListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listingId: string) => listingService.applyToListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["student", "applications"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
