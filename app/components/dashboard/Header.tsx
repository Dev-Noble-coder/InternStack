"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  CheckCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import {
  useUnreadNotificationsCount,
  useNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "../../hooks/useNotifications";
import { SearchModal } from "./SearchModal";
import { StatusBadge } from "../ui/StatusBadge";
import toast from "react-hot-toast";

interface DashboardHeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ setMobileOpen }) => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const { data: notificationsData } = useNotifications({ limit: 5 });
  const { mutateAsync: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();
  const { mutateAsync: markRead } = useMarkNotificationRead();

  const recentNotifications = notificationsData?.items || [];
  const isInAdminSection = pathname.startsWith("/admin");

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark notifications as read");
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    try {
      await markRead(id);
    } catch {
      // silent
    }
  };

  return (
    <>
      <header className="h-20 bg-[#0B1120]/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
        {/* Mobile menu hamburger button */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center tracking-tight font-bold text-base">
            <span className="text-[#F0CEA0]">Intern</span>
            <span className="text-[#F1F5F9]">Stack</span>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex items-center justify-center flex-1 max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="relative w-full bg-[#131B2E] border border-slate-800 hover:border-slate-700 rounded-full h-11 flex items-center px-4 transition-all text-left shadow-inner group"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-[#F3A712] shrink-0 transition-colors" />
            <span className="w-full px-3 text-xs text-slate-400">
              Search internships, applications, tools, or pages...
            </span>
            <kbd className="shrink-0 flex items-center justify-center font-mono font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded text-[10px] border border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons & Badges */}
        <div className="flex items-center gap-3.5 ml-auto lg:ml-0">
          {/* Active Mode Pill */}
          <div className="hidden sm:flex items-center gap-2">
            <StatusBadge status={user?.role || "student"} size="sm" />
          </div>

          {/* Search Button for Mobile */}
          <button
            onClick={() => setSearchOpen(true)}
            className="lg:hidden p-2.5 bg-[#131B2E] rounded-xl border border-slate-800 text-slate-400 hover:text-white"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notification Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              className="relative w-10 h-10 bg-[#131B2E] hover:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-800 transition-colors text-slate-300 hover:text-white shadow-sm"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {notifOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#131B2E] border border-slate-800 rounded-2xl shadow-2xl p-4 text-[#F1F5F9] z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      disabled={isMarkingAll}
                      className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 disabled:opacity-50"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-none">
                  {recentNotifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No notifications yet.
                    </div>
                  ) : (
                    recentNotifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => handleMarkSingleRead(n._id)}
                        className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                          !n.isRead
                            ? "bg-[#1E293B]/70 border-amber-500/30 hover:bg-[#1E293B]"
                            : "bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-white leading-snug">
                            {n.title}
                          </p>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#F3A712] shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-normal line-clamp-2">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-500 mt-2 block">
                          {new Date(n.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 text-center">
                  <Link
                    href={isInAdminSection ? "/dashboard/notifications" : "/dashboard/notifications"}
                    onClick={() => setNotifOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-[#F3A712] transition-colors"
                  >
                    <span>View all notifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
