"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLiveEdit } from "@/context/LiveEditContext";
import { Edit3, Eye, LayoutDashboard, Sparkles, X } from "lucide-react";

export default function LiveEditFloatingBar() {
  const pathname = usePathname();
  const { isSuperAdmin, isEditMode, toggleEditMode, content } = useLiveEdit();
  const [minimized, setMinimized] = useState(false);

  if (!isSuperAdmin || pathname?.startsWith("/admin")) return null;

  const overridesCount = Object.keys(content).length;

  if (minimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs font-medium text-white shadow-xl hover:bg-neutral-800"
        >
          <Sparkles size={14} className="text-amber-400" />
          <span>Super Admin Editor</span>
          {overridesCount > 0 && (
            <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] font-bold text-neutral-950">
              {overridesCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Super admin editor toolbar"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 max-w-[94vw] rounded-full border border-neutral-700 bg-neutral-950/95 px-4 py-2 text-white shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3"
    >
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-amber-400">
          <Sparkles size={14} />
          <span className="hidden sm:inline">SUPER ADMIN</span>
        </div>

        <div className="h-4 w-px bg-neutral-800" />

        {/* Toggle Live Edit */}
        <button
          type="button"
          onClick={toggleEditMode}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium transition ${
            isEditMode
              ? "bg-amber-400 text-neutral-950 shadow-sm font-semibold"
              : "bg-neutral-800 text-neutral-300 hover:text-white"
          }`}
        >
          {isEditMode ? <Edit3 size={12} /> : <Eye size={12} />}
          <span>{isEditMode ? "Live Edit: ON" : "Live Edit: OFF"}</span>
        </button>

        {/* Overrides Badge */}
        {overridesCount > 0 && (
          <span className="hidden text-neutral-400 md:inline">
            <span className="text-white font-medium">{overridesCount}</span> lines customized
          </span>
        )}

        <div className="h-4 w-px bg-neutral-800" />

        {/* Link back to Admin dashboard */}
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-1 text-neutral-300 hover:text-white transition"
        >
          <LayoutDashboard size={13} />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        {/* Minimize button */}
        <button
          type="button"
          onClick={() => setMinimized(true)}
          title="Minimize toolbar"
          aria-label="Minimize editor toolbar"
          className="text-neutral-400 hover:text-white pl-1"
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  );
}

