"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ClipboardList,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/context/AdminAuthContext";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Boxes,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Inquiries",
    href: "/admin/inquiries",
    icon: ClipboardList,
  },
  {
    label: "Site settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, isLoading, isAuthenticated, logout } = useAdminAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
      toast.success("You have signed out.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to sign out. Please try again.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0]">
        <p className="text-sm text-[#777168]">
          Checking administrator session...
        </p>
      </main>
    );
  }

  if (!admin) {
    return <AdminLoginRedirect />;
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#171717]">
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-[#ded9d0] bg-white transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-[82px]" : "lg:w-[250px]"} lg:translate-x-0`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-[#eeeae3] px-5">
          <Link href="/admin/dashboard" className="min-w-0">
            {collapsed ? (
              <span className="text-lg font-semibold tracking-wider">VE</span>
            ) : (
              <>
                <span className="block text-sm font-semibold tracking-[0.14em]">
                  VERIGO ESSENTIAL
                </span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-[#777168]">
                  Admin workspace
                </span>
              </>
            )}
          </Link>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMobileOpen(false)}
            className="p-1 text-[#777168] lg:hidden"
          >
            <X size={19} />
          </button>

          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((value) => !value)}
            className="hidden border border-[#ded9d0] p-1.5 text-[#777168] hover:text-black lg:block"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <div className="border-b border-[#eeeae3] px-5 py-5">
          {!collapsed && (
            <>
              <p className="text-xs text-[#777168]">SIGNED IN AS</p>
              <p className="mt-2 truncate text-sm font-medium">
                {admin.name || admin.email}
              </p>
              <p className="mt-1 text-xs text-[#777168]">
                {admin.role.replace("_", " ")}
              </p>
            </>
          )}

          {collapsed && (
            <div
              title={admin.email}
              className="mx-auto flex h-9 w-9 items-center justify-center border border-[#ded9d0] text-xs font-semibold"
            >
              {(admin.name || admin.email).slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {!collapsed && (
            <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#99938a]">
              Workspace
            </p>
          )}

          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                onClick={() => setMobileOpen(false)}
                className={`flex min-h-11 items-center gap-3 border-l-2 px-3 text-sm transition ${
                  active
                    ? "border-[#171717] bg-[#f7f5f0] font-medium text-[#171717]"
                    : "border-transparent text-[#777168] hover:bg-[#faf9f6] hover:text-black"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon size={18} strokeWidth={1.6} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#eeeae3] p-3">
          <Link
            href="/"
            className={`mb-1 flex min-h-11 items-center gap-3 px-3 text-sm text-[#777168] hover:bg-[#faf9f6] hover:text-black ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LayoutDashboard size={18} strokeWidth={1.6} />
            {!collapsed && <span>View storefront</span>}
          </Link>

          <button
            type="button"
            disabled={isLoggingOut}
            onClick={() => void handleLogout()}
            title={collapsed ? "Sign out" : undefined}
            className={`flex min-h-11 w-full items-center gap-3 px-3 text-sm text-[#777168] transition hover:bg-[#faf9f6] hover:text-black disabled:opacity-50 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={18} strokeWidth={1.6} />
            {!collapsed && (
              <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
            )}
          </button>
        </div>
      </aside>

      <div
        className={`min-h-screen transition-[padding] duration-300 ${
          collapsed ? "lg:pl-[82px]" : "lg:pl-[250px]"
        }`}
      >
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-[#ded9d0] bg-[#f7f5f0]/95 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              className="border border-[#ded9d0] bg-white p-2 lg:hidden"
            >
              <Menu size={19} />
            </button>

            <div>
              <p className="text-sm font-medium">
                {navigation.find((item) => item.href === pathname)?.label ||
                  "Admin workspace"}
              </p>
              <p className="mt-0.5 hidden text-xs text-[#777168] sm:block">
                Verigo Essential / Administration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-[#777168] sm:inline">
              {admin.email}
            </span>
            <span className="flex h-9 w-9 items-center justify-center border border-[#ded9d0] bg-white text-xs font-semibold">
              {(admin.name || admin.email).slice(0, 2).toUpperCase()}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] p-5 sm:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/login");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0]">
      <p className="text-sm text-[#777168]">Redirecting to sign in...</p>
    </main>
  );
}
