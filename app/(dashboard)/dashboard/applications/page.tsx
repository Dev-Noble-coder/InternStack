"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Building2,
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  ExternalLink,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { useStudentApplications, useWithdrawApplication } from "../../../hooks/useStudent";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import { Tabs } from "../../../components/ui/Tabs";
import { Application } from "../../../types/student";
import Link from "next/link";
import toast from "react-hot-toast";

export default function StudentApplicationsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedAppToWithdraw, setSelectedAppToWithdraw] = useState<Application | null>(null);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const { data: applicationsData, isLoading } = useStudentApplications({
    page,
    limit: 10,
    status: activeTab === "all" ? undefined : activeTab,
  });

  const { mutateAsync: withdrawApp, isPending: isWithdrawing } = useWithdrawApplication();

  const handleWithdrawConfirm = async () => {
    if (!selectedAppToWithdraw) return;
    try {
      await withdrawApp(selectedAppToWithdraw._id);
      toast.success("Application withdrawn successfully");
      setWithdrawModalOpen(false);
      setSelectedAppToWithdraw(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to withdraw application.");
    }
  };

  const tabs = [
    { id: "all", label: "All Applications" },
    { id: "applied", label: "Applied" },
    { id: "reviewed", label: "Under Review" },
    { id: "accepted", label: "Accepted / Placed" },
    { id: "rejected", label: "Not Selected" },
    { id: "withdrawn", label: "Withdrawn" },
  ];

  const items = applicationsData?.items || [];
  const pagination = applicationsData?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            My Applications
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Track your SIWES applications, review interview statuses, and verify confirmed placements.
          </p>
        </div>

        <Link
          href="/dashboard/listings"
          className="self-start md:self-auto bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-[2px_2px_0px_0px_#FFFFFF] transition-all"
        >
          Browse More Openings
        </Link>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
            setPage(1);
          }}
        />
        {pagination && (
          <span className="text-xs text-slate-400 font-medium hidden sm:inline shrink-0">
            Total: {pagination.total} applications
          </span>
        )}
      </div>

      {/* Content List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-36 bg-[#131B2E] border border-slate-800 rounded-2xl animate-pulse p-6"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <CheckSquare className="w-8 h-8 text-[#F3A712]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No applications found</h3>
          <p className="text-xs text-slate-400 mb-6">
            You haven't submitted applications in this category yet.
          </p>
          <Link
            href="/dashboard/listings"
            className="inline-flex items-center gap-2 bg-[#F3A712] text-[#0B1120] font-bold text-xs px-5 py-2.5 rounded-xl"
          >
            Explore Open Placements
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((app) => {
            const listing = typeof app.listingId === "object" ? app.listingId : null;
            const listingTitle = listing?.title || "Internship Position";
            const company = typeof app.companyId === "object" ? app.companyId : null;
            const companyName = company?.name || "Company";
            const companyLogo = company?.logo;

            // Calculate 24-hour remaining countdown
            const appliedTime = new Date(app.appliedAt || app.createdAt).getTime();
            const now = Date.now();
            const elapsedHours = (now - appliedTime) / (1000 * 60 * 60);
            const hoursRemaining = Math.max(0, Math.floor(24 - elapsedHours));
            const isEligibleForWithdrawal =
              app.canWithdraw ?? (["applied", "reviewed"].includes(app.status) && elapsedHours < 24);

            return (
              <motion.div
                key={app._id}
                whileHover={{ y: -2 }}
                className="bg-[#131B2E] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 lg:p-6 shadow-lg transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Company & Listing Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#F3A712] overflow-hidden shrink-0">
                      {companyLogo ? (
                        <img
                          src={companyLogo}
                          alt={companyName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {listingTitle}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{companyName}</p>
                    </div>
                  </div>

                  {/* Right: Status Badge */}
                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <StatusBadge status={app.status} />
                  </div>
                </div>

                {/* Placement Details Card if Accepted / Confirmed */}
                {app.placement?.confirmed && (
                  <div className="p-4 bg-emerald-950/30 border border-emerald-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-300">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-bold text-emerald-200">
                          Placement Officially Confirmed!
                        </span>
                        {app.placement.note && (
                          <p className="text-[11px] text-emerald-400 mt-0.5">
                            Note: {app.placement.note}
                          </p>
                        )}
                      </div>
                    </div>
                    {app.placement.startDate && (
                      <span className="text-[11px] text-emerald-400 font-medium shrink-0">
                        Start: {new Date(app.placement.startDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                )}

                {/* Application Metadata & Action Row */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        Applied:{" "}
                        {new Date(app.appliedAt || app.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </span>

                    {app.cvSnapshot?.url && (
                      <a
                        href={app.cvSnapshot.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View CV Snapshot</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* 24h Withdrawal Action */}
                  {isEligibleForWithdrawal && (
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] text-amber-300/80 font-medium">
                        {hoursRemaining}h left to withdraw
                      </span>
                      <button
                        onClick={() => {
                          setSelectedAppToWithdraw(app);
                          setWithdrawModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 font-semibold text-xs transition-colors py-1 px-2.5 rounded-lg bg-rose-950/30 border border-rose-900/40 hover:bg-rose-900/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Withdraw</span>
                      </button>
                    </div>
                  )}
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
            className="px-4 py-2 bg-[#131B2E] border border-slate-700 text-xs font-semibold rounded-xl text-slate-300 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-slate-400 font-medium px-2">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNext}
            className="px-4 py-2 bg-[#131B2E] border border-slate-700 text-xs font-semibold rounded-xl text-slate-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Withdraw Confirmation Modal */}
      <ConfirmModal
        isOpen={withdrawModalOpen}
        onClose={() => {
          setWithdrawModalOpen(false);
          setSelectedAppToWithdraw(null);
        }}
        onConfirm={handleWithdrawConfirm}
        title="Withdraw Application?"
        description="Are you sure you want to withdraw this application? This action will free up one of your two active application slots."
        confirmLabel="Yes, Withdraw"
        variant="danger"
        isLoading={isWithdrawing}
      />
    </div>
  );
}
