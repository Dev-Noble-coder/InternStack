"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Briefcase,
  UserCheck,
  Building2,
  Clock,
  Loader2,
} from "lucide-react";
import {
  useNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useUnreadNotificationsCount,
} from "../../../hooks/useNotifications";
import { Tabs } from "../../../components/ui/Tabs";
import { Notification, NotificationType } from "../../../types/notification";
import toast from "react-hot-toast";

export default function StudentNotificationsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data: notificationsData, isLoading } = useNotifications({
    page,
    limit: 15,
    isRead: activeTab === "unread" ? "false" : undefined,
  });

  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const { mutateAsync: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();
  const { mutateAsync: markRead } = useMarkNotificationRead();

  const handleMarkAll = async () => {
    try {
      await markAllRead();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark notifications as read");
    }
  };

  const handleItemClick = async (item: Notification) => {
    if (!item.isRead) {
      try {
        await markRead(item._id);
      } catch {
        // silent
      }
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "PLACEMENT_CONFIRMED":
      case "APPLICATION_ACCEPTED":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "APPLICATION_REJECTED":
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case "PROFILE_CV_ISSUE":
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      case "LISTING_CLOSED":
      case "LISTING_EXPIRED":
        return <Clock className="w-5 h-5 text-slate-400" />;
      case "ADMIN_INVITATION":
        return <UserCheck className="w-5 h-5 text-[#F3A712]" />;
      default:
        return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  const tabs = [
    { id: "all", label: "All Notifications" },
    { id: "unread", label: "Unread Only", count: unreadCount },
  ];

  const items = notificationsData?.items || [];
  const pagination = notificationsData?.pagination;

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Real-time status updates on your applications, review verdicts, and placement confirmations.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            disabled={isMarkingAll}
            className="self-start sm:self-auto inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {isMarkingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center justify-between gap-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(t) => {
            setActiveTab(t);
            setPage(1);
          }}
        />
        {pagination && (
          <span className="text-xs text-slate-400 font-medium">
            {pagination.total} total
          </span>
        )}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-[#131B2E] border border-slate-800 rounded-2xl animate-pulse p-4"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Bell className="w-8 h-8 text-[#F3A712]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No notifications yet</h3>
          <p className="text-xs text-slate-400">
            When your applications are reviewed, accepted, or updated, alerts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <motion.div
              key={n._id}
              whileHover={{ y: -1 }}
              onClick={() => handleItemClick(n)}
              className={`p-4 lg:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.isRead
                  ? "bg-[#1E293B]/80 border-amber-500/40 shadow-md hover:bg-[#1E293B]"
                  : "bg-[#131B2E] border-slate-800 hover:bg-slate-800/40"
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-[#0F172A] border border-slate-700/80 flex items-center justify-center shrink-0">
                {getNotificationIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {n.title}
                  </h4>
                  {!n.isRead && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F3A712] shrink-0 mt-1 shadow-[0_0_8px_#F3A712]" />
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-500 font-medium block pt-1">
                  {new Date(n.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPrevious}
            className="px-4 py-2 bg-[#131B2E] border border-slate-700 text-xs font-semibold rounded-xl text-slate-300 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-slate-400 font-medium px-2">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNext}
            className="px-4 py-2 bg-[#131B2E] border border-slate-700 text-xs font-semibold rounded-xl text-slate-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
