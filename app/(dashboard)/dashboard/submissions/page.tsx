"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Globe,
  FileEdit,
  Sparkles,
  Link2,
  Building2,
  MapPin,
  Clock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Inbox,
} from "lucide-react";
import { useStudentSubmissions, useSubmitListing } from "../../../hooks/useStudent";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Select } from "../../../components/ui/Select";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { SuccessModal } from "../../../components/ui/SuccessModal";
import { Tabs } from "../../../components/ui/Tabs";
import { DataTable, Column } from "../../../components/ui/DataTable";
import { ListingSubmission } from "../../../types/student";
import toast from "react-hot-toast";

export default function StudentSubmissionsPage() {
  const [submissionType, setSubmissionType] = useState<"url" | "manual">("url");
  const [urlInput, setUrlInput] = useState("");
  const [manualForm, setManualForm] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    workMode: "onsite",
    internshipType: "6-Month SIWES",
    applicationUrl: "",
    deadline: "",
  });

  const [page, setPage] = useState(1);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const { data: submissionsData, isLoading: isLoadingSubmissions } = useStudentSubmissions({
    page,
    limit: 10,
  });

  const { mutateAsync: submitListing, isPending: isSubmitting } = useSubmitListing();

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      toast.error("Please enter a valid job URL");
      return;
    }

    try {
      await submitListing({
        type: "url",
        sourceUrl: urlInput.trim(),
      });
      setUrlInput("");
      setSuccessModalOpen(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to submit lead. Please try again.");
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.title || !manualForm.company) {
      toast.error("Please provide at least the position title and company name");
      return;
    }

    try {
      await submitListing({
        type: "manual",
        title: manualForm.title,
        company: manualForm.company,
        description: manualForm.description,
        location: manualForm.location,
        workMode: manualForm.workMode,
        internshipType: manualForm.internshipType,
        applicationUrl: manualForm.applicationUrl,
        deadline: manualForm.deadline,
      });
      setManualForm({
        title: "",
        company: "",
        description: "",
        location: "",
        workMode: "onsite",
        internshipType: "6-Month SIWES",
        applicationUrl: "",
        deadline: "",
      });
      setSuccessModalOpen(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to submit listing. Please try again.");
    }
  };

  const submissions = submissionsData?.items || [];
  const pagination = submissionsData?.pagination;

  const columns: Column<ListingSubmission>[] = [
    {
      key: "title",
      header: "Opportunity Title",
      render: (item) => {
        const title =
          item.extractedData?.title ||
          item.manualData?.title ||
          (item.sourceUrl ? item.sourceUrl.replace(/^https?:\/\//, "").slice(0, 32) + "..." : "Submitted Lead");
        const company = item.extractedData?.companyName || item.manualData?.companyName || "Unknown Company";

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
          {item.type === "url" ? "Web Link" : "Manual Form"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Extraction / Review Status",
      render: (item) => (
        <div className="space-y-1">
          <StatusBadge status={item.status} size="sm" />
          {item.adminNote && (
            <p className="text-[11px] text-rose-300 font-medium max-w-xs">{item.adminNote}</p>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Date Submitted",
      render: (item) => (
        <span className="text-xs text-slate-400">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          Submit an Internship Lead
        </h1>
        <p className="text-xs lg:text-sm text-slate-400 mt-1">
          Found an industrial training or SIWES opening elsewhere? Submit it to help fellow students. Our AI crawler extracts details automatically.
        </p>
      </div>

      {/* Submission Form Card */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden">
        {/* Toggle Mode */}
        <div className="flex items-center gap-2 p-1 bg-[#0F172A] border border-slate-800 rounded-xl w-fit mb-6">
          <button
            type="button"
            onClick={() => setSubmissionType("url")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              submissionType === "url"
                ? "bg-[#F3A712] text-[#0B1120] shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>URL Web Scraper (Fast)</span>
          </button>
          <button
            type="button"
            onClick={() => setSubmissionType("manual")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              submissionType === "manual"
                ? "bg-[#F3A712] text-[#0B1120] shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileEdit className="w-4 h-4" />
            <span>Manual Form Entry</span>
          </button>
        </div>

        {/* URL Scraper Mode */}
        {submissionType === "url" ? (
          <form onSubmit={handleUrlSubmit} className="space-y-4 max-w-2xl">
            <div className="p-4 bg-[#0F172A]/80 border border-slate-700/80 rounded-2xl flex items-start gap-3 text-xs text-slate-300">
              <Sparkles className="w-5 h-5 text-[#F3A712] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">AI Web Intelligence Crawler:</span>
                <p className="mt-0.5 text-slate-400">
                  Paste any job opening link (LinkedIn, Twitter, company career portals). Our crawler automatically extracts the job title, company, requirements, and deadline for review.
                </p>
              </div>
            </div>

            <Input
              label="Opportunity Web Link / URL"
              type="url"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://company.com/careers/internship-2026..."
              icon={<Link2 className="w-4 h-4" />}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Extract & Submit Lead</span>
            </button>
          </form>
        ) : (
          /* Manual Entry Mode */
          <form onSubmit={handleManualSubmit} className="space-y-5 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Position / Role Title"
                required
                value={manualForm.title}
                onChange={(e) => setManualForm({ ...manualForm, title: e.target.value })}
                placeholder="e.g. Software Engineering Intern"
              />
              <Input
                label="Company Name"
                required
                value={manualForm.company}
                onChange={(e) => setManualForm({ ...manualForm, company: e.target.value })}
                placeholder="e.g. Flutterwave, Paystack, Chevron"
              />
            </div>

            <Textarea
              label="Job Description & Summary"
              rows={4}
              value={manualForm.description}
              onChange={(e) => setManualForm({ ...manualForm, description: e.target.value })}
              placeholder="Provide a short description of the internship responsibilities..."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Location / State"
                value={manualForm.location}
                onChange={(e) => setManualForm({ ...manualForm, location: e.target.value })}
                placeholder="e.g. Lagos, Abuja, Port Harcourt"
                icon={<MapPin className="w-4 h-4" />}
              />
              <Select
                label="Work Mode"
                value={manualForm.workMode}
                onChange={(e) => setManualForm({ ...manualForm, workMode: e.target.value })}
                options={[
                  { value: "onsite", label: "Onsite" },
                  { value: "remote", label: "Remote" },
                  { value: "hybrid", label: "Hybrid" },
                ]}
              />
              <Select
                label="Internship Duration"
                value={manualForm.internshipType}
                onChange={(e) => setManualForm({ ...manualForm, internshipType: e.target.value })}
                options={[
                  { value: "3-Month SIWES", label: "3-Month SIWES" },
                  { value: "6-Month SIWES", label: "6-Month SIWES" },
                  { value: "1-Year IT", label: "1-Year IT" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="External Application Link (Optional)"
                type="url"
                value={manualForm.applicationUrl}
                onChange={(e) => setManualForm({ ...manualForm, applicationUrl: e.target.value })}
                placeholder="https://..."
              />
              <Input
                label="Application Deadline (Optional)"
                type="date"
                value={manualForm.deadline}
                onChange={(e) => setManualForm({ ...manualForm, deadline: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Submit Opportunity</span>
            </button>
          </form>
        )}
      </div>

      {/* Submissions History Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              My Submitted Opportunities
            </h3>
            <p className="text-xs text-slate-400">
              Live updates as our crawler extracts and administrators approve your submissions into listings.
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={submissions}
          keyExtractor={(item) => item._id}
          isLoading={isLoadingSubmissions}
          emptyTitle="No submissions yet"
          emptyDescription="When you submit an internship URL or manual lead, it will appear here for tracking."
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Lead Submitted Successfully!"
        message="Thank you for contributing! Our crawler has queued your submission for processing and verification."
        actionLabel="Done"
      />
    </div>
  );
}
