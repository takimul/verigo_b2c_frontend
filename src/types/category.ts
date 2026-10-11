export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  parent?: Category | null;
  children?: Category[];
  isActive: boolean;
  sortOrder?: number;
  _count?: {
    products?: number;
    children?: number;
  };
  createdAt: string;
  updatedAt: string;
}
