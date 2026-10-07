export interface SiteSettings {
  id: string;
  siteName: string;
  tagline: string;
  logoUrl: string | null;

  bannerImageUrl: string | null;

  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;

  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;

  announcementText: string | null;
  updatedAt: string;
}
