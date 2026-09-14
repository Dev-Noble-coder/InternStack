"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  Search,
  Building2,
  User,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  Award,
  Sparkles,
  Calendar,
  ExternalLink,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  useAdminApplications,
  useAdminApplication,
  useReviewApplication,
  useAcceptApplication,
  useRejectApplication,
  useConfirmPlacement,
} from "../../../hooks/useAdmin";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { DataTable, Column } from "../../../components/ui/DataTable";
import { Tabs } from "../../../components/ui/Tabs";
import { Modal } from "../../../components/ui/Modal";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Application } from "../../../types/student";
import { AdminApplicationDetail } from "../../../types/admin";
import { useDebounce } from "../../../hooks/useDebounce";
import toast from "react-hot-toast";

export default function AdminApplicationsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 350);

  // Placement modal state
  const [placementModalOpen, setPlacementModalOpen] = useState(false);
  const [placementForm, setPlacementForm] = useState({
    startDate: "",
    endDate: "",
    note: "",
  });

  const { data: applicationsData, isLoading } = useAdminApplications({
    page,
    limit: 15,
    status: activeTab === "all" ? undefined : activeTab,
    search: debouncedSearch.trim() || undefined,
  });

  const { data: detailData, isLoading: isLoadingDetail } = useAdminApplication(selectedAppId || "");

  const { mutateAsync: reviewApp, isPending: isReviewing } = useReviewApplication();
  const { mutateAsync: acceptApp, isPending: isAccepting } = useAcceptApplication();
  const { mutateAsync: rejectApp, isPending: isRejecting } = useRejectApplication();
  const { mutateAsync: confirmPlacement, isPending: isConfirmingPlacement } = useConfirmPlacement();

  const handleReview = async () => {
    if (!selectedAppId) return;
    try {
      await reviewApp(selectedAppId);
      toast.success("Application marked as Under Review");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Status update failed");
    }
  };

  const handleAccept = async () => {
    if (!selectedAppId) return;
    try {
      await acceptApp(selectedAppId);
      toast.success("Candidate application accepted!");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Status update failed");
    }
  };

  const handleReject = async () => {
    if (!selectedAppId) return;
    try {
      await rejectApp(selectedAppId);
      toast.success("Application marked as not selected");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Status update failed");
    }
  };

  const handleConfirmPlacementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId) return;
    try {
      await confirmPlacement({
        id: selectedAppId,
        payload: placementForm,
      });
      toast.success("Student placement confirmed!");
      setPlacementModalOpen(false);
      setPlacementForm({ startDate: "", endDate: "", note: "" });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to confirm placement");
    }
  };

  const tabs = [
    { id: "all", label: "All Applications" },
    { id: "applied", label: "Applied (New)" },
    { id: "reviewed", label: "Under Review" },
    { id: "accepted", label: "Accepted" },
    { id: "rejected", label: "Rejected" },
    { id: "withdrawn", label: "Withdrawn" },
  ];

  const items = applicationsData?.items || [];
  const pagination = applicationsData?.pagination;

  const columns: Column<Application>[] = [
    {
      key: "student",
      header: "Applicant",
      render: (a) => {
        const student = typeof a.studentId === "object" ? a.studentId : null;
        return (
          <div className="space-y-0.5">
            <p className="font-bold text-white">
              {student ? `${student.firstName} ${student.lastName}` : "Student"}
            </p>
            <p className="text-xs text-slate-400">{student?.email || "—"}</p>
          </div>
        );
      },
    },
    {
      key: "listing",
      header: "Position & Employer",
      render: (a) => {
        const listing = typeof a.listingId === "object" ? a.listingId : null;
        const company = typeof a.companyId === "object" ? a.companyId : null;
        return (
          <div className="space-y-0.5">
            <p className="font-semibold text-white">{listing?.title || "Internship"}</p>
            <p className="text-xs text-slate-400">{company?.name || "Company"}</p>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (a) => <StatusBadge status={a.status} size="sm" />,
    },
    {
      key: "appliedAt",
      header: "Applied Date",
      render: (a) => (
        <span className="text-xs text-slate-400">
          {new Date(a.appliedAt || a.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      align: "right",
      render: (a) => (
        <button
          onClick={() => setSelectedAppId(a._id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Inspect & Vet</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          Application Vetting & Placement Workflow
        </h1>
        <p className="text-xs lg:text-sm text-slate-400 mt-1">
          Review candidate eligibility, calculate advisory vetting scores, approve applications, and confirm employer placements.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search applicant name, email, matriculation number..."
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#F3A712]"
            />
          </div>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
            setPage(1);
          }}
        />
      </div>

      {/* Applications Table */}
      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(a) => a._id}
        isLoading={isLoading}
        emptyTitle="No applications found"
        emptyDescription="There are no applications matching the selected criteria."
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
      />

      {/* Vetting & Application Detail Modal */}
      {selectedAppId && (
        <Modal
          isOpen={!!selectedAppId}
          onClose={() => setSelectedAppId(null)}
          maxWidth="3xl"
          title="Application Vetting & Assessment"
          description={`Application ID: ${selectedAppId}`}
        >
          {isLoadingDetail || !detailData ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#F3A712]" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Applicant Header Tile */}
              <div className="p-4 bg-[#0F172A] border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#F3A712] font-bold text-sm">
                    {detailData.studentId?.firstName?.[0]}
                    {detailData.studentId?.lastName?.[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {detailData.studentId?.firstName} {detailData.studentId?.lastName}
                    </h3>
                    <p className="text-xs text-slate-400">{detailData.studentId?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={detailData.status} />
                  {detailData.cvSnapshot?.url && (
                    <a
                      href={detailData.cvSnapshot.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-400 rounded-xl transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View CV</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Advisory Vetting Score Card */}
              <div className="p-5 bg-gradient-to-br from-[#1E293B] to-[#131B2E] border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#F3A712]" />
                    <h4 className="text-sm font-bold text-white">
                      Advisory Vetting Assessment
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-[#F3A712] font-mono font-bold text-sm">
                    Score: {detailData.vettingScore ?? 0}/100
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[11px] block">Profile Completeness</span>
                    <span className="font-bold text-white">
                      {detailData.vettingBreakdown?.profileCompleteness ?? 0}%
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[11px] block">CV Present</span>
                    <span className="font-bold text-emerald-400">
                      {detailData.vettingBreakdown?.cvPresent ? "Verified" : "Missing"}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[11px] block">Skills Match</span>
                    <span className="font-bold text-white">
                      {detailData.vettingBreakdown?.skillsMatch ?? 0}%
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[11px] block">SIWES Eligibility</span>
                    <span className="font-bold text-emerald-400">
                      {detailData.vettingBreakdown?.eligibility ? "Eligible" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Transition Workflow Action Bar */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Workflow State Transitions
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  {detailData.status === "applied" && (
                    <button
                      onClick={handleReview}
                      disabled={isReviewing}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isReviewing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      <span>Mark Under Review</span>
                    </button>
                  )}

                  {detailData.status === "reviewed" && (
                    <button
                      onClick={handleAccept}
                      disabled={isAccepting}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isAccepting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>Accept Candidate</span>
                    </button>
                  )}

                  {(detailData.status === "applied" || detailData.status === "reviewed") && (
                    <button
                      onClick={handleReject}
                      disabled={isRejecting}
                      className="bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800 font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isRejecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      <span>Reject Application</span>
                    </button>
                  )}

                  {detailData.status === "accepted" && !detailData.placement?.confirmed && (
                    <button
                      onClick={() => setPlacementModalOpen(true)}
                      className="bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>Confirm Placement at Company</span>
                    </button>
                  )}

                  {detailData.placement?.confirmed && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Placement confirmed and recorded in platform audit logs.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Confirm Placement Modal Form */}
      <Modal
        isOpen={placementModalOpen}
        onClose={() => setPlacementModalOpen(false)}
        maxWidth="md"
        title="Confirm Student Placement"
        description="Officially record student placement with starting dates and onboarding instructions."
      >
        <form onSubmit={handleConfirmPlacementSubmit} className="space-y-4">
          <Input
            label="Placement Start Date"
            type="date"
            value={placementForm.startDate}
            onChange={(e) => setPlacementForm({ ...placementForm, startDate: e.target.value })}
          />
          <Input
            label="Placement End Date"
            type="date"
            value={placementForm.endDate}
            onChange={(e) => setPlacementForm({ ...placementForm, endDate: e.target.value })}
          />
          <Textarea
            label="Placement Notes & Company Instructions"
            rows={3}
            value={placementForm.note}
            onChange={(e) => setPlacementForm({ ...placementForm, note: e.target.value })}
            placeholder="e.g. Report to HR at 9:00 AM on Monday, ask for Mr. Adewale..."
          />

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setPlacementModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isConfirmingPlacement}
              className="bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs py-2.5 px-5 rounded-xl shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center gap-2 disabled:opacity-50"
            >
              {isConfirmingPlacement ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
              <span>Confirm & Notify Student</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
