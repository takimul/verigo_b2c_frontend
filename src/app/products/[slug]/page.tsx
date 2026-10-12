"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LoaderCircle,
  Package,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { getProductBySlug } from "@/services/products";
import type { Product } from "@/types/product";
import InquiryForm from "@/components/inquiries/InquiryForm";

function ProductDetailsContent() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getProductBySlug(slug);

      if (!response.data) {
        setProduct(null);
        setError("We couldn't find this product.");
        return;
      }

      setProduct(response.data);
      setSelectedImage(0);
    } catch (err) {
      console.error("Could not load product:", err);

      setProduct(null);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load this product. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  function scrollToInquiry() {
    document.getElementById("inquiry")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle size={30} className="animate-spin text-neutral-700" />
          <p className="text-sm text-neutral-500">Loading product details...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-md border border-neutral-200 bg-white p-8 text-center">
          <Package
            size={32}
            className="mx-auto text-neutral-400"
            strokeWidth={1.5}
          />

          <h1 className="mt-4 text-xl font-semibold text-neutral-950">
            Product unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            {error || "This product could not be found."}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void loadProduct()}
              className="inline-flex items-center justify-center gap-2 border border-neutral-300 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50"
            >
              <RefreshCw size={15} />
              Try again
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              <ArrowLeft size={15} />
              Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const images = [...product.images].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) {
      return a.isPrimary ? -1 : 1;
    }

    return a.sortOrder - b.sortOrder;
  });

  const activeImage = images[selectedImage] ?? images[0];

  const specifications = [
    { label: "Fabric", value: product.fabric },
    { label: "GSM", value: product.gsm?.toString() },
    { label: "Composition", value: product.composition },
    { label: "Washing information", value: product.washingInfo },
  ].filter((item): item is { label: string; value: string } =>
    Boolean(item.value),
  );

  const customizationOptions = [
    { label: "Custom fabric", enabled: product.customFabric },
    { label: "Custom colors", enabled: product.customColor },
    { label: "Custom printing", enabled: product.customPrinting },
    { label: "Custom embroidery", enabled: product.customEmbroidery },
    { label: "Custom neck labels", enabled: product.customNeckLabel },
    { label: "Custom packaging", enabled: product.customPackaging },
  ];

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs text-neutral-500"
          >
            <Link href="/" className="hover:text-neutral-950">
              Home
            </Link>

            <span>/</span>

            <Link href="/products" className="hover:text-neutral-950">
              Products
            </Link>

            <span>/</span>

            <span className="max-w-[220px] truncate text-neutral-950">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product overview */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-14">
        {/* Image gallery */}
        <div className="min-w-0">
          <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
            {activeImage?.url ? (
              <Image
                src={activeImage.url}
                alt={activeImage.altText || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <Package
                  size={56}
                  strokeWidth={1}
                  className="text-neutral-300"
                />
              </div>
            )}

            {product.isFeatured && (
              <span className="absolute left-4 top-4 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-900">
                Featured
              </span>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous product image"
                  onClick={() =>
                    setSelectedImage(
                      (current) =>
                        (current - 1 + images.length) % images.length,
                    )
                  }
                  className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center border border-neutral-200 bg-white/90 hover:bg-white"
                >
                  <ArrowLeft size={17} />
                </button>

                <button
                  type="button"
                  aria-label="Next product image"
                  onClick={() =>
                    setSelectedImage((current) => (current + 1) % images.length)
                  }
                  className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center border border-neutral-200 bg-white/90 hover:bg-white"
                >
                  <ArrowRight size={17} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={selectedImage === index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden bg-neutral-100 ${
                    selectedImage === index
                      ? "outline outline-2 outline-neutral-950 outline-offset-2"
                      : "border border-neutral-200 hover:border-neutral-500"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.name} image ${index + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product information */}
        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            {product.category?.name || "Wholesale collection"}
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl lg:leading-[1.12]">
            {product.name}
          </h1>

          <p className="mt-3 text-xs text-neutral-400">
            Product code: {product.slug}
          </p>

          {product.description && (
            <div className="mt-6 whitespace-pre-line text-sm leading-7 text-neutral-600">
              {product.description}
            </div>
          )}

          {/* MOQ */}
          <div className="mt-7 border-y border-neutral-200 py-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
              Minimum order quantity
            </p>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tabular-nums tracking-tight">
                {product.moq.toLocaleString()}
              </span>
              <span className="text-sm text-neutral-500">units minimum</span>
            </div>

            <p className="mt-2 text-xs leading-5 text-neutral-500">
              Contact us for bulk order requirements, customization, and
              availability.
            </p>
          </div>

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Available sizes
              </h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className="min-w-12 border border-neutral-200 px-3 py-2 text-center text-sm"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Available colors
              </h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="border border-neutral-200 px-3 py-2 text-sm"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={scrollToInquiry}
              className="inline-flex items-center justify-center gap-2 bg-neutral-950 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Request a wholesale quote
              <ArrowRight size={16} />
            </button>

            <a
              href={`mailto:?subject=${encodeURIComponent(`Wholesale inquiry: ${product.name}`)}&body=${encodeURIComponent(`Hello, I would like to inquire about ${product.name}.\n\nProduct: ${product.name}\nProduct code: ${product.slug}\nMinimum order quantity: ${product.moq} units\n\nPlease share further details.`)}`}
              className="inline-flex items-center justify-center border border-neutral-300 px-5 py-3.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
            >
              Email about this product
            </a>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={15} />
              Wholesale focused
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Check size={15} />
              Customization available
            </span>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Product information
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Specifications
            </h2>
          </div>

          {specifications.length > 0 ? (
            <dl className="mt-7 grid gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-2">
              {specifications.map((item) => (
                <div key={item.label} className="bg-white p-5 sm:p-6">
                  <dt className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-sm leading-6 text-neutral-950">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-6 text-sm text-neutral-500">
              Detailed specifications are available on request.
            </p>
          )}
        </div>
      </section>

      {/* Customization */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Made for your business
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Customization options
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
          Tell us how you would like your order customized. Available options
          depend on the product and your order requirements.
        </p>

        <div className="mt-6 grid gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {customizationOptions.map((option) => (
            <div
              key={option.label}
              className="flex items-center gap-3 bg-white p-4"
            >
              <span
                className={`flex size-7 shrink-0 items-center justify-center ${
                  option.enabled
                    ? "bg-neutral-950 text-white"
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                <Check size={14} />
              </span>

              <span className="text-sm text-neutral-800">{option.label}</span>

              <span className="ml-auto text-[10px] uppercase tracking-wider text-neutral-400">
                {option.enabled ? "Available" : "On request"}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs leading-5 text-neutral-500">
          {product.customization === "YES"
            ? "Customization is available for this product."
            : product.customization === "AVAILABLE_ON_REQUEST"
              ? "Customization options can be discussed with our team."
              : "Standard product configuration. Contact our team to discuss your requirements."}
        </p>
      </section>

      {/* Embedded inquiry form */}
      <section
        id="inquiry"
        className="scroll-mt-8 border-t border-neutral-200 bg-neutral-50"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Start a conversation
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
              Request a quote
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Interested in {product.name}? Send us your requirements and
              estimated order quantity. Our team will follow up with you.
            </p>

            <div className="mt-6 border border-neutral-200 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                Selected product
              </p>

              <p className="mt-2 text-base font-semibold text-neutral-950">
                {product.name}
              </p>

              <p className="mt-1 text-sm text-neutral-600">
                Minimum order: {product.moq.toLocaleString()} units
              </p>
            </div>
          </div>

          <div>
            <InquiryForm
              key={product.id}
              initialProductId={product.id}
              compact
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-3">
            <LoaderCircle size={30} className="animate-spin text-neutral-700" />
            <p className="text-sm text-neutral-500">
              Loading product details...
            </p>
          </div>
        </main>
      }
    >
      <ProductDetailsContent />
    </Suspense>
  );
}
