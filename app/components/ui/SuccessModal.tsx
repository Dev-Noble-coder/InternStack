"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Modal } from "./Modal";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  actionLabel = "Continue",
  onAction,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" showCloseButton={false}>
      <div className="flex flex-col items-center text-center py-4">
        {/* Animated Checkmark Circle */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mb-5 shadow-[0_0_24px_rgba(16,185,129,0.3)]"
        >
          <CheckCircle2 className="w-9 h-9" />
        </motion.div>

        <h3 className="text-2xl font-bold text-white tracking-tight mb-2">{title}</h3>
        <p className="text-sm text-slate-300 max-w-sm mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => {
              if (onAction) {
                onAction();
              } else {
                onClose();
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-[#F3A712] text-[#0B1120] font-bold text-sm py-3 px-6 rounded-xl hover:bg-[#F3A712]/90 transition-all duration-200 shadow-[2px_2px_0px_0px_#FFFFFF]"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
