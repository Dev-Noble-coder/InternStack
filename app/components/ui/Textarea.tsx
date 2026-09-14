import React, { forwardRef } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, showCount, maxLength, className = "", id, value, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={textareaId} className="text-xs font-semibold text-slate-300">
              {label}
              {props.required && <span className="text-amber-400 ml-1">*</span>}
            </label>
          )}
          {showCount && maxLength && (
            <span className="text-[10px] text-slate-500">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={`w-full bg-[#0F172A] border text-white text-sm rounded-xl px-3.5 py-2.5 transition-all outline-none placeholder:text-slate-500 min-h-[100px] resize-y
            ${
              error
                ? "border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                : "border-slate-700/80 focus:border-[#F3A712] focus:ring-1 focus:ring-[#F3A712]/50 hover:border-slate-600"
            }
            ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-[11px] text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
