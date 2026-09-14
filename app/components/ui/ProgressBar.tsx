import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = true,
  size = "md",
  className = "",
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const heightMap = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3.5",
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-semibold text-slate-300">{label}</span>}
          {showPercentage && (
            <span className="font-bold text-[#F3A712] font-mono">{clampedValue}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-800/90 rounded-full overflow-hidden ${heightMap[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[#F3A712] to-[#F0CEA0] rounded-full shadow-[0_0_12px_rgba(243,167,18,0.5)]"
        />
      </div>
    </div>
  );
};
