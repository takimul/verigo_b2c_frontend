"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, LoaderCircle, Star, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductImage } from "@/types/product";
import {
  deleteProductImage,
  setPrimaryProductImage,
  uploadProductImage,
} from "@/services/products";

interface ProductImageManagerProps {
  product: Product;
  onChange: () => Promise<void> | void;
}

export default function ProductImageManager({
  product,
  onChange,
}: ProductImageManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [busyImageId, setBusyImageId] = useState<string | null>(null);

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be 8 MB or smaller.");
      return;
    }

    setUploading(true);
    try {
      await uploadProductImage(product.id, file);
      await onChange();
      toast.success("Product image uploaded.");
    } catch (error) {
      console.error(error);
      toast.error("Could not upload the image.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handlePrimary(image: ProductImage) {
    if (image.isPrimary) return;

    setBusyImageId(image.id);
    try {
      await setPrimaryProductImage(product.id, image.id);
      await onChange();
      toast.success("Primary image updated.");
    } catch (error) {
      console.error(error);
      toast.error("Could not update the primary image.");
    } finally {
      setBusyImageId(null);
    }
  }

  async function handleDelete(image: ProductImage) {
    const confirmed = window.confirm(
      "Delete this product image? This action cannot be undone.",
    );
    if (!confirmed) return;

    setBusyImageId(image.id);
    try {
      await deleteProductImage(product.id, image.id);
      await onChange();
      toast.success("Image deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete the image.");
    } finally {
      setBusyImageId(null);
    }
  }

  return (
    <section className="border-t border-neutral-200 pt-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Product media
          </p>
          <h3 className="mt-1 text-lg font-semibold text-neutral-950">
            Images
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Choose a primary image for product listings.
          </p>
        </div>

        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 border border-neutral-900 bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
        >
          {uploading ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          {uploading ? "Uploading..." : "Upload image"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void handleUpload(event.target.files)}
        />
      </div>

      {product.images.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-40 w-full flex-col items-center justify-center border border-dashed border-neutral-300 bg-neutral-50 px-4 text-center transition hover:border-neutral-500 hover:bg-neutral-100"
        >
          <ImagePlus size={26} className="text-neutral-500" />
          <span className="mt-3 text-sm font-medium text-neutral-800">
            Add the first product image
          </span>
          <span className="mt-1 text-xs text-neutral-500">
            JPG, PNG, WebP or another supported image format
          </span>
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {product.images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden border border-neutral-200 bg-neutral-100"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={image.url}
                  alt={image.altText || product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
                {image.isPrimary && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-900 shadow-sm">
                    <Star size={11} fill="currentColor" />
                    Primary
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-neutral-200 bg-white p-2">
                <button
                  type="button"
                  disabled={image.isPrimary || busyImageId === image.id}
                  onClick={() => void handlePrimary(image)}
                  className="inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-neutral-700 hover:text-black disabled:cursor-default disabled:opacity-40"
                >
                  {busyImageId === image.id ? (
                    <LoaderCircle size={13} className="animate-spin" />
                  ) : (
                    <Star size={13} />
                  )}
                  <span className="truncate">
                    {image.isPrimary ? "Primary" : "Set primary"}
                  </span>
                </button>

                <button
                  type="button"
                  aria-label="Delete image"
                  disabled={busyImageId === image.id}
                  onClick={() => void handleDelete(image)}
                  className="p-1.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-red-600 disabled:opacity-40"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
