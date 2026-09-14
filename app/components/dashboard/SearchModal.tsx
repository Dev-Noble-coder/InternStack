"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Send,
  User,
  Bell,
  Building2,
  Inbox,
  Users,
  FileText,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { Modal } from "../ui/Modal";
import { useAuthStore } from "../../stores/authStore";
import { useDebounce } from "../../hooks/useDebounce";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 150);
  const router = useRouter();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  const allItems = [
    // Student Actions
    { title: "Dashboard Overview", subtitle: "View your stats & suggested internships", path: "/dashboard", icon: LayoutDashboard, category: "Student Portal" },
    { title: "Find Internships", subtitle: "Browse published listings and 1-click apply", path: "/dashboard/listings", icon: Briefcase, category: "Student Portal" },
    { title: "My Applications", subtitle: "Track application statuses and withdrawal window", path: "/dashboard/applications", icon: CheckSquare, category: "Student Portal" },
    { title: "Submit Lead", subtitle: "Submit an internship URL or manual entry", path: "/dashboard/submissions", icon: Send, category: "Student Portal" },
    { title: "Profile & CV", subtitle: "Manage academic details, skills, and CV", path: "/dashboard/profile", icon: User, category: "Student Portal" },
    { title: "Notifications", subtitle: "View alerts and placement status updates", path: "/dashboard/notifications", icon: Bell, category: "Student Portal" },
    
    // Admin Actions (if admin)
    ...(isAdmin
      ? [
          { title: "Admin Console Overview", subtitle: "Platform metrics and stats summary", path: "/admin", icon: LayoutDashboard, category: "Admin Management" },
          { title: "Applications Vetting", subtitle: "Review scores, accept/reject, confirm placements", path: "/admin/applications", icon: CheckSquare, category: "Admin Management" },
          { title: "Manage Listings", subtitle: "Create, edit, close, and expire listings", path: "/admin/listings", icon: Briefcase, category: "Admin Management" },
          { title: "Companies Directory", subtitle: "Create & verify partner companies", path: "/admin/companies", icon: Building2, category: "Admin Management" },
          { title: "Submissions Review Queue", subtitle: "Approve scraped leads into live listings", path: "/admin/submissions", icon: Inbox, category: "Admin Management" },
          { title: "Users Directory", subtitle: "Manage students, admins, suspend or flag profiles", path: "/admin/users", icon: Users, category: "Admin Management" },
          { title: "Audit Trail", subtitle: "View platform security and audit logs", path: "/admin/audit-logs", icon: FileText, category: "Admin Management" },
          { title: "Admin Team & Invites", subtitle: "Invite admins and manage access", path: "/admin/team", icon: UserPlus, category: "Admin Management" },
        ]
      : []),
  ];

  const filteredItems = debouncedQuery.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : allItems;

  const handleSelect = (path: string) => {
    onClose();
    router.push(path);
  };

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl" showCloseButton={false}>
      <div className="flex flex-col gap-4">
        {/* Search Input Box */}
        <div className="flex items-center gap-3 bg-[#0B1120] border border-slate-700/80 rounded-xl px-4 py-3 text-white">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search pages..."
            className="w-full bg-transparent outline-none text-sm placeholder:text-slate-500 text-white"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[11px] font-mono border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto space-y-1 pr-1 scrollbar-none">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No matching pages or actions found.
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-[#F3A712] group-hover:bg-[#29335C] transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-[#F3A712] transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-400">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {item.category}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};
