import React from "react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  className = "",
}) => {
  const normalized = (status || "").toLowerCase().trim();

  let styles = "bg-slate-800 text-slate-300 border-slate-700";
  let dotColor = "bg-slate-400";
  let label = status;

  switch (normalized) {
    // Applications & Placements
    case "applied":
      styles = "bg-blue-950/60 text-blue-400 border-blue-800/80";
      dotColor = "bg-blue-400";
      label = "Applied";
      break;
    case "reviewed":
    case "under_review":
      styles = "bg-purple-950/60 text-purple-300 border-purple-800/80";
      dotColor = "bg-purple-400";
      label = "Under Review";
      break;
    case "accepted":
      styles = "bg-emerald-950/60 text-emerald-400 border-emerald-800/80";
      dotColor = "bg-emerald-400";
      label = "Accepted";
      break;
    case "rejected":
      styles = "bg-rose-950/60 text-rose-400 border-rose-800/80";
      dotColor = "bg-rose-400";
      label = "Rejected";
      break;
    case "withdrawn":
      styles = "bg-slate-800/80 text-slate-400 border-slate-700";
      dotColor = "bg-slate-400";
      label = "Withdrawn";
      break;
    case "placement confirmed":
    case "placed":
      styles = "bg-amber-950/60 text-[#F3A712] border-amber-800/80";
      dotColor = "bg-[#F3A712]";
      label = "Placement Confirmed";
      break;

    // Listings
    case "published":
      styles = "bg-emerald-950/60 text-emerald-400 border-emerald-800/80";
      dotColor = "bg-emerald-400";
      label = "Published";
      break;
    case "closed":
      styles = "bg-amber-950/60 text-amber-400 border-amber-800/80";
      dotColor = "bg-amber-400";
      label = "Closed";
      break;
    case "expired":
      styles = "bg-slate-800/80 text-slate-400 border-slate-700";
      dotColor = "bg-slate-500";
      label = "Expired";
      break;

    // Submissions
    case "pending":
      styles = "bg-amber-950/60 text-amber-300 border-amber-800/80";
      dotColor = "bg-amber-400";
      label = "Pending Extraction";
      break;
    case "processing":
      styles = "bg-blue-950/60 text-blue-300 border-blue-800/80";
      dotColor = "bg-blue-400 animate-ping";
      label = "Processing (Crawling)";
      break;
    case "approved":
      styles = "bg-emerald-950/60 text-emerald-400 border-emerald-800/80";
      dotColor = "bg-emerald-400";
      label = "Approved (Live)";
      break;
    case "failed":
      styles = "bg-rose-950/60 text-rose-400 border-rose-800/80";
      dotColor = "bg-rose-400";
      label = "Extraction Failed";
      break;

    // Users
    case "active":
      styles = "bg-emerald-950/60 text-emerald-400 border-emerald-800/80";
      dotColor = "bg-emerald-400";
      label = "Active";
      break;
    case "suspended":
      styles = "bg-amber-950/60 text-amber-400 border-amber-800/80";
      dotColor = "bg-amber-400";
      label = "Suspended";
      break;
    case "deactivated":
      styles = "bg-rose-950/60 text-rose-400 border-rose-800/80";
      dotColor = "bg-rose-400";
      label = "Deactivated";
      break;

    // Roles
    case "super_admin":
      styles = "bg-amber-500/10 text-[#F3A712] border-[#F3A712]/30";
      dotColor = "bg-[#F3A712]";
      label = "Super Admin";
      break;
    case "admin":
      styles = "bg-indigo-950/60 text-indigo-300 border-indigo-800/80";
      dotColor = "bg-indigo-400";
      label = "Admin";
      break;
    case "student":
      styles = "bg-slate-800/80 text-slate-300 border-slate-700";
      dotColor = "bg-slate-400";
      label = "Student";
      break;

    default:
      styles = "bg-slate-800 text-slate-300 border-slate-700";
      dotColor = "bg-slate-400";
      break;
  }

  const sizeStyles =
    size === "sm"
      ? "px-2 py-0.5 text-[10px] gap-1.5"
      : "px-2.5 py-1 text-xs gap-2 font-medium";

  return (
    <span
      className={`inline-flex items-center rounded-full border ${sizeStyles} ${styles} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span className="capitalize">{label}</span>
    </span>
  );
};
