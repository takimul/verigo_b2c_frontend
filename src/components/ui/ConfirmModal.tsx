"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Info, LoaderCircle, Trash2, X } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  hideCancel?: boolean; // For alert-only modals
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  busy = false,
  onConfirm,
  onCancel,
  hideCancel = false,
}: ConfirmModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !busy) {
        onCancel();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, busy, onCancel]);

  if (!isOpen) return null;

  const iconVariants = {
    danger: (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
        <Trash2 className="h-5 w-5" />
      </div>
    ),
    warning: (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <AlertTriangle className="h-5 w-5" />
      </div>
    ),
    info: (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-800">
        <Info className="h-5 w-5" />
      </div>
    ),
  };

  const confirmBtnVariants = {
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    warning: "bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500",
    info: "bg-neutral-950 text-white hover:bg-neutral-800 focus:ring-neutral-900",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onCancel();
      }}
    >
      <div className="relative w-full max-w-md border border-neutral-200 bg-[#faf9f6] p-6 shadow-2xl transition-all sm:p-7">
        {!busy && (
          <button
            type="button"
            aria-label="Close"
            onClick={onCancel}
            className="absolute right-4 top-4 rounded-xs p-1 text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-800"
          >
            <X size={18} />
          </button>
        )}

        <div className="flex items-start gap-4">
          {iconVariants[variant]}
          <div className="flex-1">
            <h3 className="font-serif text-lg font-medium text-neutral-950">
              {title}
            </h3>
            <p className="mt-2 text-xs leading-5 text-neutral-600 sm:text-sm">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-neutral-200/80">
          {!hideCancel && (
            <button
              type="button"
              disabled={busy}
              onClick={onCancel}
              className="border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition disabled:opacity-50 ${confirmBtnVariants[variant]}`}
          >
            {busy && <LoaderCircle size={13} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

