"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentAdmin,
  loginAdmin as loginAdminRequest,
  logoutAdmin as logoutAdminRequest,
} from "@/services/admin/auth";
import type { Admin, AdminLoginPayload } from "@/types/admin";

interface AdminAuthContextValue {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: AdminLoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(
  undefined,
);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAdmin = useCallback(async () => {
    setIsLoading(true);

    try {
      const currentAdmin = await getCurrentAdmin();
      setAdmin(currentAdmin);
    } catch {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAdmin();
  }, [refreshAdmin]);

  const login = async (payload: AdminLoginPayload) => {
    const loggedInAdmin = await loginAdminRequest(payload);

    setAdmin(loggedInAdmin);
    router.replace("/admin/dashboard");
    router.refresh();
  };

  const logout = async () => {
    try {
      await logoutAdminRequest();
      setAdmin(null);
      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      // Keep the current UI state if the server could not log out.
      throw error;
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: Boolean(admin),
        login,
        logout,
        refreshAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }

  return context;
}
