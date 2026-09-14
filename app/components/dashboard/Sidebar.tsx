"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  FileText,
  User,
  Bell,
  Building2,
  Inbox,
  Users,
  UserPlus,
  LogOut,
  Layers,
  Send,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useAuth } from "../../hooks/useAuth";
import { useUnreadNotificationsCount } from "../../hooks/useNotifications";
import { ConfirmModal } from "../ui/ConfirmModal";
import toast from "react-hot-toast";

interface DashboardSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: number | string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  mobileOpen,
  setMobileOpen,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user } = useAuthStore();
  const { logoutMutation } = useAuth();
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isSuperAdmin = user?.role === "super_admin";
  const isInAdminSection = pathname.startsWith("/admin");

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.email?.split("@")[0] || "User";

  const displayInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ""}`.toUpperCase()
    : "IS";

  // Student Navigation Items
  const studentNavItems: NavItem[] = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard, exact: true },
    { name: "Find Internships", path: "/dashboard/listings", icon: Briefcase },
    { name: "My Applications", path: "/dashboard/applications", icon: CheckSquare },
    { name: "Submit Lead", path: "/dashboard/submissions", icon: Send },
    { name: "Profile & CV", path: "/dashboard/profile", icon: User },
    {
      name: "Notifications",
      path: "/dashboard/notifications",
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  // Admin Navigation Items
  const adminNavItems: NavItem[] = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
    { name: "Applications Vetting", path: "/admin/applications", icon: CheckSquare },
    { name: "Listings", path: "/admin/listings", icon: Briefcase },
    { name: "Companies", path: "/admin/companies", icon: Building2 },
    { name: "Submissions Queue", path: "/admin/submissions", icon: Inbox },
    { name: "Users & Students", path: "/admin/users", icon: Users },
    { name: "Audit Logs", path: "/admin/audit-logs", icon: FileText },
    ...(isSuperAdmin
      ? [{ name: "Team & Invites", path: "/admin/team", icon: UserPlus }]
      : []),
  ];

  const currentNavItems = isInAdminSection ? adminNavItems : studentNavItems;

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logged out successfully");
      router.push("/sign-in");
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  // desktop state
  const isExpanded = isHovered;
  const sidebarWidth = isExpanded ? "lg:w-[260px]" : "lg:w-[80px]";

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed lg:sticky top-0 lg:top-4 left-0 lg:ml-4 lg:mt-4 lg:mb-4 z-50 h-screen lg:h-[calc(100vh-32px)] rounded-none lg:rounded-2xl bg-[#131B2E] border-r lg:border border-slate-800 text-white flex flex-col transition-all duration-300 ease-in-out w-[260px] lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarWidth} overflow-hidden shrink-0 shadow-2xl`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-5 shrink-0 pt-2 border-b border-slate-800/60">
          <Link
            href={isInAdminSection ? "/admin" : "/dashboard"}
            className="flex items-center gap-3 w-[212px]"
          >
            <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#29335C] to-[#131B2E] border border-slate-700 flex items-center justify-center text-[#F3A712] shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div
              className={`flex flex-col whitespace-nowrap transition-opacity duration-300 ${
                isExpanded || mobileOpen ? "opacity-100" : "opacity-0 lg:hidden"
              }`}
            >
              <div className="flex items-center tracking-tight font-bold text-lg leading-none">
                <span className="text-[#F0CEA0]">Intern</span>
                <span className="text-[#F1F5F9]">Stack</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
                {isInAdminSection ? "Admin Console" : "Student Portal"}
              </span>
            </div>
          </Link>
        </div>

        {/* Workspace Mode Switcher (if Admin) */}
        {isAdmin && (
          <div className="px-2.5 pt-3">
            <Link
              href={isInAdminSection ? "/dashboard" : "/admin"}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center h-10 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-amber-400 transition-colors ${
                isExpanded || mobileOpen ? "px-3 justify-start gap-3" : "px-0 justify-center"
              }`}
            >
              <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                {isInAdminSection ? (
                  <GraduationCap className="w-4 h-4 text-[#F0CEA0]" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-[#F3A712]" />
                )}
              </div>
              <span
                className={`whitespace-nowrap transition-opacity duration-300 ${
                  isExpanded || mobileOpen ? "opacity-100" : "opacity-0 lg:hidden"
                }`}
              >
                {isInAdminSection ? "Switch to Student View" : "Switch to Admin View"}
              </span>
            </Link>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 py-3 flex flex-col gap-1 relative overflow-y-auto overflow-x-hidden scrollbar-none px-2.5">
          {currentNavItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.path
              : pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className="relative flex items-center h-11 group rounded-xl transition-all duration-150"
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#F3A712] rounded-r-full z-10 shadow-[0_0_8px_#F3A712]" />
                )}

                <div
                  className={`flex items-center w-full h-full rounded-xl transition-all duration-150 ${
                    isExpanded || mobileOpen ? "px-3.5 gap-3 justify-start" : "px-0 justify-center"
                  } ${
                    isActive
                      ? "bg-[#29335C] text-white font-bold shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#F3A712]" : "text-slate-400"}`} />
                  </div>
                  <span
                    className={`text-xs font-semibold whitespace-nowrap transition-opacity duration-300 ${
                      isExpanded || mobileOpen ? "opacity-100" : "opacity-0 lg:hidden"
                    }`}
                  >
                    {item.name}
                  </span>

                  {item.badge && (
                    <span
                      className={`ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white ${
                        isExpanded || mobileOpen ? "opacity-100" : "opacity-0 lg:hidden"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="shrink-0 pb-4 pt-2 flex flex-col gap-1 border-t border-slate-800/80 px-2.5">
          {/* User Profile Tile */}
          <Link
            href="/dashboard/profile"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center h-14 rounded-xl hover:bg-slate-800/60 transition-colors ${
              isExpanded || mobileOpen ? "px-2.5 justify-start" : "px-0 justify-center"
            }`}
          >
            <div className={`flex items-center ${isExpanded || mobileOpen ? "gap-3 w-[212px]" : "justify-center"}`}>
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={displayName}
                  className="shrink-0 w-8 h-8 rounded-xl object-cover border border-slate-700"
                />
              ) : (
                <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-[#29335C] to-[#1E293B] text-[#F3A712] border border-slate-700 flex items-center justify-center font-bold text-xs shadow-inner">
                  {displayInitials}
                </div>
              )}
              <div
                className={`flex flex-col whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
                  isExpanded || mobileOpen ? "opacity-100" : "opacity-0 lg:hidden"
                }`}
              >
                <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                  {displayName}
                </span>
                <span className="text-[10px] text-slate-400 capitalize">
                  {user?.role || "Student"}
                </span>
              </div>
            </div>
          </Link>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`flex items-center h-10 rounded-xl text-left text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors ${
              isExpanded || mobileOpen ? "px-2.5 justify-start" : "px-0 justify-center"
            }`}
          >
            <div className={`flex items-center ${isExpanded || mobileOpen ? "gap-3 w-[212px]" : "justify-center"}`}>
              <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                <LogOut className="w-4 h-4 text-rose-400" />
              </div>
              <span
                className={`text-xs font-semibold whitespace-nowrap transition-opacity duration-300 ${
                  isExpanded || mobileOpen ? "opacity-100" : "opacity-0 lg:hidden"
                }`}
              >
                Sign Out
              </span>
            </div>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        description="Are you sure you want to end your current session? You will need to sign in again to access your dashboard."
        confirmLabel="Sign Out"
        variant="danger"
        isLoading={logoutMutation.isPending}
      />
    </>
  );
};
