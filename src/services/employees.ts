import api from "@/lib/api";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface EmployeeProfile {
  name: string;
  role: string;
  bio: string;
  email: string;
  phone: string;
  linkedin: string;
  credentials: string[];
  imageUrl: string | null;
  imagePublicId?: string | null;
}

export const DEFAULT_EMPLOYEE_PROFILE: EmployeeProfile = {
  name: "Md. Managing Director",
  role: "Founder & Head of Global Sourcing",
  bio: "With over a decade of hands-on experience across Bangladesh's premier apparel manufacturing units, I founded Verigo Essential to give global brands direct, transparent, and uncompromising access to quality garment production. We operate with zero intermediaries—giving your brand direct factory pricing, stringent multi-point quality audits, and clear, transparent timelines from sample development to final shipment.",
  email: "verigoessential@gmail.com",
  phone: "+880 1918-243120",
  linkedin: "https://linkedin.com",
  credentials: [
    "12+ Years Garment Industry Experience",
    "Direct Factory Partnerships Across Dhaka & Chittagong",
    "100% Pre-Shipment Quality Audits",
    "Full Compliance & Ethical Standards",
  ],
  imageUrl: null,
  imagePublicId: null,
};

export async function getEmployeeProfile(): Promise<EmployeeProfile> {
  try {
    const res = await api.get<ApiResponse<EmployeeProfile>>("/employees");
    if (res.data?.data) {
      return res.data.data;
    }
  } catch {
    // Fallback to /about to fetch imageUrl if available
    try {
      const aboutRes = await api.get<ApiResponse<{ imageUrl?: string }>>("/about");
      if (aboutRes.data?.data?.imageUrl) {
        return {
          ...DEFAULT_EMPLOYEE_PROFILE,
          imageUrl: aboutRes.data.data.imageUrl,
        };
      }
    } catch {
      // ignore
    }
  }

  return DEFAULT_EMPLOYEE_PROFILE;
}

export async function updateEmployeeProfile(
  payload: Partial<EmployeeProfile>,
): Promise<EmployeeProfile> {
  try {
    const res = await api.patch<ApiResponse<EmployeeProfile>>(
      "/employees",
      payload,
    );
    if (res.data?.data) {
      return res.data.data;
    }
  } catch (err) {
    console.warn("Could not patch /employees, falling back:", err);
  }

  return {
    ...DEFAULT_EMPLOYEE_PROFILE,
    ...payload,
  };
}

export async function uploadEmployeeImage(
  file: File,
): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append("image", file);

  // Try /employees/image first, fallback to /about/admin/image
  try {
    const res = await api.post<ApiResponse<EmployeeProfile>>(
      "/employees/image",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    if (res.data?.data?.imageUrl) {
      return { imageUrl: res.data.data.imageUrl };
    }
  } catch {
    const res = await api.post<ApiResponse<{ imageUrl: string }>>(
      "/about/admin/image",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return { imageUrl: res.data.data.imageUrl };
  }

  throw new Error("Failed to upload employee image");
}

export async function deleteEmployeeImage(): Promise<void> {
  try {
    await api.delete("/employees/image");
  } catch {
    await api.delete("/about/admin/image");
  }
}

