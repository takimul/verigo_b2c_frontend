import api from "@/lib/api";

export interface HomepageImage {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface HomepageCategoryChild {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
}

export interface HomepageCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  children: HomepageCategoryChild[];
}

export interface HomepageProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  fabric: string | null;
  gsm: number | null;
  composition: string | null;
  moq: number;
  customization: "YES" | "NO" | "AVAILABLE_ON_REQUEST";
  customFabric?: boolean;
  customColor?: boolean;
  customPrinting?: boolean;
  customEmbroidery?: boolean;
  customNeckLabel?: boolean;
  customPackaging?: boolean;
  images: HomepageImage[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface HomepageData {
  featuredProducts: HomepageProduct[];
  categories: HomepageCategory[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getHomepage(): Promise<ApiResponse<HomepageData>> {
  const response = await api.get<ApiResponse<HomepageData>>("/homepage");

  return response.data;
}
