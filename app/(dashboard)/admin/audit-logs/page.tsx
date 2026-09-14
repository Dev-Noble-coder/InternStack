"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Shield,
  Eye,
  Calendar,
  Clock,
  User,
  Layers,
} from "lucide-react";
import { useAdminAuditLogs } from "../../../hooks/useAdmin";
import { DataTable, Column } from "../../../components/ui/DataTable";
import { Modal } from "../../../components/ui/Modal";
import { Select } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { AuditLog } from "../../../types/admin";

export default function AdminAuditLogsPage() {
  const [action, setAction] = useState("");
  const [targetType, setTargetType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data: auditData, isLoading } = useAdminAuditLogs({
    page,
    limit: 20,
    action: action || undefined,
    targetType: targetType || undefined,
    from: from ? new Date(from).toISOString() : undefined,
    to: to ? new Date(to).toISOString() : undefined,
  });

  const openInspect = (log: AuditLog) => {
    setSelectedLog(log);
    setInspectModalOpen(true);
  };

  const getActionBadgeColor = (act: string) => {
    if (act.includes("ACCEPTED") || act.includes("CONFIRMED") || act.includes("CREATED") || act.includes("REACTIVATED")) {
      return "bg-emerald-950/60 text-emerald-400 border-emerald-800/80";
    }
    if (act.includes("SUSPENDED") || act.includes("CLOSED") || act.includes("FLAGGED") || act.includes("REJECTED") || act.includes("DEACTIVATED")) {
      return "bg-rose-950/60 text-rose-400 border-rose-800/80";
    }
    return "bg-indigo-950/60 text-indigo-300 border-indigo-800/80";
  };

  const items = auditData?.items || [];
  const pagination = auditData?.pagination;

  const columns: Column<AuditLog>[] = [
    {
      key: "action",
      header: "Action Performed",
      render: (log) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-mono font-bold ${getActionBadgeColor(
            log.action
          )}`}
        >
          {log.action}
        </span>
      ),
    },
    {
      key: "performedBy",
      header: "Admin Actor",
      render: (log) => {
        const actor = typeof log.performedBy === "object" ? log.performedBy : null;
        return (
          <div className="space-y-0.5">
            <p className="font-semibold text-white">
              {actor ? `${actor.firstName || ""} ${actor.lastName || ""}`.trim() : "Admin"}
            </p>
            <p className="text-xs text-slate-400">{actor?.email || "System"}</p>
          </div>
        );
      },
    },
    {
      key: "targetType",
      header: "Target Resource",
      render: (log) => (
        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium">
          {log.targetType || "Resource"}
        </span>
      ),
    },
    {
      key: "timestamp",
      header: "Timestamp",
      render: (log) => (
        <span className="text-xs text-slate-400">
          {new Date(log.timestamp || log.createdAt).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Metadata",
      align: "right",
      render: (log) => (
        <button
          onClick={() => openInspect(log)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>JSON</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          System Audit Trail & Security Logs
        </h1>
        <p className="text-xs lg:text-sm text-slate-400 mt-1">
          Immutable log of administrative operations, student profile flags, placement verifications, and user suspensions.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <Select
            label="Filter by Action"
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setPage(1);
            }}
            options={[
              { value: "", label: "All Actions" },
              { value: "USER_SUSPENDED", label: "USER_SUSPENDED" },
              { value: "USER_REACTIVATED", label: "USER_REACTIVATED" },
              { value: "USER_DEACTIVATED", label: "USER_DEACTIVATED" },
              { value: "PROFILE_FLAGGED", label: "PROFILE_FLAGGED" },
              { value: "COMPANY_CREATED", label: "COMPANY_CREATED" },
              { value: "LISTING_CREATED", label: "LISTING_CREATED" },
              { value: "LISTING_CLOSED", label: "LISTING_CLOSED" },
              { value: "APPLICATION_REVIEWED", label: "APPLICATION_REVIEWED" },
              { value: "APPLICATION_ACCEPTED", label: "APPLICATION_ACCEPTED" },
              { value: "APPLICATION_REJECTED", label: "APPLICATION_REJECTED" },
              { value: "PLACEMENT_CONFIRMED", label: "PLACEMENT_CONFIRMED" },
              { value: "ADMIN_INVITED", label: "ADMIN_INVITED" },
            ]}
          />

          <Select
            label="Target Resource Type"
            value={targetType}
            onChange={(e) => {
              setTargetType(e.target.value);
              setPage(1);
            }}
            options={[
              { value: "", label: "All Resource Types" },
              { value: "User", label: "User" },
              { value: "Listing", label: "Listing" },
              { value: "Company", label: "Company" },
              { value: "Application", label: "Application" },
              { value: "Submission", label: "Submission" },
              { value: "Invitation", label: "Invitation" },
            ]}
          />

          <Input
            label="From Date"
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
          />

          <Input
            label="To Date"
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(item) => item._id}
        isLoading={isLoading}
        emptyTitle="No audit records found"
        emptyDescription="System audit entries matching your criteria will appear here."
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
      />

      {/* Metadata Inspector Modal */}
      {selectedLog && (
        <Modal
          isOpen={inspectModalOpen}
          onClose={() => {
            setInspectModalOpen(false);
            setSelectedLog(null);
          }}
          maxWidth="lg"
          title="Audit Log Payload & Context"
          description={`Log Entry ID: ${selectedLog._id}`}
        >
          <div className="space-y-4">
            <div className="p-4 bg-[#0F172A] border border-slate-800 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Action:</span>
                <span className="font-mono font-bold text-white">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Type:</span>
                <span className="text-white font-semibold">{selectedLog.targetType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target ID:</span>
                <span className="font-mono text-slate-300">{selectedLog.targetId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span className="text-slate-300">
                  {new Date(selectedLog.timestamp || selectedLog.createdAt).toISOString()}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Metadata JSON Record
              </span>
              <pre className="p-4 bg-[#0B1120] border border-slate-800 rounded-2xl text-xs font-mono text-emerald-400 overflow-x-auto max-h-60 scrollbar-none">
                {JSON.stringify(selectedLog.metadata || {}, null, 2)}
              </pre>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
