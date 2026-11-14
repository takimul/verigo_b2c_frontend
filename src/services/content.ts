import api from "@/lib/api";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const LOCAL_STORAGE_KEY = "verigo_storefront_content_overrides";

export function getLocalContentOverrides(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

export function setLocalContentOverrides(overrides: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // ignore
  }
}

export async function fetchStorefrontContent(): Promise<Record<string, string>> {
  try {
    const res = await api.get<ApiResponse<Record<string, string>>>("/content");
    if (res.data?.data) {
      // Merge with local overrides
      const local = getLocalContentOverrides();
      const combined = { ...res.data.data, ...local };
      setLocalContentOverrides(combined);
      return combined;
    }
  } catch (err) {
    console.warn("Could not fetch remote content, using local overrides:", err);
  }
  return getLocalContentOverrides();
}

export async function updateStorefrontContent(
  key: string,
  value: string,
): Promise<Record<string, string>> {
  // Update local immediately for instantaneous feedback
  const local = getLocalContentOverrides();
  local[key] = value;
  setLocalContentOverrides(local);

  try {
    const res = await api.patch<ApiResponse<Record<string, string>>>("/content", {
      key,
      value,
    });
    if (res.data?.data) {
      const merged = { ...local, ...res.data.data };
      setLocalContentOverrides(merged);
      return merged;
    }
  } catch (err) {
    console.error("Backend content update failed, saved to local cache:", err);
  }

  return local;
}

export function clearLocalContentOverrides() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

