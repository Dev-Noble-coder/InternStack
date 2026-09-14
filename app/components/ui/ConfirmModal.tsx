"use client";

import React from "react";
import { AlertCircle, HelpCircle, Loader2 } from "lucide-react";
import { Modal } from "./Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <AlertCircle className="w-8 h-8 text-rose-400" />,
          iconBg: "bg-rose-500/20 border-rose-500/40",
          confirmBtn: "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50",
        };
      case "warning":
        return {
          icon: <AlertCircle className="w-8 h-8 text-amber-400" />,
          iconBg: "bg-amber-500/20 border-amber-500/40",
          confirmBtn: "bg-amber-500 hover:bg-amber-400 text-[#0B1120] font-bold",
        };
      case "primary":
      default:
        return {
          icon: <HelpCircle className="w-8 h-8 text-[#F3A712]" />,
          iconBg: "bg-[#F3A712]/20 border-[#F3A712]/40",
          confirmBtn: "bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold shadow-[2px_2px_0px_0px_#FFFFFF]",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" showCloseButton={!isLoading}>
      <div className="flex flex-col items-center text-center py-2">
        <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-4 ${styles.iconBg}`}>
          {styles.icon}
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight mb-2">{title}</h3>
        <p className="text-sm text-slate-300 max-w-sm mb-6 leading-relaxed">{description}</p>

        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 ${styles.confirmBtn}`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
