export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type CustomizationStatus = "YES" | "NO" | "AVAILABLE_ON_REQUEST";

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
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

  status: ProductStatus;

  fabric: string | null;
  gsm: number | null;
  composition: string | null;
  washingInfo: string | null;

  sizes: string[];
  colors: string[];

  moq: number;

  customization: CustomizationStatus;

  customFabric: boolean;
  customColor: boolean;
  customPrinting: boolean;
  customEmbroidery: boolean;
  customNeckLabel: boolean;
  customPackaging: boolean;

  isFeatured: boolean;

  category: ProductCategory;

  images: ProductImage[];

  createdAt: string;
  updatedAt: string;
}
