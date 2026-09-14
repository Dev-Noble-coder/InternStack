"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  Building2,
  CheckSquare,
  Sparkles,
  Inbox,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Award,
  Clock,
} from "lucide-react";
import { useAdminDashboard } from "../../hooks/useAdmin";
import { StatCard } from "../../components/ui/StatCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { DataTable, Column } from "../../components/ui/DataTable";
import { User } from "../../types/auth";
import { Application } from "../../types/student";

export default function AdminDashboardPage() {
  const { data: dashboard, isLoading } = useAdminDashboard();

  const stats = dashboard?.stats;
  const recentUsers = dashboard?.recentUsers || [];
  const recentApplications = dashboard?.recentApplications || [];
  const pendingSubmissions = dashboard?.pendingSubmissions ?? 0;

  const userColumns: Column<User>[] = [
    {
      key: "name",
      header: "User",
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
      header: "Registered",
      render: (u) => (
        <span className="text-xs text-slate-400">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const appColumns: Column<Application>[] = [
    {
      key: "student",
      header: "Student Applicant",
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
      header: "Applied Position",
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
      header: "Applied At",
      render: (a) => (
        <span className="text-xs text-slate-400">
          {new Date(a.appliedAt || a.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[#F3A712] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Administrative Command Center
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Platform Overview & Analytics
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            High-level metrics on students, employers, application vetting pipeline, and confirmed placements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/applications"
            className="bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-[2px_2px_0px_0px_#FFFFFF] transition-all"
          >
            Review Applications Queue
          </Link>
        </div>
      </div>

      {/* Pending Submissions Alert Banner */}
      {pendingSubmissions > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 lg:p-5 bg-gradient-to-r from-amber-950/60 to-[#1E293B] border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-[#F3A712] flex items-center justify-center shrink-0">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {pendingSubmissions} Community Internship Lead{pendingSubmissions > 1 ? "s" : ""} Awaiting Review
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                New scraped and student-submitted job leads are ready for approval into public listings.
              </p>
            </div>
          </div>
          <Link
            href="/admin/submissions"
            className="self-start sm:self-auto inline-flex items-center gap-2 bg-[#F3A712] text-[#0B1120] font-bold text-xs py-2 px-4 rounded-xl shrink-0"
          >
            <span>Review Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents ?? 0}
          subtitle="Registered undergraduates"
          icon={<Users className="w-5 h-5" />}
          accentColor="blue"
        />
        <StatCard
          title="Active Applications"
          value={stats?.activeApplications ?? 0}
          subtitle="Pending vetting & review"
          icon={<CheckSquare className="w-5 h-5" />}
          accentColor="amber"
        />
        <StatCard
          title="Confirmed Placements"
          value={stats?.placementsConfirmed ?? 0}
          subtitle="Successfully matched"
          icon={<Award className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          title="Published Listings"
          value={stats?.totalListings ?? 0}
          subtitle={`Across ${stats?.totalCompanies ?? 0} verified companies`}
          icon={<Briefcase className="w-5 h-5" />}
          accentColor="purple"
        />
      </div>

      {/* Tables Section: Recent Applications & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Applications</h3>
              <p className="text-xs text-slate-400">Latest submissions in the placement pipeline</p>
            </div>
            <Link
              href="/admin/applications"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <DataTable
            columns={appColumns}
            data={recentApplications}
            keyExtractor={(a) => a._id}
            isLoading={isLoading}
            emptyTitle="No recent applications"
            emptyDescription="New student applications will appear here."
          />
        </div>

        {/* Recent Users Directory */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Registrations</h3>
              <p className="text-xs text-slate-400">Newly joined students and staff</p>
            </div>
            <Link
              href="/admin/users"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <DataTable
            columns={userColumns}
            data={recentUsers}
            keyExtractor={(u) => u.id || u.email}
            isLoading={isLoading}
            emptyTitle="No recent users"
            emptyDescription="New user signups will appear here."
          />
        </div>
      </div>
    </div>
  );
}
