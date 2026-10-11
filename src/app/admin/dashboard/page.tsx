"use client";

import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Boxes,
  ClipboardList,
  FolderTree,
  Settings,
  ShieldCheck,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/context/AdminAuthContext";

const sections = [
  {
    title: "Products",
    description: "Manage apparel products, specifications and images.",
    href: "/admin/products",
    icon: Boxes,
  },
  {
    title: "Categories",
    description: "Organize your product catalog.",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Inquiries",
    description: "Review wholesale and OEM/ODM inquiries.",
    href: "/admin/inquiries",
    icon: ClipboardList,
  },
  {
    title: "Site settings",
    description: "Update branding, contact details and the homepage banner.",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { admin } = useAdminAuth();

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#777168]">
          Control center
        </p>

        <h1 className="font-serif text-3xl sm:text-4xl">
          Welcome back{admin?.name ? `, ${admin.name}` : ""}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#777168]">
          Manage your wholesale catalog, customer inquiries and storefront
          settings from one place.
        </p>
      </div>

      {/* Overview cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <div className="border border-[#ded9d0] bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#777168]">Administrator access</p>
            <ShieldCheck size={20} strokeWidth={1.5} />
          </div>

          <p className="mt-5 text-xl font-medium">
            {admin?.role ?? "Administrator"}
          </p>

          <p className="mt-2 break-all text-sm text-[#777168]">
            Signed in as {admin?.email ?? ""}
          </p>
        </div>

        <div className="border border-[#ded9d0] bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#777168]">Storefront management</p>
            <ArrowUpRight size={20} strokeWidth={1.5} />
          </div>

          <p className="mt-5 text-xl font-medium">Your next steps</p>

          <p className="mt-2 text-sm leading-6 text-[#777168]">
            Configure your storefront, manage your product catalog, and respond
            to wholesale inquiries.
          </p>
        </div>
      </div>

      {/* Management navigation */}
      <div className="mb-5">
        <h2 className="font-serif text-2xl">Management</h2>

        <p className="mt-2 text-sm text-[#777168]">Choose an area to manage.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <button
              key={section.title}
              type="button"
              onClick={() => router.push(section.href)}
              className="group flex min-h-44 items-start justify-between gap-5 border border-[#ded9d0] bg-white p-6 text-left transition-colors duration-200 hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
            >
              <div>
                <div className="mb-5 flex h-10 w-10 items-center justify-center border border-[#ded9d0] transition-colors group-hover:border-[#171717]">
                  <Icon size={19} strokeWidth={1.5} />
                </div>

                <h3 className="font-medium">{section.title}</h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#777168]">
                  {section.description}
                </p>
              </div>

              <ArrowUpRight
                size={19}
                className="shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
