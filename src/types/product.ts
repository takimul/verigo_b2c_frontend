export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type CustomizationStatus = "YES" | "NO" | "AVAILABLE_ON_REQUEST";

export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  moq: number;
  customization: CustomizationStatus;
  status: ProductStatus;
  featured: boolean;
  category: ProductCategory;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}
