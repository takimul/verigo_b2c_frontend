"use client";

import React, {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type ElementType,
} from "react";
import { useLiveEdit } from "@/context/LiveEditContext";
import { Check, Edit3, LoaderCircle, RotateCcw, X } from "lucide-react";

interface InlineEditableProps {
  contentKey: string;
  defaultValue: string;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
  hoverDelay?: number;
  children?: ReactNode;
  allowEmpty?: boolean;
  placeholder?: string;
}

export default function InlineEditable({
  contentKey,
  defaultValue,
  as: Component = "span",
  className = "",
  multiline = false,
  hoverDelay = 250,
  children,
  allowEmpty = false,
  placeholder,
}: InlineEditableProps) {
  const { isSuperAdmin, isEditMode, getContent, updateContentValue, resetContentValue } =
    useLiveEdit();

  const currentText = getContent(contentKey, defaultValue);

  const [isHovered, setIsHovered] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(currentText);
  const [isSaving, setIsSaving] = useState(false);

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // If draft text needs sync with currentText when not editing
  useEffect(() => {
    if (!isEditing) {
      setDraftText(currentText);
    }
  }, [currentText, isEditing]);

  // Handle hover delay
  const handleMouseEnter = () => {
    if (!isSuperAdmin || !isEditMode || isEditing) return;
    hoverTimerRef.current = setTimeout(() => {
      setShowIcon(true);
    }, hoverDelay);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    setIsHovered(false);
    setShowIcon(false);
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if ("select" in inputRef.current) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const startEditing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraftText(currentText);
    setIsEditing(true);
    setShowIcon(false);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!allowEmpty && draftText.trim() === "") return;
    setIsSaving(true);
    try {
      await updateContentValue(contentKey, draftText.trim());
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDraftText(currentText);
    setIsEditing(false);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resetContentValue(contentKey);
    setDraftText(defaultValue);
    setIsEditing(false);
  };

  const isTextEmpty = (!currentText || currentText.trim() === "") && (!children || children === "");

  // If not super admin or edit mode is off, render pure component without any overhead
  if (!isSuperAdmin || !isEditMode) {
    if (allowEmpty && isTextEmpty) {
      return null;
    }
    return <Component className={className}>{children ?? currentText}</Component>;
  }

  // If empty and in edit mode with allowEmpty enabled, render an inviting dashed placeholder button
  if (allowEmpty && isTextEmpty && !isEditing) {
    return (
      <span
        onClick={startEditing}
        role="button"
        tabIndex={0}
        title={`Add optional text (${contentKey})`}
        className="inline-flex items-center gap-1.5 cursor-pointer rounded-xs border border-dashed border-neutral-300 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-neutral-400 transition hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-800"
      >
        <Edit3 size={10} />
        <span>{placeholder || "+ Add optional badge"}</span>
      </span>
    );
  }

  return (
    <span
      className={`relative inline-block transition-all ${
        showIcon ? "outline-1 outline-dashed outline-amber-500/80 bg-amber-500/5 rounded-xs" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Component className={className}>{children ?? currentText}</Component>

      {/* Floating Edit Icon that appears on hover after hoverDelay ms */}
      {showIcon && !isEditing && (
        <button
          type="button"
          onClick={startEditing}
          title={`Edit line: ${contentKey}`}
          className="absolute -top-3.5 -right-3.5 z-40 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-neutral-950 shadow-md transition-transform hover:scale-110 active:scale-95 animate-in fade-in zoom-in duration-150 cursor-pointer"
        >
          <Edit3 size={11} strokeWidth={2.5} />
          <span>Edit</span>
        </button>
      )}

      {/* Inline Editing Popover Modal */}
      {isEditing && (
        <span
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={handleCancel}
        >
          <span
            className="w-full max-w-lg rounded-none border border-neutral-300 bg-white p-5 shadow-2xl text-left block"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="flex items-center justify-between border-b border-neutral-200 pb-3 block">
              <span className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center bg-amber-100 text-amber-800">
                  <Edit3 size={13} />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Edit Text ({contentKey})
                </span>
              </span>
              <button
                type="button"
                onClick={handleCancel}
                className="text-neutral-400 hover:text-neutral-800 p-1 cursor-pointer"
              >
                <X size={16} />
              </button>
            </span>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Content (Press Enter to Save)
                </label>
                {multiline ? (
                  <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    rows={4}
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    className="w-full border border-neutral-300 bg-white p-3 text-sm text-neutral-900 outline-none focus:border-neutral-950"
                  />
                ) : (
                  <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type="text"
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-950"
                  />
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-red-600 transition"
                >
                  <RotateCcw size={12} />
                  Reset to default
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 bg-neutral-950 px-4 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <LoaderCircle size={13} className="animate-spin" />
                    ) : (
                      <Check size={13} />
                    )}
                    Save
                  </button>
                </div>
              </div>
            </form>
          </span>
        </span>
      )}
    </span>
  );
}

