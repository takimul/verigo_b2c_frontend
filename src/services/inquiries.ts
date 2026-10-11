import api from "@/lib/api";
import type { ApiResponse, Inquiry, InquiryInput, InquiryListData, InquiryListParams, InquiryUpdateInput } from "@/types/inquiry";
export async function createInquiry(payload: InquiryInput) {
 const r = await api.post<ApiResponse<Inquiry>>("/inquiries", payload); return r.data;
}
export async function getInquiries(params?: InquiryListParams) {
 const r = await api.get<ApiResponse<InquiryListData>>("/inquiries", {params}); return r.data;
}
export async function getInquiryById(id: string) {
 const r = await api.get<ApiResponse<Inquiry>>(`/inquiries/${encodeURIComponent(id)}`); return r.data;
}
export async function updateInquiry(id: string, payload: InquiryUpdateInput) {
 const r = await api.patch<ApiResponse<Inquiry>>(`/inquiries/${encodeURIComponent(id)}`, payload); return r.data;
}
