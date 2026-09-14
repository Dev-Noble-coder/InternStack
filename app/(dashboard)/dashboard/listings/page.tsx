"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Briefcase,
  Layers,
  ChevronRight,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useListings, useApplyToListing } from "../../../hooks/useListings";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { Modal } from "../../../components/ui/Modal";
import { SuccessModal } from "../../../components/ui/SuccessModal";
import { FailureModal } from "../../../components/ui/FailureModal";
import { Listing, ListingFilters } from "../../../types/listing";
import { Tabs } from "../../../components/ui/Tabs";
import { useDebounce } from "../../../hooks/useDebounce";
import Link from "next/link";

export default function StudentListingsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [activeWorkMode, setActiveWorkMode] = useState<string>("all");

  const debouncedSearch = useDebounce(searchTerm, 350);
  const debouncedLocation = useDebounce(locationTerm, 350);

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [failureModalData, setFailureModalData] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    code?: string;
  }>({
    isOpen: false,
    message: "",
  });

  const { data: listingsData, isLoading } = useListings({
    page,
    limit: 12,
    search: debouncedSearch.trim() || undefined,
    location: debouncedLocation.trim() || undefined,
    workMode: activeWorkMode === "all" ? undefined : activeWorkMode,
  });

  const { mutateAsync: applyToListing, isPending: isApplying } = useApplyToListing();

  const handleWorkModeChange = (mode: string) => {
    setActiveWorkMode(mode);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationTerm(e.target.value);
    setPage(1);
  };

  const openDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setDetailsModalOpen(true);
  };

  const handleApply = async (listing: Listing) => {
    try {
      setSelectedListing(listing);
      await applyToListing(listing._id);
      setDetailsModalOpen(false);
      setSuccessModalOpen(true);
    } catch (err: unknown) {
      const errRes = (err as { response?: { data?: { error?: { message?: string; code?: string } } } })?.response?.data?.error;
      const message =
        errRes?.message ||
        "Could not submit application. Please check your active application limit (max 2) or complete your profile.";
      const code = errRes?.code || "APPLICATION_FAILED";

      setFailureModalData({
        isOpen: true,
        title: "Application Notice",
        message,
        code,
      });
    }
  };

  const items = listingsData?.items || [];
  const pagination = listingsData?.pagination;

  const workModeTabs = [
    { id: "all", label: "All Opportunities" },
    { id: "remote", label: "Remote Only" },
    { id: "onsite", label: "Onsite" },
    { id: "hybrid", label: "Hybrid" },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Find Internships & SIWES Placements
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Discover verified industrial training openings from vetted Nigerian employers.
          </p>
        </div>

        <Link
          href="/dashboard/submissions"
          className="self-start md:self-auto bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2"
        >
          <Building2 className="w-4 h-4" />
          <span>Found an opening elsewhere? Submit lead</span>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Field */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by job title, keywords, or company..."
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#F3A712] focus:ring-1 focus:ring-[#F3A712]/40"
            />
          </div>

          {/* Location Field */}
          <div className="relative w-full md:w-64">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={locationTerm}
              onChange={handleLocationChange}
              placeholder="Filter by state / city..."
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#F3A712]"
            />
          </div>
        </div>

        {/* Work Mode Tabs */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <Tabs
            tabs={workModeTabs}
            activeTab={activeWorkMode}
            onChange={handleWorkModeChange}
          />
          {pagination && (
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              {pagination.total} openings available
            </span>
          )}
        </div>
      </div>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-[#131B2E] border border-slate-800 rounded-2xl animate-pulse p-6"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-[#F3A712] mx-auto mb-4">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No internships found</h3>
          <p className="text-xs text-slate-400 mb-6">
            Try adjusting your search terms, work mode filter, or location.
          </p>
          <button
            onClick={() => {
              setActiveWorkMode("all");
              setSearchTerm("");
              setLocationTerm("");
              setPage(1);
            }}
            className="bg-[#F3A712] text-[#0B1120] font-bold text-xs px-5 py-2.5 rounded-xl"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((listing) => {
            const company =
              typeof listing.companyId === "object" ? listing.companyId : undefined;
            const companyName = company?.name || "Partner Company";
            const companyLogo = company?.logo;

            return (
              <motion.div
                key={listing._id}
                whileHover={{ y: -3 }}
                className="bg-[#131B2E] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all cursor-pointer group"
                onClick={() => openDetails(listing)}
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#F3A712] overflow-hidden shrink-0">
                        {companyLogo ? (
                          <img
                            src={companyLogo}
                            alt={companyName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-[#F3A712] transition-colors line-clamp-1">
                          {listing.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-1">{companyName}</p>
                      </div>
                    </div>
                    <StatusBadge status={listing.status} size="sm" />
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {listing.description}
                  </p>

                  {/* Skills Pills */}
                  {listing.skills && listing.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {listing.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-800/80 border border-slate-700/60 rounded-md text-[10px] text-slate-300 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {listing.skills.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-slate-800/80 text-[10px] text-slate-400 rounded-md">
                          +{listing.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Badges and metadata */}
                  <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    {listing.workMode && (
                      <span className="capitalize font-medium text-slate-300">
                        • {listing.workMode}
                      </span>
                    )}
                    {listing.locations && listing.locations[0] && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#F3A712]" />
                        <span>{listing.locations[0]}</span>
                      </span>
                    )}
                    {listing.applicationDeadline && (
                      <span className="flex items-center gap-1 ml-auto text-amber-300/80">
                        <Clock className="w-3 h-3" />
                        <span>
                          Due {new Date(listing.applicationDeadline).toLocaleDateString()}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openDetails(listing)}
                    className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleApply(listing)}
                    disabled={isApplying}
                    className="bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isApplying && selectedListing?._id === listing._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : null}
                    <span>1-Click Apply</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPrevious}
            className="px-4 py-2 bg-[#131B2E] border border-slate-700 text-xs font-semibold rounded-xl text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-slate-400 font-medium px-2">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNext}
            className="px-4 py-2 bg-[#131B2E] border border-slate-700 text-xs font-semibold rounded-xl text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Listing Details Modal */}
      {selectedListing && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          maxWidth="2xl"
          title={selectedListing.title}
          description={
            typeof selectedListing.companyId === "object"
              ? selectedListing.companyId.name
              : "Company Opportunity"
          }
        >
          <div className="space-y-6">
            {/* Overview Pills */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300">
              <StatusBadge status={selectedListing.status} size="sm" />
              {selectedListing.workMode && (
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 capitalize font-medium">
                  {selectedListing.workMode}
                </span>
              )}
              {selectedListing.internshipType && (
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 font-medium">
                  {selectedListing.internshipType}
                </span>
              )}
              {selectedListing.locations && selectedListing.locations.length > 0 && (
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-[#F3A712]" />
                  <span>{selectedListing.locations.join(", ")}</span>
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3A712] mb-2">
                Job Overview
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedListing.description}
              </p>
            </div>

            {/* Requirements */}
            {selectedListing.requirements && selectedListing.requirements.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3A712] mb-2">
                  Key Requirements
                </h4>
                <ul className="space-y-1.5">
                  {selectedListing.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Skills */}
            {selectedListing.skills && selectedListing.skills.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3A712] mb-2">
                  Skills & Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedListing.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dates / Deadlines */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Application Deadline</span>
                <span className="font-semibold text-white">
                  {selectedListing.applicationDeadline
                    ? new Date(selectedListing.applicationDeadline).toLocaleDateString()
                    : "Rolling admission"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Openings</span>
                <span className="font-semibold text-white">
                  {selectedListing.openings ?? 1} slot available
                </span>
              </div>
            </div>

            {/* Footer Modal Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleApply(selectedListing)}
                disabled={isApplying}
                className="flex-1 bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Submit 1-Click Application</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Application Submitted!"
        message={`Your application for "${selectedListing?.title}" was successfully created. A snapshot of your current CV has been attached.`}
        actionLabel="Go to My Applications"
        onAction={() => {
          setSuccessModalOpen(false);
          window.location.href = "/dashboard/applications";
        }}
      />

      {/* Failure Modal */}
      <FailureModal
        isOpen={failureModalData.isOpen}
        onClose={() => setFailureModalData((prev) => ({ ...prev, isOpen: false }))}
        title={failureModalData.title}
        message={failureModalData.message}
        errorCode={failureModalData.code}
      />
    </div>
  );
}
