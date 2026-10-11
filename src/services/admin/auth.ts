import api from "@/lib/api";
import type {
  Admin,
  AdminAuthData,
  AdminLoginPayload,
  ApiResponse,
} from "@/types/admin";

export async function loginAdmin(payload: AdminLoginPayload): Promise<Admin> {
  const response = await api.post<ApiResponse<AdminAuthData>>(
    "/admin/auth/login",
    payload,
  );

  return response.data.data.admin;
}

export async function getCurrentAdmin(): Promise<Admin> {
  const response = await api.get<ApiResponse<AdminAuthData>>("/admin/auth/me");

  return response.data.data.admin;
}

export async function logoutAdmin(): Promise<void> {
  await api.post("/admin/auth/logout");
}
