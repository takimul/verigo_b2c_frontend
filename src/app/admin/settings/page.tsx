"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  Globe,
  ImagePlus,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings2,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import AdminShell from "@/components/admin/AdminShell";
import {
  deleteBannerImage,
  deleteLogo,
  getAdminSettings,
  updateSettings,
  uploadBannerImage,
  uploadLogo,
  type UpdateSettingsPayload,
} from "@/services/settings";
import type { SiteSettings } from "@/types/settings";
import { FaInstagram } from "react-icons/fa6";

type EditableSettings = {
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  announcementText: string;
};

const emptyForm: EditableSettings = {
  siteName: "",
  tagline: "",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  announcementText: "",
};

type ConfirmAction = "logo" | "banner" | null;

const inputClass =
  "mt-2 w-full border border-[#ded9d0] bg-white px-4 py-3 text-sm text-[#171717] outline-none transition placeholder:text-[#a09a90] focus:border-[#171717] focus:ring-1 focus:ring-[#171717]";

const labelClass =
  "block text-xs font-semibold uppercase tracking-[0.13em] text-[#5d5952]";

function toEditableSettings(settings: SiteSettings): EditableSettings {
  return {
    siteName: settings.siteName ?? "",
    tagline: settings.tagline ?? "",
    email: settings.email ?? "",
    phone: settings.phone ?? "",
    whatsapp: settings.whatsapp ?? "",
    address: settings.address ?? "",
    facebook: settings.facebook ?? "",
    instagram: settings.instagram ?? "",
    linkedin: settings.linkedin ?? "",
    youtube: settings.youtube ?? "",
    announcementText: settings.announcementText ?? "",
  };
}

function SectionCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border border-[#e5e0d7] bg-white">
      <div className="flex items-start gap-3 border-b border-[#eae6df] px-5 py-5 sm:px-7">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#f5f2ec] text-[#242424]">
          {icon}
        </div>
        <div>
          <h2 className="text-base font-semibold text-[#171717]">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-[#777168]">{description}</p>
        </div>
      </div>
      <div className="space-y-5 p-5 sm:p-7">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className={labelClass}>{label}</span>
      <input
        className={inputClass}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {hint && (
        <span className="mt-2 block text-xs text-[#8a847b]">{hint}</span>
      )}
    </label>
  );
}

function ImageManager({
  title,
  description,
  imageUrl,
  kind,
  busy,
  onUpload,
  onDelete,
}: {
  title: string;
  description: string;
  imageUrl: string | null;
  kind: "logo" | "banner";
  busy: boolean;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be 5 MB or less.");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      await onUpload(file);
      setPreviewUrl(null);
    } catch {
      setPreviewUrl(null);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      URL.revokeObjectURL(localPreview);
    }
  };

  const shownImage = previewUrl || imageUrl;

  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(180px,0.9fr)]">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-[#171717]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#777168]">{description}</p>
        <p className="mt-3 text-xs text-[#8a847b]">
          JPG, PNG, WebP · Maximum 5 MB
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 bg-[#171717] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {imageUrl ? "Replace image" : "Upload image"}
          </button>

          {imageUrl && (
            <button
              type="button"
              disabled={busy}
              onClick={onDelete}
              className="inline-flex items-center justify-center gap-2 border border-[#ded9d0] px-4 py-3 text-sm text-[#5e554d] transition hover:border-red-300 hover:text-red-700 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div
        className={`relative flex min-h-36 items-center justify-center overflow-hidden border border-dashed border-[#ded9d0] bg-[#f8f6f1] ${
          kind === "banner" ? "aspect-16/7" : "aspect-5/3"
        }`}
      >
        {shownImage ? (
          <Image
            src={shownImage}
            alt={`${title} preview`}
            fill
            unoptimized={shownImage.startsWith("blob:")}
            sizes="(max-width: 640px) 100vw, 400px"
            className={kind === "logo" ? "object-contain p-6" : "object-cover"}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-center text-[#9b9489]">
            <ImagePlus className="h-7 w-7" />
            <span className="text-xs">No image uploaded</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ConfirmDialog({
  title,
  description,
  busy,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md border border-[#e5e0d7] bg-[#faf9f6] p-6 shadow-2xl sm:p-8"
      >
        <div className="flex h-11 w-11 items-center justify-center bg-[#f0e6e2] text-[#8e3c32]">
          <Trash2 className="h-5 w-5" />
        </div>
        <h2 id="confirm-title" className="mt-5 text-xl font-semibold">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#777168]">{description}</p>
        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="border border-[#ded9d0] px-4 py-3 text-sm hover:bg-[#f0ede7] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="inline-flex items-center gap-2 bg-[#171717] px-4 py-3 text-sm text-white hover:bg-[#383838] disabled:opacity-50"
          >
            {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Remove image
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState<EditableSettings>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [busyImage, setBusyImage] = useState<"logo" | "banner" | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getAdminSettings();
      setSettings(response.data);
      setForm(toEditableSettings(response.data));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load site settings.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const setField = (key: keyof EditableSettings, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.siteName.trim()) {
      toast.error("Site name is required.");
      return;
    }

    setIsSaving(true);

    try {
      const payload: UpdateSettingsPayload = {
        ...form,
        siteName: form.siteName.trim(),
        tagline: form.tagline.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim(),
        address: form.address.trim(),
        facebook: form.facebook.trim(),
        instagram: form.instagram.trim(),
        linkedin: form.linkedin.trim(),
        youtube: form.youtube.trim(),
        announcementText: form.announcementText.trim(),
      };

      const response = await updateSettings(payload);
      setSettings(response.data);
      setForm(toEditableSettings(response.data));
      toast.success(response.message || "Site settings saved.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save settings.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (kind: "logo" | "banner", file: File) => {
    setBusyImage(kind);

    try {
      const response =
        kind === "logo"
          ? await uploadLogo(file)
          : await uploadBannerImage(file);

      setSettings(response.data);
      toast.success(
        response.message ||
          `${kind === "logo" ? "Logo" : "Banner"} uploaded successfully.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : `Could not upload ${kind}.`,
      );
      throw error;
    } finally {
      setBusyImage(null);
    }
  };

  const handleDeleteImage = async () => {
    if (!confirmAction) return;

    setIsDeleting(true);

    try {
      const response =
        confirmAction === "logo"
          ? await deleteLogo()
          : await deleteBannerImage();

      setSettings(response.data);
      setConfirmAction(null);
      toast.success(response.message || "Image removed successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not remove image.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4">
        <LoaderCircle className="h-7 w-7 animate-spin text-[#6f6b64]" />
        <p className="text-sm text-[#777168]">Loading site settings...</p>
      </div>
    );
  }

  return (
    <>
      {confirmAction && (
        <ConfirmDialog
          title={`Remove ${confirmAction === "logo" ? "site logo" : "homepage banner"}?`}
          description="This removes the currently uploaded image from your site. You can upload a replacement at any time."
          busy={isDeleting}
          onCancel={() => setConfirmAction(null)}
          onConfirm={() => void handleDeleteImage()}
        />
      )}

      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-[#e1dcd3] pb-7 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#827b70]">
              <Settings2 className="h-4 w-4" />
              Store configuration
            </div>
            <h1 className="font-serif text-3xl tracking-tight text-[#171717] sm:text-4xl">
              Site settings
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#777168]">
              Manage your brand identity, storefront contact details, and
              homepage visuals in one place.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#777168]">
            <ShieldCheck className="h-4 w-4" />
            Admin access only
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <SectionCard
            title="Brand identity"
            description="The name and tagline displayed across your storefront."
            icon={<Globe className="h-5 w-5" />}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Site name"
                value={form.siteName}
                onChange={(value) => setField("siteName", value)}
                placeholder="Verigo Essential"
              />
              <Field
                label="Tagline"
                value={form.tagline}
                onChange={(value) => setField("tagline", value)}
                placeholder="Premium Apparel & Authentic Beauty"
              />
            </div>

            <div className="border-t border-[#eeeae3] pt-5">
              <ImageManager
                title="Brand logo"
                description="Upload your logo for the storefront header. A transparent PNG or WebP works well."
                imageUrl={settings?.logoUrl ?? null}
                kind="logo"
                busy={busyImage === "logo"}
                onUpload={(file) => handleUpload("logo", file)}
                onDelete={() => setConfirmAction("logo")}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Homepage banner"
            description="Choose the main visual shown in the storefront hero section."
            icon={<ImagePlus className="h-5 w-5" />}
          >
            <ImageManager
              title="Hero banner image"
              description="Use a high-quality landscape apparel or fashion image. Keep important subjects near the center so the image crops well on mobile."
              imageUrl={settings?.bannerImageUrl ?? null}
              kind="banner"
              busy={busyImage === "banner"}
              onUpload={(file) => handleUpload("banner", file)}
              onDelete={() => setConfirmAction("banner")}
            />
          </SectionCard>

          <SectionCard
            title="Announcement bar"
            description="A short message displayed near the top of the storefront."
            icon={<ArrowUpRight className="h-5 w-5" />}
          >
            <label className="block">
              <span className={labelClass}>Announcement message</span>
              <textarea
                rows={3}
                maxLength={250}
                className={`${inputClass} resize-y`}
                value={form.announcementText}
                onChange={(event) =>
                  setField("announcementText", event.target.value)
                }
                placeholder="Wholesale partnerships now open. Contact us for OEM/ODM orders."
              />
              <span className="mt-2 block text-right text-xs text-[#8a847b]">
                {form.announcementText.length}/250
              </span>
            </label>

            {form.announcementText.trim() && (
              <div className="border border-[#e5e0d7] bg-[#f8f6f1] px-4 py-3 text-center text-xs tracking-wide text-[#514c45]">
                {form.announcementText}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Contact information"
            description="How wholesale buyers and business partners can reach you."
            icon={<Phone className="h-5 w-5" />}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Business email"
                type="email"
                value={form.email}
                onChange={(value) => setField("email", value)}
                placeholder="sales@example.com"
              />
              <Field
                label="Phone number"
                value={form.phone}
                onChange={(value) => setField("phone", value)}
                placeholder="+880..."
              />
              <Field
                label="WhatsApp number or link"
                value={form.whatsapp}
                onChange={(value) => setField("whatsapp", value)}
                placeholder="+880... or https://wa.me/..."
              />
              <Field
                label="Business address"
                value={form.address}
                onChange={(value) => setField("address", value)}
                placeholder="Your business address"
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Social media"
            description="Add the public profiles linked from your storefront."
            icon={<FaInstagram className="h-5 w-5" />}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Facebook URL"
                value={form.facebook}
                onChange={(value) => setField("facebook", value)}
                placeholder="https://facebook.com/..."
              />
              <Field
                label="Instagram URL"
                value={form.instagram}
                onChange={(value) => setField("instagram", value)}
                placeholder="https://instagram.com/..."
              />
              <Field
                label="LinkedIn URL"
                value={form.linkedin}
                onChange={(value) => setField("linkedin", value)}
                placeholder="https://linkedin.com/..."
              />
              <Field
                label="YouTube URL"
                value={form.youtube}
                onChange={(value) => setField("youtube", value)}
                placeholder="https://youtube.com/..."
              />
            </div>
          </SectionCard>

          <div className="sticky bottom-3 z-20 flex flex-col justify-between gap-3 border border-[#ded9d0] bg-[#faf9f6]/95 p-4 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:px-6">
            <p className="text-xs leading-5 text-[#777168]">
              Save your changes to update the stored site configuration.
            </p>
            <button
              type="submit"
              disabled={isSaving || busyImage !== null || isDeleting}
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#171717] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Saving changes..." : "Save settings"}
              {!isSaving && <Check className="h-4 w-4" />}
            </button>
          </div>
        </form>

        <div className="mt-8 flex items-start gap-3 border border-[#e5e0d7] bg-[#f4f1ea] p-4">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#71695e]" />
          <p className="text-xs leading-5 text-[#71695e]">
            Changes are saved to your backend. If a field is not appearing on
            the public website, confirm that the corresponding frontend
            component reads that setting from the public settings endpoint.
          </p>
          <MapPin className="hidden h-4 w-4 shrink-0 text-[#71695e] sm:block" />
        </div>
      </div>
    </>
  );
}
