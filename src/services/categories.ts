import api from "@/lib/api";
import type { Category } from "@/types/category";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string | null;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
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

export async function createCategory(
  payload: CategoryInput,
): Promise<ApiResponse<Category>> {
  const response = await api.post<ApiResponse<Category>>(
    "/categories",
    payload,
  );
  return response.data;
}

export async function updateCategory(
  id: string,
  payload: Partial<CategoryInput>,
): Promise<ApiResponse<Category>> {
  const response = await api.patch<ApiResponse<Category>>(
    `/categories/${encodeURIComponent(id)}`,
    payload,
  );
  return response.data;
}

export async function deleteCategory(
  id: string,
): Promise<ApiResponse<unknown>> {
  const response = await api.delete<ApiResponse<unknown>>(
    `/categories/${encodeURIComponent(id)}`,
  );
  return response.data;
}

export async function uploadCategoryImage(
  id: string,
  file: File,
): Promise<ApiResponse<Category>> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<ApiResponse<Category>>(
    `/categories/${encodeURIComponent(id)}/image`,
    formData,
  );

  return response.data;
}

export async function deleteCategoryImage(
  id: string,
): Promise<ApiResponse<Category>> {
  const response = await api.delete<ApiResponse<Category>>(
    `/categories/${encodeURIComponent(id)}/image`,
  );

  return response.data;
}
