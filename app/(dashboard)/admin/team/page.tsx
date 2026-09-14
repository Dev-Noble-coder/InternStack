"use client";

import React, { useState } from "react";
import {
  UserPlus,
  Mail,
  Shield,
  Clock,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  useAdminInvitations,
  useCreateInvitation,
  useResendInvitation,
  useRevokeInvitation,
} from "../../../hooks/useAdmin";
import { useAuthStore } from "../../../stores/authStore";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { DataTable, Column } from "../../../components/ui/DataTable";
import { Modal } from "../../../components/ui/Modal";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Tabs } from "../../../components/ui/Tabs";
import { AdminInvitation } from "../../../types/admin";
import toast from "react-hot-toast";

export default function AdminTeamPage() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === "super_admin";

  const [activeTab, setActiveTab] = useState<string>("all");
  const [page, setPage] = useState(1);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [revokeConfirmOpen, setRevokeConfirmOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<AdminInvitation | null>(null);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "super_admin">("admin");

  const { data: invitationsData, isLoading } = useAdminInvitations({
    page,
    limit: 15,
    status: activeTab === "all" ? undefined : activeTab,
  });

  const { mutateAsync: createInvite, isPending: isInviting } = useCreateInvitation();
  const { mutateAsync: resendInvite, isPending: isResending } = useResendInvitation();
  const { mutateAsync: revokeInvite, isPending: isRevoking } = useRevokeInvitation();

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      await createInvite({ email: email.trim(), role });
      toast.success("Invitation link sent to recipient email (72-hour validity)");
      setInviteModalOpen(false);
      setEmail("");
      setRole("admin");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to send invitation");
    }
  };

  const handleResend = async (id: string) => {
    try {
      await resendInvite(id);
      toast.success("Invitation resent with fresh 72-hour token");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to resend invitation");
    }
  };

  const handleRevokeConfirm = async () => {
    if (!selectedInvite) return;
    try {
      await revokeInvite(selectedInvite._id);
      toast.success("Invitation revoked");
      setRevokeConfirmOpen(false);
      setSelectedInvite(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to revoke invitation");
    }
  };

  const tabs = [
    { id: "all", label: "All Invitations" },
    { id: "pending", label: "Pending" },
    { id: "accepted", label: "Accepted" },
    { id: "expired", label: "Expired" },
    { id: "revoked", label: "Revoked" },
  ];

  const items = invitationsData?.items || [];
  const pagination = invitationsData?.pagination;

  const columns: Column<AdminInvitation>[] = [
    {
      key: "email",
      header: "Invited Email",
      render: (inv) => (
        <div className="flex items-center gap-2.5">
          <Mail className="w-4 h-4 text-[#F3A712]" />
          <span className="font-bold text-white text-xs lg:text-sm">{inv.email}</span>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role Level",
      render: (inv) => <StatusBadge status={inv.role} size="sm" />,
    },
    {
      key: "status",
      header: "Invitation Status",
      render: (inv) => <StatusBadge status={inv.status} size="sm" />,
    },
    {
      key: "expiresAt",
      header: "Expires At",
      render: (inv) => (
        <span className="text-xs text-slate-400">
          {inv.expiresAt ? new Date(inv.expiresAt).toLocaleDateString() : "72h token"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (inv) => (
        <div className="flex items-center justify-end gap-2">
          {inv.status === "pending" && (
            <>
              <button
                onClick={() => handleResend(inv._id)}
                disabled={isResending}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resend</span>
              </button>
              <button
                onClick={() => {
                  setSelectedInvite(inv);
                  setRevokeConfirmOpen(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/60 rounded-lg text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Revoke</span>
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (!isSuperAdmin) {
    return (
      <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto">
        <Shield className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-1">Super Admin Authorization Required</h3>
        <p className="text-xs text-slate-400">
          Only Super Administrators have permissions to issue admin invitations and manage team roles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Admin Team & Access Invitations
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Invite new administrators, assign elevated roles, and monitor active invitation tokens.
          </p>
        </div>

        <button
          onClick={() => setInviteModalOpen(true)}
          className="self-start sm:self-auto bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center gap-2 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Admin</span>
        </button>
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

      {/* Invitations Table */}
      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(item) => item._id}
        isLoading={isLoading}
        emptyTitle="No invitations found"
        emptyDescription="Send an invitation to onboard a new team member."
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
      />

      {/* Invite Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        maxWidth="md"
        title="Invite Administrator"
        description="Recipient will receive an activation email with a 72-hour token to setup their account."
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <Input
            label="Recipient Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@internstack.com.ng"
            icon={<Mail className="w-4 h-4" />}
          />

          <Select
            label="Administrative Role"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            options={[
              { value: "admin", label: "Admin (Standard Reviewer & Listing Manager)" },
              { value: "super_admin", label: "Super Admin (Full Governance & Invitations)" },
            ]}
          />

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setInviteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isInviting}
              className="bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs py-2.5 px-5 rounded-xl shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center gap-2 disabled:opacity-50"
            >
              {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              <span>Send Invitation</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Revoke Confirm Modal */}
      <ConfirmModal
        isOpen={revokeConfirmOpen}
        onClose={() => {
          setRevokeConfirmOpen(false);
          setSelectedInvite(null);
        }}
        onConfirm={handleRevokeConfirm}
        title="Revoke Admin Invitation?"
        description={`Are you sure you want to invalidate the invitation sent to ${selectedInvite?.email}? The invite link will become unusable immediately.`}
        confirmLabel="Revoke Invite"
        variant="danger"
        isLoading={isRevoking}
      />
    </div>
  );
}
