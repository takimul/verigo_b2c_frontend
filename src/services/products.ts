import api from "@/lib/api";
import type { Product } from "@/types/product";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ProductListData {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  featured?: boolean;
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
