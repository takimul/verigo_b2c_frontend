"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  ClipboardList,
  Edit3,
  FolderTree,
  Globe,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

const quickActions = [
  {
    title: "Add New Product",
    desc: "Create and publish a product with images and specs.",
    href: "/admin/products",
    icon: Plus,
  },
  {
    title: "Organize Categories",
    desc: "Manage Winter Essentials, Summer Essentials, and subcategories.",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Customer Inquiries",
    desc: "Review quote requests from wholesale buyers.",
    href: "/admin/inquiries",
    icon: ClipboardList,
  },
  {
    title: "Branding & Banner",
    desc: "Change logo, homepage banner, and contact information.",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { admin } = useAdminAuth();
  const isSuperAdmin = admin?.role === "SUPER_ADMIN";

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      {/* Top Welcome */}
      <div className="border-b border-neutral-200 pb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Control Center
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            Welcome back{admin?.name ? `, ${admin.name}` : ""}
          </h1>
          <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
            Manage your product catalogue, organize collections, and respond to quote requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition"
          >
            <Globe size={14} />
            View Live Website
          </Link>
        </div>
      </div>

      {/* Super Admin Live In-Line Editing Spotlight (If Super Admin) */}
      {isSuperAdmin && (
        <div className="border border-amber-300 bg-linear-to-r from-amber-50 to-orange-50/40 p-5 rounded-xs shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-amber-400 text-neutral-950 font-bold shrink-0">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-950 flex items-center gap-2">
                  Live On-Site Text Editor Enabled
                  <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900 uppercase">
                    Super Admin Exclusive
                  </span>
                </p>
                <p className="text-xs text-neutral-700 mt-1 max-w-2xl leading-relaxed">
                  You can edit text lines directly on the live website. Simply browse the storefront while signed in, hover your cursor over any headline or paragraph for a moment, and click the <strong>Edit</strong> pencil to modify and save it live.
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-neutral-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition shrink-0"
            >
              <Edit3 size={13} />
              Open Live Storefront
            </Link>
          </div>
        </div>
      )}

      {/* Overview Status Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs uppercase tracking-wider font-semibold">Account Role</span>
            <ShieldCheck size={18} />
          </div>
          <p className="mt-3 text-xl font-bold text-neutral-950">
            {admin?.role.replace("_", " ") ?? "Administrator"}
          </p>
          <p className="mt-1 text-xs text-neutral-500 truncate">
            {admin?.email ?? ""}
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs uppercase tracking-wider font-semibold">Catalogue Structure</span>
            <FolderTree size={18} />
          </div>
          <p className="mt-3 text-xl font-bold text-neutral-950">
            Winter &amp; Summer
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Organized by seasonal collections
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs uppercase tracking-wider font-semibold">Wholesale Inquiries</span>
            <ClipboardList size={18} />
          </div>
          <p className="mt-3 text-xl font-bold text-neutral-950">
            Quote Center
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            All quote submissions tracked
          </p>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div>
        <h2 className="text-lg font-bold text-neutral-950 mb-1">
          Quick Management Actions
        </h2>
        <p className="text-xs text-neutral-500 mb-4">
          Select an area to update your catalog, branding or settings.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                type="button"
                onClick={() => router.push(action.href)}
                className="group flex flex-col justify-between border border-neutral-200 bg-white p-5 text-left transition hover:border-neutral-950 hover:shadow-md cursor-pointer"
              >
                <div>
                  <div className="mb-4 flex size-10 items-center justify-center border border-neutral-200 bg-neutral-50 text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-semibold text-sm text-neutral-950">
                    {action.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed">
                    {action.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-900 group-hover:text-neutral-950">
                  <span>Manage</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
