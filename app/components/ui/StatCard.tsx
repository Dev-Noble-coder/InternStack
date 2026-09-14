import React from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: "amber" | "blue" | "emerald" | "purple" | "rose";
  onClick?: () => void;
}

const colorMap = {
  amber: {
    iconBg: "bg-amber-500/10 border-amber-500/30 text-[#F3A712]",
    glow: "group-hover:border-amber-500/40",
    badge: "text-amber-400 bg-amber-950/40 border-amber-800/60",
  },
  blue: {
    iconBg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    glow: "group-hover:border-blue-500/40",
    badge: "text-blue-400 bg-blue-950/40 border-blue-800/60",
  },
  emerald: {
    iconBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    glow: "group-hover:border-emerald-500/40",
    badge: "text-emerald-400 bg-emerald-950/40 border-emerald-800/60",
  },
  purple: {
    iconBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    glow: "group-hover:border-purple-500/40",
    badge: "text-purple-400 bg-purple-950/40 border-purple-800/60",
  },
  rose: {
    iconBg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
    glow: "group-hover:border-rose-500/40",
    badge: "text-rose-400 bg-rose-950/40 border-rose-800/60",
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  accentColor = "amber",
  onClick,
}) => {
  const scheme = colorMap[accentColor];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={`group relative bg-[#131B2E] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all duration-200 ${
        scheme.glow
      } ${onClick ? "cursor-pointer hover:bg-slate-900" : ""}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl lg:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
            {value}
          </h4>
        </div>
        <div
          className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${scheme.iconBg}`}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
        {subtitle && <span>{subtitle}</span>}
        {trend && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold ${
              trend.isPositive
                ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-400"
                : "bg-rose-950/40 border-rose-800/60 text-rose-400"
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
    </motion.div>
  );
};
