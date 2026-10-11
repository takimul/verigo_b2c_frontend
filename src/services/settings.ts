// import api from "@/lib/api";
// import type { SiteSettings } from "@/types/settings";

// interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// export async function getPublicSettings(): Promise<ApiResponse<SiteSettings>> {
//   const response = await api.get<ApiResponse<SiteSettings>>("/settings");
//   return response.data;
// }

// export async function uploadBannerImage(
//   file: File,
// ): Promise<ApiResponse<SiteSettings>> {
//   const formData = new FormData();
//   formData.append("banner", file);

//   const response = await api.post<ApiResponse<SiteSettings>>(
//     "/settings/admin/banner",
//     formData,
//   );

//   return response.data;
// }

// export async function deleteBannerImage(): Promise<ApiResponse<SiteSettings>> {
//   const response = await api.delete<ApiResponse<SiteSettings>>(
//     "/settings/admin/banner",
//   );

//   return response.data;
// }

import api from "@/lib/api";
import type { SiteSettings } from "@/types/settings";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type UpdateSettingsPayload = Partial<
  Pick<
    SiteSettings,
    | "siteName"
    | "tagline"
    | "email"
    | "phone"
    | "whatsapp"
    | "address"
    | "facebook"
    | "instagram"
    | "linkedin"
    | "youtube"
    | "announcementText"
  >
>;

export async function getPublicSettings(): Promise<ApiResponse<SiteSettings>> {
  const response = await api.get<ApiResponse<SiteSettings>>("/settings");
  return response.data;
}

export async function getAdminSettings(): Promise<ApiResponse<SiteSettings>> {
  const response = await api.get<ApiResponse<SiteSettings>>("/settings/admin");
  return response.data;
}

export async function updateSettings(
  payload: UpdateSettingsPayload,
): Promise<ApiResponse<SiteSettings>> {
  const response = await api.patch<ApiResponse<SiteSettings>>(
    "/settings/admin",
    payload,
  );
  return response.data;
}

export async function uploadLogo(
  file: File,
): Promise<ApiResponse<SiteSettings>> {
  const formData = new FormData();
  formData.append("logo", file);

  const response = await api.post<ApiResponse<SiteSettings>>(
    "/settings/admin/logo",
    formData,
  );

  return response.data;
}

export async function deleteLogo(): Promise<ApiResponse<SiteSettings>> {
  const response = await api.delete<ApiResponse<SiteSettings>>(
    "/settings/admin/logo",
  );
  return response.data;
}

export async function uploadBannerImage(
  file: File,
): Promise<ApiResponse<SiteSettings>> {
  const formData = new FormData();
  formData.append("banner", file);

  const response = await api.post<ApiResponse<SiteSettings>>(
    "/settings/admin/banner",
    formData,
  );

  return response.data;
}

export async function deleteBannerImage(): Promise<ApiResponse<SiteSettings>> {
  const response = await api.delete<ApiResponse<SiteSettings>>(
    "/settings/admin/banner",
  );
  return response.data;
}
