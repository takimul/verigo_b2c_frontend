"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Mail,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import InlineEditable from "@/components/ui/InlineEditable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useLiveEdit } from "@/context/LiveEditContext";
import {
  DEFAULT_EMPLOYEE_PROFILE,
  deleteEmployeeImage,
  getEmployeeProfile,
  uploadEmployeeImage,
  type EmployeeProfile,
} from "@/services/employees";

/**
 * Trims transparent and white empty margins from any image URL
 * ensuring the person fills the desired frame regardless of upload aspect ratio.
 */
function autoTrimImage(src: string): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(src);
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(src);

        ctx.drawImage(img, 0, 0);
        const { width, height } = canvas;
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        let minX = width;
        let maxX = 0;
        let minY = height;
        let maxY = 0;
        let hasSubject = false;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const alpha = data[idx + 3];
            const isWhite =
              data[idx] > 245 && data[idx + 1] > 245 && data[idx + 2] > 245;

            if (alpha > 15 && !isWhite) {
              hasSubject = true;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        if (
          !hasSubject ||
          (minX <= 5 && maxX >= width - 6 && minY <= 5 && maxY >= height - 6)
        ) {
          return resolve(src);
        }

        // Add 1% safety padding
        const padX = Math.round((maxX - minX) * 0.015);
        const padY = Math.round((maxY - minY) * 0.015);
        minX = Math.max(0, minX - padX);
        maxX = Math.min(width - 1, maxX + padX);
        minY = Math.max(0, minY - padY);
        maxY = Math.min(height - 1, maxY + padY);

        const trimW = maxX - minX + 1;
        const trimH = maxY - minY + 1;

        const trimCanvas = document.createElement("canvas");
        trimCanvas.width = trimW;
        trimCanvas.height = trimH;
        const trimCtx = trimCanvas.getContext("2d");
        if (!trimCtx) return resolve(src);

        trimCtx.drawImage(canvas, minX, minY, trimW, trimH, 0, 0, trimW, trimH);
        resolve(trimCanvas.toDataURL("image/png"));
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

/**
 * Trims transparent and white margins from a selected File before upload.
 */
function trimFileBeforeUpload(file: File): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return resolve(file);
      try {
        const trimmedDataUrl = await autoTrimImage(dataUrl);
        if (trimmedDataUrl === dataUrl) return resolve(file);

        const res = await fetch(trimmedDataUrl);
        const blob = await res.blob();
        const trimmedFile = new File(
          [blob],
          file.name.replace(/\.[^.]+$/, ".png"),
          {
            type: "image/png",
          },
        );
        resolve(trimmedFile);
      } catch {
        resolve(file);
      }
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export default function EmployeeSection() {
  const { isSuperAdmin, isEditMode, getContent } = useLiveEdit();
  const [profile, setProfile] = useState<EmployeeProfile>(DEFAULT_EMPLOYEE_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [trimmedSrc, setTrimmedSrc] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        const data = await getEmployeeProfile();
        if (mounted && data) {
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to load employee profile:", err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  // Clean up legacy hardcoded badge if present in local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("verigo_storefront_content_overrides");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.about_employee_badge === "FOUNDER & MANAGING DIRECTOR") {
            delete parsed.about_employee_badge;
            localStorage.setItem(
              "verigo_storefront_content_overrides",
              JSON.stringify(parsed),
            );
          }
        }
      } catch {}
    }
  }, []);

  const rawBadge = getContent("about_employee_badge", profile.badge ?? "");
  const badgeValue =
    rawBadge === "FOUNDER & MANAGING DIRECTOR"
      ? (profile.badge ?? "")
      : (profile.badge ?? rawBadge);

  // When no image exists in backend, imageSource is null (shows black/white avatar, not sample photo)
  const imageSource = profile.imageUrl?.trim() || null;

  // Auto-trim wide margins on load so the portrait fills the frame perfectly
  useEffect(() => {
    let active = true;
    if (imageSource) {
      autoTrimImage(imageSource).then((trimmed) => {
        if (active) setTrimmedSrc(trimmed);
      });
    } else {
      setTrimmedSrc(null);
    }
    return () => {
      active = false;
    };
  }, [imageSource]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;

    if (!originalFile.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPEG, PNG, WEBP).");
      return;
    }

    try {
      setUploading(true);
      // Auto-trim empty margins before uploading so Cloudinary stores the clean subject
      const file = await trimFileBeforeUpload(originalFile);
      const res = await uploadEmployeeImage(file);
      setProfile((prev) => ({
        ...prev,
        imageUrl: res.imageUrl,
      }));
      toast.success("Leadership photo updated successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleConfirmRemove = async () => {
    try {
      setIsDeleting(true);
      await deleteEmployeeImage();
      setProfile((prev) => ({
        ...prev,
        imageUrl: null,
      }));
      setTrimmedSrc(null);
      toast.success("Photo removed successfully.");
    } catch (err) {
      console.error("Failed to delete photo:", err);
      toast.error("Failed to remove photo.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const cleanPhone = profile.phone.replace(/[^\d+]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone.replace(/\D/g, "")}`;

  const currentDisplaySrc = trimmedSrc || imageSource;
  const isCutout =
    Boolean(currentDisplaySrc) &&
    (currentDisplaySrc!.startsWith("data:image/png") ||
      currentDisplaySrc!.endsWith(".png") ||
      currentDisplaySrc!.endsWith(".webp") ||
      currentDisplaySrc!.includes("cutout"));

  return (
    <>
      <section className="relative border-b border-neutral-200 bg-[#fbf9f5] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Eyebrow & Title */}
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-500">
              <InlineEditable
                contentKey="about_employee_section_badge"
                defaultValue="LEADERSHIP & EXPERTISE"
              />
            </p>

            <InlineEditable
              contentKey="about_employee_section_title"
              defaultValue="The leadership driving your production."
              as="h2"
              className="mt-3 font-serif text-3xl font-normal tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl"
            />

            <InlineEditable
              contentKey="about_employee_section_desc"
              defaultValue="Direct founder oversight on every factory partnership, sample iteration, and export shipment from Bangladesh."
              as="p"
              multiline
              className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8"
            />
          </div>

          {/* Refined Luxury Editorial Card */}
          <div className="mt-12 rounded-sm border border-neutral-200/90 bg-white/90 p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] backdrop-blur-xs sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
              {/* Left Column: Out-Of-The-Frame 3D Styled Portrait */}
              <div className="relative flex flex-col items-center justify-center pt-8 pb-4">
                <div className="group/frame relative w-full max-w-[320px] sm:max-w-[350px]">
                  {/* 1. Background Frame (starts lower at top-16/top-20, so person's head pops out) */}
                  <div className="absolute inset-x-2 sm:inset-x-3 bottom-0 top-16 sm:top-20 rounded-2xl border border-[#d8d2c5] bg-gradient-to-b from-[#f3efe8] via-[#ebe5da] to-[#dfd7ca] shadow-[0_20px_45px_-15px_rgba(0,0,0,0.14),0_6px_16px_rgba(0,0,0,0.06)] ring-1 ring-inset ring-white/60 transition-transform duration-500 group-hover/frame:scale-[1.01]" />

                  {/* 2. The Person Image / Skeleton / Black & White Avatar */}
                  <div className="relative z-10 flex h-[390px] sm:h-[430px] w-full items-end justify-center overflow-visible">
                    {isLoading ? (
                      /* Structured Skeleton Avatar while loading */
                      <div className="flex h-full w-full flex-col items-center justify-end pb-3 animate-pulse">
                        <div className="h-20 w-20 rounded-full bg-neutral-300/80 mb-3" />
                        <div className="h-4 w-9 rounded-xs bg-neutral-300/60 mb-2" />
                        <div className="h-48 w-56 rounded-t-3xl bg-neutral-200/90" />
                      </div>
                    ) : currentDisplaySrc ? (
                      /* Actual Uploaded Portrait Image */
                      <img
                        src={currentDisplaySrc}
                        alt={profile.name}
                        className="h-full w-auto max-h-[430px] shrink-0 object-contain object-bottom transition-transform duration-500 group-hover/frame:scale-[1.03] group-hover/frame:-translate-y-1 drop-shadow-[0_16px_24px_rgba(0,0,0,0.22)]"
                        style={{
                          mixBlendMode: isCutout ? "normal" : "multiply",
                        }}
                      />
                    ) : (
                      /* Black & White Executive Silhouette Avatar (shown when no image in backend) */
                      <div className="relative flex h-full w-full flex-col items-center justify-end">
                        <svg
                          viewBox="0 0 240 340"
                          className="h-full w-auto max-h-[430px] shrink-0 object-contain object-bottom drop-shadow-[0_16px_24px_rgba(0,0,0,0.18)] transition-transform duration-500 group-hover/frame:scale-[1.03] group-hover/frame:-translate-y-1"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-label="Executive leadership silhouette"
                        >
                          <defs>
                            <linearGradient
                              id="avatarShade"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#2c2a29" />
                              <stop offset="100%" stopColor="#141414" />
                            </linearGradient>
                            <linearGradient
                              id="suitCollar"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#ffffff" />
                              <stop offset="100%" stopColor="#f0ede6" />
                            </linearGradient>
                          </defs>

                          {/* Shoulders / Suit Torso */}
                          <path
                            d="M20 340 C20 250, 45 200, 75 175 L95 185 L95 240 L145 240 L145 185 L165 175 C195 200, 220 250, 220 340 Z"
                            fill="url(#avatarShade)"
                          />

                          {/* Lapels / Suit Jacket opening */}
                          <path
                            d="M75 175 L110 270 L120 340 L130 270 L165 175 L145 185 L120 250 L95 185 Z"
                            fill="#1a1918"
                            stroke="#3d3a37"
                            strokeWidth="1.5"
                          />

                          {/* Shirt & Collar */}
                          <path
                            d="M98 175 L120 215 L142 175 L135 155 L105 155 Z"
                            fill="url(#suitCollar)"
                          />

                          {/* Tie */}
                          <path
                            d="M116 195 L124 195 L127 275 L120 290 L113 275 Z"
                            fill="#111111"
                          />

                          {/* Neck */}
                          <path
                            d="M106 135 L106 165 C106 172, 134 172, 134 165 L134 135 Z"
                            fill="#e5dfd5"
                          />

                          {/* Head & Hair Silhouette */}
                          <ellipse
                            cx="120"
                            cy="100"
                            rx="36"
                            ry="46"
                            fill="#e5dfd5"
                          />
                          <path
                            d="M84 95 C82 60, 100 45, 120 45 C140 45, 158 60, 156 95 C156 80, 148 65, 138 65 C125 65, 115 75, 102 75 C94 75, 88 85, 84 95 Z"
                            fill="#1d1b1a"
                          />
                          {/* Ears */}
                          <ellipse
                            cx="84"
                            cy="102"
                            rx="4"
                            ry="8"
                            fill="#d9d2c6"
                          />
                          <ellipse
                            cx="156"
                            cy="102"
                            rx="4"
                            ry="8"
                            fill="#d9d2c6"
                          />
                        </svg>

                        {/* Prompt for Admin when no image uploaded */}
                        {(isSuperAdmin || isEditMode) && (
                          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center text-center bg-black/60 p-3 rounded-lg backdrop-blur-xs">
                            <span className="text-xs font-semibold text-white">
                              No portrait uploaded
                            </span>
                            <span className="text-[10px] text-neutral-300 mt-0.5">
                              Hover below to upload photo
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Super Admin / Live Edit Photo Controls */}
                    {(isSuperAdmin || isEditMode) && (
                      <div className="absolute inset-x-4 bottom-8 z-30 flex flex-col items-center justify-center gap-2 rounded-lg bg-black/75 p-3 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover/frame:opacity-100">
                        <button
                          type="button"
                          disabled={uploading}
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 rounded-xs bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-100 disabled:opacity-50"
                        >
                          <Camera size={13} />
                          {uploading
                            ? "Uploading..."
                            : profile.imageUrl
                              ? "Change Photo"
                              : "Upload Photo"}
                        </button>

                        {profile.imageUrl && (
                          <button
                            type="button"
                            disabled={uploading}
                            onClick={() => setShowDeleteConfirm(true)}
                            className="inline-flex items-center gap-1.5 rounded-xs bg-red-600 px-2.5 py-1 text-[11px] font-medium text-white transition hover:bg-red-700"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        )}
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* 3. Floating Available Status Badge at base */}
                  <div className="relative -mt-3 sm:-mt-4 z-20 flex justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300/80 bg-white/95 px-4 py-1.5 text-[11px] font-medium text-neutral-800 shadow-[0_6px_16px_rgba(0,0,0,0.08)] backdrop-blur-md">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Available for Brand Inquiries</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Bio, Credentials & Direct Contacts */}
              <div className="flex flex-col justify-between">
                <div>
                  <InlineEditable
                    contentKey="about_employee_badge"
                    defaultValue={badgeValue}
                    allowEmpty
                    placeholder="+ Add eyebrow badge (optional)"
                    as="p"
                    className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500 mb-1"
                  />

                  <h3 className="mt-2 font-serif text-3xl font-normal tracking-tight text-neutral-950 sm:text-4xl">
                    <InlineEditable
                      contentKey="about_employee_name"
                      defaultValue={profile.name}
                    />
                  </h3>

                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#6f6b64]">
                    <InlineEditable
                      contentKey="about_employee_role"
                      defaultValue={profile.role}
                    />
                  </p>

                  {/* Bio Quote / Statement with Luxury Accent Line */}
                  <div className="relative mt-6 border-l-2 border-neutral-900 pl-5 text-sm leading-7 text-neutral-700 sm:text-base sm:leading-8">
                    <InlineEditable
                      contentKey="about_employee_bio"
                      defaultValue={profile.bio}
                      multiline
                    />
                  </div>

                  {/* Key Pillars / Capabilities */}
                  <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      ["about_employee_pillar_1", "12+ Years Garment Sourcing Experience"],
                      ["about_employee_pillar_2", "Direct Factory Management in Dhaka"],
                      ["about_employee_pillar_3", "100% Pre-Shipment Quality Control"],
                      ["about_employee_pillar_4", "Ethical & Social Compliance Audits"],
                    ].map(([key, defaultVal]) => (
                      <div
                        key={key}
                        className="flex items-center gap-3 rounded-xs border border-neutral-200/90 bg-[#faf8f5] px-3.5 py-3 text-xs text-neutral-800 transition hover:border-neutral-400"
                      >
                        <CheckCircle2 size={15} className="shrink-0 text-neutral-900" />
                        <span className="font-medium">
                          <InlineEditable contentKey={key} defaultValue={defaultVal} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Contact Links */}
                <div className="mt-8 border-t border-neutral-200/80 pt-6">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <a
                      href={`mailto:${profile.email}`}
                      className="inline-flex items-center gap-2 rounded-xs border border-neutral-300 bg-white px-4 py-2.5 text-xs font-medium text-neutral-800 transition hover:border-black hover:bg-neutral-950 hover:text-white"
                    >
                      <Mail size={14} />
                      <InlineEditable
                        contentKey="about_employee_email"
                        defaultValue={profile.email}
                      />
                    </a>

                    {profile.phone && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xs border border-emerald-600/30 bg-emerald-50/70 px-4 py-2.5 text-xs font-medium text-emerald-800 transition hover:bg-emerald-600 hover:text-white"
                      >
                        <MessageCircle size={14} />
                        <span>WhatsApp Direct</span>
                      </a>
                    )}

                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-xs bg-neutral-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-neutral-800"
                    >
                      <InlineEditable
                        contentKey="about_employee_cta"
                        defaultValue="REQUEST A QUOTE"
                      />
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Modal for Photo Deletion (replaces window.confirm) */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Remove Leadership Photo?"
        description="Are you sure you want to remove the current leadership portrait? You can upload a new photo at any time."
        confirmText="Remove Photo"
        variant="danger"
        busy={isDeleting}
        onConfirm={() => void handleConfirmRemove()}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
