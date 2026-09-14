"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  CheckSquare,
  FileCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Building2,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  GraduationCap,
  BadgeCheck,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useStudentDashboard } from "../../hooks/useStudent";
import { useApplyToListing } from "../../hooks/useListings";
import { StatCard } from "../../components/ui/StatCard";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SuccessModal } from "../../components/ui/SuccessModal";
import { FailureModal } from "../../components/ui/FailureModal";
import { Listing } from "../../types/listing";
import toast from "react-hot-toast";

export default function StudentDashboardPage() {
  const { user } = useAuthStore();
  const { data: dashboard, isLoading, error } = useStudentDashboard();
  const { mutateAsync: applyToListing, isPending: isApplying } = useApplyToListing();

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
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

  const handleApply = async (listing: Listing) => {
    try {
      setSelectedListing(listing);
      await applyToListing(listing._id);
      setSuccessModalOpen(true);
    } catch (err: unknown) {
      const errRes = (err as { response?: { data?: { error?: { message?: string; code?: string } } } })?.response?.data?.error;
      const message = errRes?.message || "Could not submit application. Please ensure your profile is complete.";
      const code = errRes?.code || "APPLICATION_ERROR";
      setFailureModalData({
        isOpen: true,
        title: "Application Notice",
        message,
        code,
      });
    }
  };

  const displayName = user?.firstName || dashboard?.profile?.firstName || "Student";
  const completion = dashboard?.profile?.completionPercentage ?? 0;
  const isReady = dashboard?.profile?.isReadyToApply ?? false;

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div
        className="relative overflow-hidden rounded-3xl border border-slate-800 shadow-2xl bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/dashboard-hero-bg.jpg')" }}
      >
        {/* Dark Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120]/95 via-[#0B1120]/80 to-[#0B1120]/60 backdrop-blur-[1px]" />

        {/* Ambient Glowing Light Accent */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#F3A712]/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 p-8 lg:p-14 flex flex-col justify-between min-h-[280px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[#F3A712] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  SIWES Portal
                </span>
                {isReady ? (
                  <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ready to Apply
                  </span>
                ) : (
                  <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Profile Incomplete
                  </span>
                )}
              </div>
              <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Welcome back, <span className="text-[#F0CEA0]">{displayName}</span>! 👋
              </h1>
              <p className="text-sm lg:text-base text-slate-300 max-w-xl leading-relaxed">
                Track your SIWES placements, discover verified industrial training opportunities, and manage your applications seamlessly.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3.5 shrink-0">
              <Link
                href="/dashboard/listings"
                className="bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-[2px_2px_0px_0px_#FFFFFF] hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>Explore Listings</span>
              </Link>
              <Link
                href="/dashboard/submissions"
                className="bg-slate-800/90 hover:bg-slate-700/90 text-white font-semibold text-xs px-5 py-3.5 rounded-xl border border-slate-700 backdrop-blur-sm transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-[#F0CEA0]" />
                <span>Submit Lead</span>
              </Link>
            </div>
          </div>

          {/* Profile Completeness Bar */}
          <div className="mt-10 pt-8 border-t border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1 max-w-2xl">
              <ProgressBar
                value={completion}
                label="Profile & CV Completeness"
                size="md"
              />
            </div>
            {!isReady && (
              <Link
                href="/dashboard/profile"
                className="text-xs font-bold text-[#F3A712] hover:text-[#F0CEA0] flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <span>Complete required fields (Institution, Matric No, CV)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Applications"
          value={dashboard?.applications?.active ?? 0}
          subtitle="Max limit: 2 concurrent"
          icon={<CheckSquare className="w-5 h-5" />}
          accentColor="amber"
          trend={{ value: "2 Limit Cap", isPositive: true }}
        />
        <StatCard
          title="Total Submitted"
          value={dashboard?.applications?.total ?? 0}
          subtitle="Lifetime applications"
          icon={<FileCheck className="w-5 h-5" />}
          accentColor="blue"
        />
        <StatCard
          title="Profile Score"
          value={`${completion}%`}
          subtitle={isReady ? "Ready for verification" : "Action required"}
          icon={isReady ? <BadgeCheck className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
          accentColor={isReady ? "emerald" : "rose"}
        />
        <StatCard
          title="Suggested Matches"
          value={dashboard?.suggestedListings?.length ?? 0}
          subtitle="Tailored to your skills"
          icon={<Briefcase className="w-5 h-5" />}
          accentColor="purple"
        />
      </div>

      {/* Suggested Listings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Suggested For You</h3>
            <p className="text-xs text-slate-400">Curated opportunities matching your faculty and skills</p>
          </div>
          <Link
            href="/dashboard/listings"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>View all listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-52 bg-[#131B2E] border border-slate-800 rounded-2xl animate-pulse p-6" />
            ))}
          </div>
        ) : (dashboard?.suggestedListings?.length ?? 0) === 0 ? (
          <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-8 text-center">
            <p className="text-sm font-semibold text-white mb-1">No suggested listings right now</p>
            <p className="text-xs text-slate-400 mb-4">Explore all open SIWES internship placements in the directory</p>
            <Link
              href="/dashboard/listings"
              className="inline-flex items-center gap-2 bg-[#F3A712] text-[#0B1120] font-bold text-xs px-4 py-2 rounded-xl"
            >
              Browse All Placements
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {dashboard?.suggestedListings.map((listing) => {
              const companyName =
                typeof listing.companyId === "object"
                  ? listing.companyId.name
                  : "Partner Company";
              const companyLogo =
                typeof listing.companyId === "object"
                  ? listing.companyId.logo
                  : undefined;

              return (
                <motion.div
                  key={listing._id}
                  whileHover={{ y: -3 }}
                  className="bg-[#131B2E] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#F3A712] overflow-hidden shrink-0">
                          {companyLogo ? (
                            <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white line-clamp-1">{listing.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{companyName}</p>
                        </div>
                      </div>
                      <StatusBadge status={listing.status} size="sm" />
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {listing.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                      {listing.workMode && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 capitalize">
                          {listing.workMode}
                        </span>
                      )}
                      {listing.locations && listing.locations[0] && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#F3A712]" />
                          <span>{listing.locations[0]}</span>
                        </span>
                      )}
                      {listing.applicationDeadline && (
                        <span className="flex items-center gap-1 ml-auto text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(listing.applicationDeadline).toLocaleDateString()}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <Link
                      href={`/dashboard/listings`}
                      className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleApply(listing)}
                      disabled={isApplying}
                      className="bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
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
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Application Submitted!"
        message={`Your application for "${selectedListing?.title}" was successfully sent to the placement review committee.`}
        actionLabel="View My Applications"
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
