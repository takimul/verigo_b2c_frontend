"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAdminAuth } from "./AdminAuthContext";
import {
  fetchStorefrontContent,
  getLocalContentOverrides,
  updateStorefrontContent,
  setLocalContentOverrides,
} from "@/services/content";
import { toast } from "sonner";

interface LiveEditContextType {
  isSuperAdmin: boolean;
  isEditMode: boolean;
  toggleEditMode: () => void;
  getContent: (key: string, fallback: string) => string;
  updateContentValue: (key: string, value: string) => Promise<void>;
  resetContentValue: (key: string) => void;
  content: Record<string, string>;
  isLoading: boolean;
}

const LiveEditContext = createContext<LiveEditContextType | undefined>(undefined);

export function LiveEditProvider({ children }: { children: ReactNode }) {
  const { admin } = useAdminAuth();
  const isSuperAdmin = admin?.role === "SUPER_ADMIN";

  const [isEditMode, setIsEditMode] = useState(true);
  const [content, setContent] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load content on mount
  useEffect(() => {
    // initialize from local storage first for instant load
    setContent(getLocalContentOverrides());

    let mounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const remote = await fetchStorefrontContent();
        if (mounted) {
          setContent(remote);
        }
      } catch (err) {
        console.warn("Failed to load storefront content", err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);

  const getContent = useCallback(
    (key: string, fallback: string) => {
      if (content[key] !== undefined && content[key] !== "") {
        return content[key];
      }
      return fallback;
    },
    [content],
  );

  const updateContentValue = useCallback(
    async (key: string, value: string) => {
      setContent((prev) => ({ ...prev, [key]: value }));
      try {
        const updated = await updateStorefrontContent(key, value);
        setContent(updated);
        toast.success("Text saved successfully!");
      } catch (err) {
        toast.error("Failed to save to backend, saved locally.");
      }
    },
    [],
  );

  const resetContentValue = useCallback(
    (key: string) => {
      setContent((prev) => {
        const next = { ...prev };
        delete next[key];
        setLocalContentOverrides(next);
        return next;
      });
      toast.success("Reset to default text.");
    },
    [],
  );

  return (
    <LiveEditContext.Provider
      value={{
        isSuperAdmin,
        isEditMode: isSuperAdmin && isEditMode,
        toggleEditMode,
        getContent,
        updateContentValue,
        resetContentValue,
        content,
        isLoading,
      }}
    >
      {children}
    </LiveEditContext.Provider>
  );
}

export function useLiveEdit() {
  const context = useContext(LiveEditContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      isSuperAdmin: false,
      isEditMode: false,
      toggleEditMode: () => {},
      getContent: (_key: string, fallback: string) => fallback,
      updateContentValue: async () => {},
      resetContentValue: () => {},
      content: {},
      isLoading: false,
    };
  }
  return context;
}

