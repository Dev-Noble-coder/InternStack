import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 lg:p-12 rounded-2xl bg-[#131B2E]/60 border border-slate-800/80 border-dashed ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        {icon || <FolderOpen className="w-7 h-7 text-[#F3A712]" />}
      </div>
      <h4 className="text-base lg:text-lg font-bold text-white mb-1.5">{title}</h4>
      <p className="text-xs lg:text-sm text-slate-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition-all duration-200 shadow-[2px_2px_0px_0px_#FFFFFF]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
