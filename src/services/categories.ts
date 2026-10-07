import api from "@/lib/api";
import type { Category } from "@/types/category";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  const response = await api.get<ApiResponse<Category[]>>("/categories");

  return response.data;
}

export async function getCategoryById(
  id: string,
): Promise<ApiResponse<Category>> {
  const response = await api.get<ApiResponse<Category>>(
    `/categories/${encodeURIComponent(id)}`,
  );

  return response.data;
}
