import api from "@/lib/api";
import type { Product, ProductStatus } from "@/types/product";

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

export interface GetAdminProductsParams extends GetProductsParams {
  status?: ProductStatus;
}

export interface ProductInput {
  name: string;
  slug: string;
  description?: string | null;
  categoryId: string;
  fabric?: string | null;
  gsm?: number | null;
  composition?: string | null;
  washingInfo?: string | null;
  sizes: string[];
  colors: string[];
  moq: number;
  customization: "YES" | "NO" | "AVAILABLE_ON_REQUEST";
  customFabric: boolean;
  customColor: boolean;
  customPrinting: boolean;
  customEmbroidery: boolean;
  customNeckLabel: boolean;
  customPackaging: boolean;
  isFeatured: boolean;
  status: ProductStatus;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parent?: ProductCategory | null;
}

export async function getProducts(
  params?: GetProductsParams,
): Promise<ApiResponse<ProductListData>> {
  const response = await api.get<ApiResponse<ProductListData>>("/products", {
    params,
  });
  return response.data;
}

export async function getAdminProducts(
  params?: GetAdminProductsParams,
): Promise<ApiResponse<ProductListData>> {
  const response = await api.get<ApiResponse<ProductListData>>(
    "/products/admin",
    {
      params: {
        ...params,
        featured:
          params?.featured === undefined ? undefined : String(params.featured),
      },
    },
  );
  return response.data;
}

export async function getAdminProductById(
  id: string,
): Promise<ApiResponse<Product>> {
  const response = await api.get<ApiResponse<Product>>(
    `/products/admin/${encodeURIComponent(id)}`,
  );
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

export async function createProduct(
  payload: ProductInput,
): Promise<ApiResponse<Product>> {
  const response = await api.post<ApiResponse<Product>>("/products", payload);
  return response.data;
}

export async function updateProduct(
  id: string,
  payload: Partial<ProductInput>,
): Promise<ApiResponse<Product>> {
  const productId = id.trim();

  if (!productId) {
    throw new Error("Product ID is required to update a product.");
  }

  try {
    const response = await api.patch<ApiResponse<Product>>(
      `/products/${encodeURIComponent(productId)}`,
      payload,
    );

    return response.data;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to update product. Please try again.");
  }
}

export async function archiveProduct(
  id: string,
): Promise<ApiResponse<Product>> {
  const response = await api.delete<ApiResponse<Product>>(
    `/products/${encodeURIComponent(id)}`,
  );
  return response.data;
}

export async function uploadProductImage(
  productId: string,
  file: File,
): Promise<ApiResponse<Product["images"][number]>> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<ApiResponse<Product["images"][number]>>(
    `/products/${encodeURIComponent(productId)}/images`,
    formData,
  );

  return response.data;
}

export async function deleteProductImage(
  productId: string,
  imageId: string,
): Promise<ApiResponse<unknown>> {
  const response = await api.delete<ApiResponse<unknown>>(
    `/products/${encodeURIComponent(productId)}/images/${encodeURIComponent(imageId)}`,
  );
  return response.data;
}

export async function setPrimaryProductImage(
  productId: string,
  imageId: string,
): Promise<ApiResponse<unknown>> {
  const response = await api.patch<ApiResponse<unknown>>(
    `/products/${encodeURIComponent(productId)}/images/${encodeURIComponent(imageId)}/primary`,
  );
  return response.data;
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  const response = await api.get("/categories");
  const body = response.data;

  // Supports the common { data: [...] } and { data: { items: [...] } } shapes.
  const result = body?.data ?? body;
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.items)) return result.items;
  if (Array.isArray(result?.categories)) return result.categories;

  return [];
}
