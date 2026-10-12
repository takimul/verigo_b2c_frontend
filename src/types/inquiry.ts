export type InquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";
export interface InquiryProduct {
  id: string;
  name: string;
  slug: string;
  moq?: number;
  status?: string;
}
export interface Inquiry {
  id: string;
  productId: string | null;
  name: string;
  companyName: string | null;
  email: string;
  phone: string;
  country: string | null;
  quantity: number | null;
  customBranding: boolean;
  message: string | null;
  status: InquiryStatus;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt?: string;
  product:
    | (InquiryProduct & {
        images?: Array<{
          id: string;
          url: string;
          altText: string | null;
          isPrimary?: boolean;
        }>;
      })
    | null;
}
export interface InquiryInput {
  productId?: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  country?: string;
  quantity?: number;
  customBranding: boolean;
  message?: string;
}
export interface InquiryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface InquiryListData {
  items: Inquiry[];
  pagination: InquiryPagination;
}
export interface InquiryListParams {
  status?: InquiryStatus;
  productId?: string;
  search?: string;
  page?: number;
  limit?: number;
}
export interface InquiryUpdateInput {
  status?: InquiryStatus;
  adminNotes?: string | null;
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export const INQUIRY_STATUSES: { value: InquiryStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];
