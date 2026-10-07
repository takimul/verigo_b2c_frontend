import api from "@/lib/api";
import type { Product } from "@/types/product";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListData {
  items: Product[];
  pagination: ProductPagination;
}

export interface GetProductsParams {
  categoryId?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getProducts(
  params?: GetProductsParams,
): Promise<ApiResponse<ProductListData>> {
  const response = await api.get<ApiResponse<ProductListData>>("/products", {
    params,
  });

  return response.data;
}

export async function getProductBySlug(
  slug: string,
): Promise<ApiResponse<Product>> {
  const response = await api.get<ApiResponse<Product>>(
    `/products/slug/${encodeURIComponent(slug)}`,
  );

  return response.data;
}
