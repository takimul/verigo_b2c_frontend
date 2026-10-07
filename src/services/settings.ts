import api from "@/lib/api";
import type { SiteSettings } from "@/types/settings";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getPublicSettings(): Promise<ApiResponse<SiteSettings>> {
  const response = await api.get<ApiResponse<SiteSettings>>("/settings");

  return response.data;
}
