"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { Modal } from "./Modal";

interface FailureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  errorCode?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export const FailureModal: React.FC<FailureModalProps> = ({
  isOpen,
  onClose,
  title = "Something Went Wrong",
  message,
  errorCode,
  retryLabel = "Try Again",
  onRetry,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" showCloseButton={true}>
      <div className="flex flex-col items-center text-center py-3">
        {/* Animated Warning Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 mb-4 shadow-[0_0_24px_rgba(244,63,94,0.3)]"
        >
          <AlertTriangle className="w-8 h-8" />
        </motion.div>

        <h3 className="text-xl font-bold text-white tracking-tight mb-2">{title}</h3>
        
        {errorCode && (
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-950/60 border border-rose-800 text-rose-300 text-[11px] font-mono font-semibold mb-3">
            {errorCode}
          </div>
        )}

        <p className="text-sm text-slate-300 max-w-sm mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors"
          >
            Dismiss
          </button>
          {onRetry && (
            <button
              onClick={() => {
                onRetry();
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-colors shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{retryLabel}</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
