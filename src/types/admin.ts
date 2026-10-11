export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive?: boolean;
  createdAt?: string;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminAuthData {
  admin: Admin;
}
