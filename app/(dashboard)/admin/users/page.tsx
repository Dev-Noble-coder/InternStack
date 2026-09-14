"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserX,
  UserCheck,
  Flag,
  FileText,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Eye,
} from "lucide-react";
import {
  useAdminUsers,
  useSuspendUser,
  useReactivateUser,
  useDeactivateUser,
  useAdminStudentProfile,
  useFlagStudentProfile,
} from "../../../hooks/useAdmin";
import { useAuthStore } from "../../../stores/authStore";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { DataTable, Column } from "../../../components/ui/DataTable";
import { Modal } from "../../../components/ui/Modal";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import { Textarea } from "../../../components/ui/Textarea";
import { Tabs } from "../../../components/ui/Tabs";
import { User } from "../../../types/auth";
import { useDebounce } from "../../../hooks/useDebounce";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuthStore();
  const isSuperAdmin = currentUser?.role === "super_admin";

  const [roleTab, setRoleTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 350);

  // Action Modals
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewProfileId, setViewProfileId] = useState<string | null>(null);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [suspendConfirmOpen, setSuspendConfirmOpen] = useState(false);
  const [reactivateConfirmOpen, setReactivateConfirmOpen] = useState(false);
  const [deactivateConfirmOpen, setDeactivateConfirmOpen] = useState(false);

  const { data: usersData, isLoading } = useAdminUsers({
    page,
    limit: 15,
    role: roleTab === "all" ? undefined : roleTab,
    search: debouncedSearch.trim() || undefined,
  });

  const { data: studentProfile, isLoading: isLoadingProfile } = useAdminStudentProfile(
    viewProfileId || ""
  );

  const { mutateAsync: suspendUser, isPending: isSuspending } = useSuspendUser();
  const { mutateAsync: reactivateUser, isPending: isReactivating } = useReactivateUser();
  const { mutateAsync: deactivateUser, isPending: isDeactivating } = useDeactivateUser();
  const { mutateAsync: flagProfile, isPending: isFlagging } = useFlagStudentProfile();

  const handleSuspend = async () => {
    if (!selectedUser) return;
    try {
      await suspendUser(selectedUser.id);
      toast.success(`User ${selectedUser.firstName} suspended`);
      setSuspendConfirmOpen(false);
      setSelectedUser(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to suspend user");
    }
  };

  const handleReactivate = async () => {
    if (!selectedUser) return;
    try {
      await reactivateUser(selectedUser.id);
      toast.success(`User ${selectedUser.firstName} reactivated`);
      setReactivateConfirmOpen(false);
      setSelectedUser(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to reactivate user");
    }
  };

  const handleDeactivate = async () => {
    if (!selectedUser) return;
    try {
      await deactivateUser(selectedUser.id);
      toast.success(`User ${selectedUser.firstName} deactivated`);
      setDeactivateConfirmOpen(false);
      setSelectedUser(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to deactivate user");
    }
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await flagProfile({
        id: selectedUser.id,
        reason: flagReason.trim() || undefined,
      });
      toast.success("Student profile flagged. Notification sent to student.");
      setFlagModalOpen(false);
      setSelectedUser(null);
      setFlagReason("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to flag profile");
    }
  };

  const tabs = [
    { id: "all", label: "All Users" },
    { id: "student", label: "Students" },
    { id: "admin", label: "Admins" },
    { id: "super_admin", label: "Super Admins" },
  ];

  const items = usersData?.items || [];
  const pagination = usersData?.pagination;

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "User Account",
      render: (u) => (
        <div className="space-y-0.5">
          <p className="font-bold text-white">
            {u.firstName} {u.lastName}
          </p>
          <p className="text-xs text-slate-400">{u.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (u) => <StatusBadge status={u.role} size="sm" />,
    },
    {
      key: "status",
      header: "Account Status",
      render: (u) => <StatusBadge status={u.status} size="sm" />,
    },
    {
      key: "createdAt",
      header: "Joined Date",
      render: (u) => (
        <span className="text-xs text-slate-400">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (u) => (
        <div className="flex items-center justify-end gap-1.5">
          {u.role === "student" && (
            <>
              <button
                onClick={() => setViewProfileId(u.id)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="View Student Profile"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setSelectedUser(u);
                  setFlagModalOpen(true);
                }}
                className="p-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 text-amber-400 border border-amber-800/60 transition-colors"
                title="Flag Profile or CV Issue"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {u.status === "active" ? (
            <button
              onClick={() => {
                setSelectedUser(u);
                setSuspendConfirmOpen(true);
              }}
              className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-900/50 transition-colors"
              title="Suspend User"
            >
              <UserX className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedUser(u);
                setReactivateConfirmOpen(true);
              }}
              className="p-1.5 rounded-lg bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-900/50 transition-colors"
              title="Reactivate User"
            >
              <UserCheck className="w-3.5 h-3.5" />
            </button>
          )}

          {isSuperAdmin && u.status !== "deactivated" && (
            <button
              onClick={() => {
                setSelectedUser(u);
                setDeactivateConfirmOpen(true);
              }}
              className="px-2 py-1 rounded-lg bg-rose-950/50 hover:bg-rose-900/80 text-rose-300 border border-rose-800 text-[10px] font-bold uppercase"
              title="Deactivate Account"
            >
              Deactivate
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          User & Student Management
        </h1>
        <p className="text-xs lg:text-sm text-slate-400 mt-1">
          Inspect student academic profiles, manage admin team access, suspend abusive accounts, and flag profile/CV defects.
        </p>
      </div>

      {/* Filter and Search Bar */}
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
            placeholder="Search by name, email, matriculation number, or institution..."
            className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#F3A712]"
          />
        </div>

        <Tabs
          tabs={tabs}
          activeTab={roleTab}
          onChange={(tab) => {
            setRoleTab(tab);
            setPage(1);
          }}
        />
      </div>

      {/* Users Table */}
      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(item) => item.id || item.email}
        isLoading={isLoading}
        emptyTitle="No users found"
        emptyDescription="No users match the search criteria."
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
      />

      {/* Student Profile Inspector Modal */}
      {viewProfileId && (
        <Modal
          isOpen={!!viewProfileId}
          onClose={() => setViewProfileId(null)}
          maxWidth="2xl"
          title="Student Profile & Academic Verification"
          description={`User ID: ${viewProfileId}`}
        >
          {isLoadingProfile ? (
            <div className="h-48 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#F3A712]" />
            </div>
          ) : !studentProfile ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Student profile has not been initialized yet.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-[#0F172A] border border-slate-800 rounded-2xl grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Institution</span>
                  <span className="font-bold text-white text-sm">
                    {studentProfile.institution || "Not set"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Matric Number</span>
                  <span className="font-bold text-white text-sm font-mono">
                    {studentProfile.matricNumber || "Not set"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Faculty & Department</span>
                  <span className="font-semibold text-slate-300">
                    {studentProfile.faculty || "—"} / {studentProfile.department || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Academic Level</span>
                  <span className="font-semibold text-slate-300">
                    {studentProfile.level || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Internship Scheme</span>
                  <span className="font-semibold text-amber-400">
                    {studentProfile.internshipType || "6-Month SIWES"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Verification Status</span>
                  <span
                    className={`font-bold ${
                      studentProfile.isReadyToApply ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {studentProfile.isReadyToApply ? "Ready to Apply (100%)" : "Incomplete Requirements"}
                  </span>
                </div>
              </div>

              {studentProfile.cv?.url && (
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#F3A712]" />
                    <div>
                      <p className="text-xs font-bold text-white">{studentProfile.cv.filename}</p>
                      <p className="text-[10px] text-slate-400">
                        Uploaded: {new Date(studentProfile.cv.uploadedAt || "").toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <a
                    href={studentProfile.cv.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"
                  >
                    <span>Download CV</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {studentProfile.skills && studentProfile.skills.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Reported Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {studentProfile.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      )}

      {/* Flag Profile Modal */}
      <Modal
        isOpen={flagModalOpen}
        onClose={() => {
          setFlagModalOpen(false);
          setSelectedUser(null);
        }}
        maxWidth="md"
        title="Flag Student Profile / CV Issue"
        description={`Send a notification and email to ${selectedUser?.firstName} explaining required corrections.`}
      >
        <form onSubmit={handleFlagSubmit} className="space-y-4">
          <Textarea
            label="Correction Notice / Reason"
            required
            rows={3}
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="e.g. Please re-upload your CV with contact info visible, or correct your matriculation number format."
          />

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setFlagModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFlagging}
              className="bg-amber-500 hover:bg-amber-400 text-[#0B1120] font-bold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {isFlagging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flag className="w-4 h-4" />}
              <span>Send Flag Notice</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Suspend Confirm Modal */}
      <ConfirmModal
        isOpen={suspendConfirmOpen}
        onClose={() => {
          setSuspendConfirmOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleSuspend}
        title="Suspend User Account?"
        description={`Are you sure you want to suspend ${selectedUser?.firstName} ${selectedUser?.lastName}? All active login sessions will be immediately terminated.`}
        confirmLabel="Suspend User"
        variant="danger"
        isLoading={isSuspending}
      />

      {/* Reactivate Confirm Modal */}
      <ConfirmModal
        isOpen={reactivateConfirmOpen}
        onClose={() => {
          setReactivateConfirmOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleReactivate}
        title="Reactivate User Account?"
        description={`Are you sure you want to restore full access for ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
        confirmLabel="Reactivate User"
        variant="primary"
        isLoading={isReactivating}
      />

      {/* Deactivate Confirm Modal (Super Admin) */}
      <ConfirmModal
        isOpen={deactivateConfirmOpen}
        onClose={() => {
          setDeactivateConfirmOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeactivate}
        title="Permanently Deactivate Account?"
        description={`This action permanently deactivates ${selectedUser?.firstName}'s account and writes a security audit log.`}
        confirmLabel="Deactivate Account"
        variant="danger"
        isLoading={isDeactivating}
      />
    </div>
  );
}
