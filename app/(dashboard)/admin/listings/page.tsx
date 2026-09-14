"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Building2,
  Clock,
  Edit2,
  XCircle,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  useAdminListings,
  useCreateListing,
  useUpdateListing,
  useCloseListing,
  useExpireListing,
  useAdminCompanies,
} from "../../../hooks/useAdmin";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { DataTable, Column } from "../../../components/ui/DataTable";
import { Modal } from "../../../components/ui/Modal";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Select } from "../../../components/ui/Select";
import { Tabs } from "../../../components/ui/Tabs";
import { Listing } from "../../../types/listing";
import { useDebounce } from "../../../hooks/useDebounce";
import toast from "react-hot-toast";

export default function AdminListingsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 350);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [closeReason, setCloseReason] = useState("");

  const [form, setForm] = useState<{
    companyId: string;
    title: string;
    description: string;
    location: string;
    workMode: "onsite" | "remote" | "hybrid";
    internshipType: string;
    requirements: string;
    skills: string;
    openings: number;
    applicationDeadline: string;
  }>({
    companyId: "",
    title: "",
    description: "",
    location: "Lagos",
    workMode: "onsite",
    internshipType: "6-Month SIWES",
    requirements: "",
    skills: "",
    openings: 1,
    applicationDeadline: "",
  });

  const { data: listingsData, isLoading } = useAdminListings({
    page,
    limit: 15,
    status: activeTab === "all" ? undefined : activeTab,
    search: debouncedSearch.trim() || undefined,
  });

  const { data: companiesData } = useAdminCompanies({ limit: 100 });
  const companies = companiesData?.items || [];

  const { mutateAsync: createListing, isPending: isCreating } = useCreateListing();
  const { mutateAsync: closeListing, isPending: isClosing } = useCloseListing();
  const { mutateAsync: expireListing, isPending: isExpiring } = useExpireListing();

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyId || !form.title) {
      toast.error("Please select a company and provide a title");
      return;
    }

    try {
      await createListing({
        companyId: form.companyId,
        title: form.title,
        description: form.description,
        locations: [form.location],
        workMode: form.workMode,
        internshipType: form.internshipType,
        requirements: form.requirements.split("\n").filter((r) => r.trim()),
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        openings: Number(form.openings),
        applicationDeadline: form.applicationDeadline || undefined,
        status: "published",
      });
      toast.success("Listing created and published!");
      setCreateModalOpen(false);
      setForm({
        companyId: "",
        title: "",
        description: "",
        location: "Lagos",
        workMode: "onsite",
        internshipType: "6-Month SIWES",
        requirements: "",
        skills: "",
        openings: 1,
        applicationDeadline: "",
      });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to create listing");
    }
  };

  const handleCloseConfirm = async () => {
    if (!selectedListing) return;
    try {
      await closeListing({
        id: selectedListing._id,
        closeReason: closeReason.trim() || undefined,
      });
      toast.success("Listing closed successfully");
      setCloseModalOpen(false);
      setSelectedListing(null);
      setCloseReason("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to close listing");
    }
  };

  const handleExpire = async (listing: Listing) => {
    try {
      await expireListing(listing._id);
      toast.success("Listing marked as expired");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to expire listing");
    }
  };

  const tabs = [
    { id: "all", label: "All Listings" },
    { id: "published", label: "Published (Active)" },
    { id: "closed", label: "Closed" },
    { id: "expired", label: "Expired" },
  ];

  const items = listingsData?.items || [];
  const pagination = listingsData?.pagination;

  const columns: Column<Listing>[] = [
    {
      key: "title",
      header: "Listing Position",
      render: (item) => {
        const company = typeof item.companyId === "object" ? item.companyId : null;
        return (
          <div className="space-y-0.5">
            <p className="font-bold text-white">{item.title}</p>
            <p className="text-xs text-slate-400">{company?.name || "Company"}</p>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      key: "workMode",
      header: "Work Mode",
      render: (item) => (
        <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-300 font-medium">
          {item.workMode || "Onsite"}
        </span>
      ),
    },
    {
      key: "openings",
      header: "Slots",
      render: (item) => (
        <span className="text-xs font-semibold text-white">{item.openings || 1} slots</span>
      ),
    },
    {
      key: "deadline",
      header: "Deadline",
      render: (item) => (
        <span className="text-xs text-slate-400">
          {item.applicationDeadline
            ? new Date(item.applicationDeadline).toLocaleDateString()
            : "Rolling"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          {item.status === "published" && (
            <>
              <button
                onClick={() => {
                  setSelectedListing(item);
                  setCloseModalOpen(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-300 hover:bg-amber-900/60 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => handleExpire(item)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Expire
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Listings Management
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Create, publish, edit, and close SIWES placement opportunities across partner companies.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="self-start sm:self-auto bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Listing</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search listings by title or description..."
            className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#F3A712]"
          />
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

      {/* Listings Table */}
      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(item) => item._id}
        isLoading={isLoading}
        emptyTitle="No listings found"
        emptyDescription="Create a new listing to start receiving student applications."
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
      />

      {/* Create Listing Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        maxWidth="2xl"
        title="Create New Internship Listing"
        description="Publish a verified industrial training placement opportunity for students."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Employer / Company"
              required
              value={form.companyId}
              onChange={(e) => setForm({ ...form, companyId: e.target.value })}
              placeholder="Select Company..."
              options={companies.map((c) => ({ value: c._id, label: c.name }))}
            />
            <Input
              label="Position Title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Backend Engineering Intern"
            />
          </div>

          <Textarea
            label="Job Description"
            rows={3}
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Provide overview of the role, daily tasks, and mentorship structure..."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Primary Location / State"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Lagos, Abuja"
            />
            <Select
              label="Work Mode"
              value={form.workMode}
              onChange={(e) => setForm({ ...form, workMode: e.target.value as any })}
              options={[
                { value: "onsite", label: "Onsite" },
                { value: "remote", label: "Remote" },
                { value: "hybrid", label: "Hybrid" },
              ]}
            />
            <Input
              label="Number of Openings"
              type="number"
              min={1}
              value={form.openings}
              onChange={(e) => setForm({ ...form, openings: parseInt(e.target.value) || 1 })}
            />
          </div>

          <Textarea
            label="Key Requirements (One per line)"
            rows={3}
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            placeholder="Must be in 300L or 400L&#10;Knowledge of JavaScript / Python&#10;Strong problem solving skills"
          />

          <Input
            label="Skills (Comma-separated)"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            placeholder="Node.js, PostgreSQL, Docker, Git"
          />

          <Input
            label="Application Deadline"
            type="date"
            value={form.applicationDeadline}
            onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })}
          />

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs py-2.5 px-5 rounded-xl shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center gap-2 disabled:opacity-50"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Create & Publish</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Close Listing Modal */}
      <Modal
        isOpen={closeModalOpen}
        onClose={() => {
          setCloseModalOpen(false);
          setSelectedListing(null);
        }}
        maxWidth="md"
        title="Close Internship Listing"
        description="Closing this listing will notify all active applicants that the listing is closed."
      >
        <div className="space-y-4">
          <Input
            label="Reason for Closing (Optional)"
            value={closeReason}
            onChange={(e) => setCloseReason(e.target.value)}
            placeholder="e.g. Position filled / Slots exhausted"
          />

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCloseModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCloseConfirm}
              disabled={isClosing}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 disabled:opacity-50"
            >
              {isClosing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              <span>Confirm Close</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
