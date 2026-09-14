"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import { DashboardSidebar } from "../components/dashboard/Sidebar";
import { DashboardHeader } from "../components/dashboard/Header";
import { Loader2, ShieldAlert, Layers } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, isInitializing } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isAuthenticated, isInitializing, router]);

  // Loading state
  if (isInitializing || !isAuthenticated) {
    return (
      <div className="bg-[#0B1120] min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-[#131B2E] border border-slate-800 flex items-center justify-center text-[#F3A712] mb-6 shadow-2xl animate-pulse">
          <Layers className="w-8 h-8" />
        </div>
        <div className="flex items-center gap-3 text-slate-300 font-semibold text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#F3A712]" />
          <span>Initializing workspace...</span>
        </div>
      </div>
    );
  }

  // Admin access gate for /admin routes
  const isAdminRoute = pathname.startsWith("/admin");
  const hasAdminRole = user?.role === "admin" || user?.role === "super_admin";

  if (isAdminRoute && !hasAdminRole) {
    return (
      <div className="bg-[#0B1120] min-h-screen flex flex-col items-center justify-center text-white p-6">
        <div className="max-w-md w-full bg-[#131B2E] border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-sm text-slate-400 mb-6">
            You do not have administrative privileges to access this area. Please return to the student portal.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center bg-[#F3A712] text-[#0B1120] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#F3A712]/90 transition-all shadow-[2px_2px_0px_0px_#FFFFFF]"
          >
            Return to Student Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F1F5F9] flex flex-col lg:flex-row relative">
      {/* Sidebar */}
      <DashboardSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <DashboardHeader setMobileOpen={setMobileOpen} />

        {/* Page Content Container */}
        <main className="flex-1 p-4 lg:p-8 w-full relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
