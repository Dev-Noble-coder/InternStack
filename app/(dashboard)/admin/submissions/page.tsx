"use client";

import React, { useState } from "react";
import {
  Inbox,
  Globe,
  FileEdit,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  Building2,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  useAdminSubmissions,
  useApproveSubmission,
  useRejectSubmission,
  useAdminCompanies,
} from "../../../hooks/useAdmin";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { DataTable, Column } from "../../../components/ui/DataTable";
import { Modal } from "../../../components/ui/Modal";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import { Tabs } from "../../../components/ui/Tabs";
import { ListingSubmission } from "../../../types/student";
import toast from "react-hot-toast";

export default function AdminSubmissionsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [page, setPage] = useState(1);

  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ListingSubmission | null>(null);

  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [rejectNote, setRejectNote] = useState("");

  const { data: submissionsData, isLoading } = useAdminSubmissions({
    page,
    limit: 15,
    status: activeTab === "all" ? undefined : activeTab,
  });

  const { data: companiesData } = useAdminCompanies({ limit: 100 });
  const companies = companiesData?.items || [];

  const { mutateAsync: approveSub, isPending: isApproving } = useApproveSubmission();
  const { mutateAsync: rejectSub, isPending: isRejecting } = useRejectSubmission();

  const handleApprove = async () => {
    if (!selectedSubmission) return;
    if (!selectedCompanyId) {
      toast.error("Please select a registered company to assign this listing to");
      return;
    }

    try {
      await approveSub({
        id: selectedSubmission._id,
        payload: {
          companyId: selectedCompanyId,
        },
      });
      toast.success("Submission approved! Live listing has been generated.");
      setInspectModalOpen(false);
      setSelectedSubmission(null);
      setSelectedCompanyId("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to approve submission");
    }
  };

  const handleRejectConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    try {
      await rejectSub({
        id: selectedSubmission._id,
        adminNote: rejectNote.trim() || undefined,
      });
      toast.success("Submission rejected");
      setRejectModalOpen(false);
      setInspectModalOpen(false);
      setSelectedSubmission(null);
      setRejectNote("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to reject submission");
    }
  };

  const openInspect = (sub: ListingSubmission) => {
    setSelectedSubmission(sub);
    setSelectedCompanyId("");
    setInspectModalOpen(true);
  };

  const tabs = [
    { id: "all", label: "All Leads" },
    { id: "pending", label: "Pending" },
    { id: "processing", label: "Processing (Crawler)" },
    { id: "reviewed", label: "Ready for Approval" },
    { id: "approved", label: "Approved (Live)" },
    { id: "rejected", label: "Rejected" },
  ];

  const items = submissionsData?.items || [];
  const pagination = submissionsData?.pagination;

  const columns: Column<ListingSubmission>[] = [
    {
      key: "title",
      header: "Lead / Position Title",
      render: (item) => {
        const title =
          item.extractedData?.title ||
          item.manualData?.title ||
          (item.sourceUrl ? item.sourceUrl.replace(/^https?:\/\//, "").slice(0, 32) + "..." : "Lead");
        const company = item.extractedData?.companyName || item.manualData?.companyName || "Unknown";

        return (
          <div className="space-y-0.5">
            <p className="font-bold text-white line-clamp-1">{title}</p>
            <p className="text-xs text-slate-400">{company}</p>
          </div>
        );
      },
    },
    {
      key: "type",
      header: "Type",
      render: (item) => (
        <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-[11px] font-semibold text-slate-300">
          {item.type === "url" ? "Web Crawler" : "Manual Lead"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      key: "createdAt",
      header: "Submitted",
      render: (item) => (
        <span className="text-xs text-slate-400">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (item) => (
        <button
          onClick={() => openInspect(item)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Inspect Lead</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          Submissions Review Queue
        </h1>
        <p className="text-xs lg:text-sm text-slate-400 mt-1">
          Review job leads gathered via the AI Web Intelligence Crawler and student contributions. Convert approved leads directly into live listings.
        </p>
      </div>

      {/* Tabs Filter */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 shadow-lg">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
            setPage(1);
          }}
        />
      </div>

      {/* Submissions Table */}
      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(item) => item._id}
        isLoading={isLoading}
        emptyTitle="No submissions in queue"
        emptyDescription="When new leads are scraped or submitted by students, they will appear here."
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
      />

      {/* Inspect & Approval Modal */}
      {selectedSubmission && (
        <Modal
          isOpen={inspectModalOpen}
          onClose={() => {
            setInspectModalOpen(false);
            setSelectedSubmission(null);
          }}
          maxWidth="2xl"
          title="Inspect Internship Lead"
          description={`Submission ID: ${selectedSubmission._id}`}
        >
          <div className="space-y-5">
            {/* Top Status Banner */}
            <div className="flex items-center justify-between p-3.5 bg-[#0F172A] border border-slate-800 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Status:</span>
                <StatusBadge status={selectedSubmission.status} size="sm" />
              </div>
              {selectedSubmission.sourceUrl && (
                <a
                  href={selectedSubmission.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Open Source Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Extracted Details */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Position Title</span>
                  <span className="font-bold text-white text-sm">
                    {selectedSubmission.extractedData?.title ||
                      selectedSubmission.manualData?.title ||
                      "Untitled Lead"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Employer / Company</span>
                  <span className="font-bold text-white text-sm">
                    {selectedSubmission.extractedData?.companyName ||
                      selectedSubmission.manualData?.companyName ||
                      "Not specified"}
                  </span>
                </div>
              </div>

              {(selectedSubmission.extractedData?.description ||
                selectedSubmission.manualData?.description) && (
                <div>
                  <span className="text-slate-500 text-xs block mb-1">Description</span>
                  <p className="text-xs text-slate-300 leading-relaxed max-h-40 overflow-y-auto pr-1">
                    {selectedSubmission.extractedData?.description ||
                      selectedSubmission.manualData?.description}
                  </p>
                </div>
              )}
            </div>

            {/* Company Assignment for Approval */}
            {selectedSubmission.status !== "approved" && (
              <div className="p-4 bg-[#1E293B]/70 border border-amber-500/30 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F3A712]" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Convert to Live Listing
                  </h4>
                </div>
                <Select
                  label="Assign to Company"
                  required
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  placeholder="Select registered partner company..."
                  options={companies.map((c) => ({ value: c._id, label: c.name }))}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              {selectedSubmission.status !== "rejected" && selectedSubmission.status !== "approved" && (
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 hover:bg-rose-900/60 font-semibold text-xs transition-colors"
                >
                  Reject Lead
                </button>
              )}

              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => setInspectModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Close
                </button>

                {selectedSubmission.status !== "approved" && (
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isApproving || !selectedCompanyId}
                    className="bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs py-2.5 px-5 rounded-xl shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center gap-2 disabled:opacity-50"
                  >
                    {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Approve & Publish Listing</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Reason Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        maxWidth="md"
        title="Reject Internship Submission"
        description="Optionally provide a reason for rejecting this opportunity lead."
      >
        <form onSubmit={handleRejectConfirm} className="space-y-4">
          <Textarea
            label="Admin Rejection Note"
            rows={3}
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            placeholder="e.g. Duplicate link, expired role, or incomplete requirements..."
          />

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRejecting}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 disabled:opacity-50"
            >
              {isRejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              <span>Confirm Rejection</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
