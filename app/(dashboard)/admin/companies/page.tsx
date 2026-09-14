"use client";

import React, { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Globe,
  MapPin,
  ExternalLink,
  Edit2,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  useAdminCompanies,
  useCreateCompany,
  useUpdateCompany,
} from "../../../hooks/useAdmin";
import { DataTable, Column } from "../../../components/ui/DataTable";
import { Modal } from "../../../components/ui/Modal";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Company } from "../../../types/listing";
import { useDebounce } from "../../../hooks/useDebounce";
import toast from "react-hot-toast";

export default function AdminCompaniesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 350);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [forceConfirmOpen, setForceConfirmOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const [form, setForm] = useState({
    name: "",
    website: "",
    logo: "",
    industry: "Technology",
    state: "Lagos",
    city: "Ikeja",
    description: "",
  });

  const { data: companiesData, isLoading } = useAdminCompanies({
    page,
    limit: 15,
    search: debouncedSearch.trim() || undefined,
  });

  const { mutateAsync: createCompany, isPending: isCreating } = useCreateCompany();
  const { mutateAsync: updateCompany, isPending: isUpdating } = useUpdateCompany();

  const handleCreateSubmit = async (e?: React.FormEvent, force: boolean = false) => {
    if (e) e.preventDefault();
    if (!form.name) {
      toast.error("Company name is required");
      return;
    }

    try {
      await createCompany({
        data: form,
        force,
      });
      toast.success("Company registered successfully!");
      setCreateModalOpen(false);
      setForceConfirmOpen(false);
      setForm({
        name: "",
        website: "",
        logo: "",
        industry: "Technology",
        state: "Lagos",
        city: "Ikeja",
        description: "",
      });
    } catch (err: unknown) {
      const errRes = (err as { response?: { data?: { error?: { code?: string; message?: string } } } })?.response?.data?.error;
      if (errRes?.code === "COMPANY_NAME_SIMILAR" && !force) {
        setForceConfirmOpen(true);
      } else {
        toast.error(errRes?.message || "Failed to create company");
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;

    try {
      await updateCompany({
        id: selectedCompany._id,
        data: form,
      });
      toast.success("Company updated successfully!");
      setEditModalOpen(false);
      setSelectedCompany(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to update company");
    }
  };

  const openEdit = (company: Company) => {
    setSelectedCompany(company);
    setForm({
      name: company.name || "",
      website: company.website || "",
      logo: company.logo || "",
      industry: company.industry || "Technology",
      state: company.state || "Lagos",
      city: company.city || "",
      description: company.description || "",
    });
    setEditModalOpen(true);
  };

  const items = companiesData?.items || [];
  const pagination = companiesData?.pagination;

  const columns: Column<Company>[] = [
    {
      key: "name",
      header: "Company & Brand",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#F3A712] overflow-hidden shrink-0">
            {item.logo ? (
              <img src={item.logo} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="font-bold text-white">{item.name}</p>
            <p className="text-xs text-slate-400">{item.industry || "Enterprise"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "website",
      header: "Website",
      render: (item) =>
        item.website ? (
          <a
            href={item.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{item.website.replace(/^https?:\/\//, "")}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-xs text-slate-500">—</span>
        ),
    },
    {
      key: "location",
      header: "Location",
      render: (item) => (
        <div className="flex items-center gap-1 text-xs text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-[#F3A712]" />
          <span>
            {item.city ? `${item.city}, ` : ""}
            {item.state || "Nigeria"}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Registered",
      render: (item) => (
        <span className="text-xs text-slate-400">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (item) => (
        <button
          onClick={() => openEdit(item)}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          aria-label="Edit company"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Partner Companies & Employers
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Maintain the directory of verified industrial training partners offering student placements.
          </p>
        </div>

        <button
          onClick={() => {
            setForm({
              name: "",
              website: "",
              logo: "",
              industry: "Technology",
              state: "Lagos",
              city: "Ikeja",
              description: "",
            });
            setCreateModalOpen(true);
          }}
          className="self-start sm:self-auto bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search company by name, website, or industry..."
            className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#F3A712]"
          />
        </div>
      </div>

      {/* Companies Table */}
      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(item) => item._id}
        isLoading={isLoading}
        emptyTitle="No companies registered yet"
        emptyDescription="Add partner employers to assign listings and coordinate placements."
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
      />

      {/* Add Company Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        maxWidth="lg"
        title="Register New Partner Company"
        description="Add a company to the directory for SIWES internship placements."
      >
        <form onSubmit={(e) => handleCreateSubmit(e, false)} className="space-y-4">
          <Input
            label="Company Legal / Brand Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Paystack, Andela, Dangote"
          />
          <Input
            label="Official Website URL"
            type="url"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            placeholder="https://company.com"
            icon={<Globe className="w-4 h-4" />}
          />
          <Input
            label="Company Logo Image URL (Optional)"
            type="url"
            value={form.logo}
            onChange={(e) => setForm({ ...form, logo: e.target.value })}
            placeholder="https://.../logo.png"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="State / Region"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              placeholder="e.g. Lagos, Rivers, Abuja"
            />
            <Input
              label="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="e.g. Ikeja, Lekki, Victoria Island"
            />
          </div>

          <Textarea
            label="Company Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brief overview of company operations and industry..."
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
              <span>Save Company</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Company Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedCompany(null);
        }}
        maxWidth="lg"
        title="Edit Partner Company"
        description={`Updating details for ${selectedCompany?.name}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Company Legal / Brand Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Official Website URL"
            type="url"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            icon={<Globe className="w-4 h-4" />}
          />
          <Input
            label="Company Logo Image URL"
            type="url"
            value={form.logo}
            onChange={(e) => setForm({ ...form, logo: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
            <Input
              label="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
          <Textarea
            label="Company Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs py-2.5 px-5 rounded-xl shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center gap-2 disabled:opacity-50"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Update Details</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Force Similar Name Override Confirmation */}
      <ConfirmModal
        isOpen={forceConfirmOpen}
        onClose={() => setForceConfirmOpen(false)}
        onConfirm={() => handleCreateSubmit(undefined, true)}
        title="Similar Company Name Detected"
        description={`A company with a similar name already exists in the directory. Are you sure you want to proceed and create "${form.name}" anyway?`}
        confirmLabel="Yes, Create Anyway"
        variant="warning"
        isLoading={isCreating}
      />
    </div>
  );
}
