"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Package,
} from "lucide-react";

import { getCategories } from "@/services/categories";
import { getProducts } from "@/services/products";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { CategoryDetailSkeleton } from "@/components/ui/Skeletons";

function CategoryDetailContent() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSubfilter, setSelectedSubfilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [catRes, prodRes] = await Promise.all([
          getCategories(),
          getProducts({ limit: 100 }),
        ]);

        if (cancelled) return;

        const allCategories = catRes.data || [];
        const currentCat = allCategories.find((c) => c.slug === slug);

        if (!currentCat) {
          setError("Collection not found.");
          return;
        }

        setCategory(currentCat);

        // Check if category has a parent
        if (currentCat.parentId) {
          const parent = allCategories.find((c) => c.id === currentCat.parentId);
          setParentCategory(parent || null);
          setSubcategories([]);
        } else {
          // Top-level season collection: find active child categories
          const children = allCategories.filter(
            (c) => c.parentId === currentCat.id && c.isActive,
          );
          children.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
          setSubcategories(children);
          setParentCategory(null);
        }

        // Collect matching products
        const allProducts = prodRes.data?.items || [];
        const relevantCategoryIds = currentCat.parentId
          ? [currentCat.id]
          : [
              currentCat.id,
              ...allCategories
                .filter((c) => c.parentId === currentCat.id)
                .map((c) => c.id),
            ];

        const matchingProducts = allProducts.filter(
          (p) => p.category?.id && relevantCategoryIds.includes(p.category.id),
        );

        setProducts(matchingProducts);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load collection.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const displayedProducts = useMemo(() => {
    if (selectedSubfilter === "all") return products;
    return products.filter((p) => p.category?.id === selectedSubfilter);
  }, [products, selectedSubfilter]);

  // Use real structured skeleton loader
  if (loading) {
    return <CategoryDetailSkeleton />;
  }

  if (error || !category) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-md border border-neutral-200 bg-white p-8 text-center shadow-xs">
          <Package size={32} className="mx-auto text-neutral-400" />
          <h1 className="mt-4 text-xl font-semibold text-neutral-950">
            Collection not found
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {error || "The requested apparel collection could not be located."}
          </p>
          <Link
            href="/categories"
            className="mt-6 inline-flex items-center gap-2 bg-neutral-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition"
          >
            <ArrowLeft size={14} /> Back to All Collections
          </Link>
        </div>
      </main>
    );
  }

  const isChildCategory = Boolean(category.parentId && parentCategory);

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      {/* Editorial Collection Header */}
      <section className="border-b border-neutral-200 bg-[#f7f5f0]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
          >
            <Link href="/" className="hover:text-neutral-950">
              Home
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-neutral-950">
              Collections
            </Link>
            {isChildCategory && parentCategory && (
              <>
                <span>/</span>
                <Link
                  href={`/categories/${parentCategory.slug}`}
                  className="hover:text-neutral-950"
                >
                  {parentCategory.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-neutral-950">{category.name}</span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-neutral-500">
                {isChildCategory
                  ? `${parentCategory?.name} Line`
                  : "Season Collection"}
              </p>

              <h1 className="mt-2 font-serif text-4xl font-normal tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
                {category.name}
              </h1>

              {category.description && (
                <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                  {category.description}
                </p>
              )}
            </div>

            {isChildCategory && parentCategory && (
              <Link
                href={`/categories/${parentCategory.slug}`}
                className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-800 transition hover:border-neutral-950"
              >
                <ArrowLeft size={14} /> Back to {parentCategory.name}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Clean Luxury Category Filter Bar (No technical badges or developer terms) */}
      {!isChildCategory && subcategories.length > 0 && (
        <nav
          aria-label="Filter by line"
          className="border-b border-neutral-200 bg-white"
        >
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedSubfilter("all")}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                  selectedSubfilter === "all"
                    ? "bg-[#111] text-white shadow-xs"
                    : "border border-neutral-300 bg-white text-neutral-700 hover:border-black hover:text-black"
                }`}
              >
                All {category.name} ({products.length})
              </button>

              {subcategories.map((sub) => {
                const subCount = products.filter(
                  (p) => p.category?.id === sub.id,
                ).length;
                const isActive = selectedSubfilter === sub.id;

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() =>
                      setSelectedSubfilter(isActive ? "all" : sub.id)
                    }
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                      isActive
                        ? "bg-[#111] text-white shadow-xs"
                        : "border border-neutral-300 bg-white text-neutral-700 hover:border-black hover:text-black"
                    }`}
                  >
                    <span>{sub.name}</span>
                    <span
                      className={`text-[10px] ${
                        isActive ? "text-neutral-300" : "text-neutral-400"
                      }`}
                    >
                      ({subCount})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Visual Line Showcase Cards (Editorial Fashion Layout) */}
      {!isChildCategory &&
        subcategories.length > 0 &&
        selectedSubfilter === "all" && (
          <section className="border-b border-neutral-200 bg-[#faf9f6] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {subcategories.map((sub) => {
                  const subProds = products.filter(
                    (p) => p.category?.id === sub.id,
                  );
                  // Grab first product image or fallback
                  const previewImg =
                    subProds[0]?.images?.[0]?.url || sub.imageUrl;

                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubfilter(sub.id)}
                      className="group flex flex-col overflow-hidden border border-neutral-200 bg-white p-4 text-left transition hover:border-neutral-950 shadow-2xs"
                    >
                      {/* Photo Thumbnail */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                        {previewImg ? (
                          <img
                            src={previewImg}
                            alt={sub.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#f5f2eb] to-[#e8e3d8] p-4 text-center">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                              Apparel Line
                            </span>
                            <span className="mt-1 font-serif text-sm font-medium text-neutral-800">
                              {sub.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <h2 className="text-sm font-bold text-neutral-950 group-hover:underline">
                            {sub.name}
                          </h2>
                          <p className="mt-0.5 text-[11px] text-neutral-500">
                            {subProds.length}{" "}
                            {subProds.length === 1 ? "style" : "styles"}
                          </p>
                        </div>
                        <ArrowRight
                          size={14}
                          className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-black"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

      {/* Products Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-8 flex items-baseline justify-between border-b border-neutral-100 pb-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-950">
              {selectedSubfilter === "all"
                ? `${category.name} Apparel`
                : `${subcategories.find((s) => s.id === selectedSubfilter)?.name || category.name} Styles`}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              {displayedProducts.length}{" "}
              {displayedProducts.length === 1 ? "product" : "products"} available
              for wholesale order
            </p>
          </div>

          {selectedSubfilter !== "all" && (
            <button
              type="button"
              onClick={() => setSelectedSubfilter("all")}
              className="text-xs font-semibold text-neutral-800 underline underline-offset-4 hover:text-black"
            >
              Show all {category.name}
            </button>
          )}
        </div>

        {/* Products Grid */}
        {displayedProducts.length === 0 ? (
          <div className="border border-neutral-200 bg-neutral-50 p-12 text-center">
            <Package size={36} className="mx-auto text-neutral-400" />
            <h3 className="mt-3 text-base font-semibold text-neutral-900">
              No styles currently listed
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              {selectedSubfilter !== "all"
                ? "Items for this specific line will be added shortly."
                : "Products for this collection will be published soon."}
            </p>
            {selectedSubfilter !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedSubfilter("all")}
                className="mt-5 inline-flex items-center gap-2 bg-neutral-950 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800"
              >
                View All {category.name}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
            {displayedProducts.map((product) => {
              const primaryImage =
                product.images.find((image) => image.isPrimary) ||
                [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)[0];

              return (
                <article key={product.id} className="group min-w-0">
                  <Link
                    href={`/products/${product.slug}`}
                    className="block"
                    aria-label={`View ${product.name}`}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                      {primaryImage?.url ? (
                        <Image
                          src={primaryImage.url}
                          alt={primaryImage.altText || product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <Package
                            size={42}
                            strokeWidth={1}
                            className="text-neutral-300"
                          />
                        </div>
                      )}

                      <span className="absolute bottom-3 right-3 flex size-8 items-center justify-center border border-neutral-200 bg-white text-neutral-950 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                        <ArrowRight size={14} />
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        {product.category?.name || category.name}
                      </p>

                      <h3 className="mt-1 line-clamp-1 text-sm font-medium leading-5 text-neutral-950 transition group-hover:underline">
                        {product.name}
                      </h3>
                    </div>
                  </Link>

                  <div className="mt-2.5 flex items-center justify-between border-t border-neutral-100 pt-2 text-xs">
                    <span className="text-neutral-500">
                      MOQ:{" "}
                      <span className="font-semibold tabular-nums text-neutral-950">
                        {Number(product.moq || 0).toLocaleString()}
                      </span>
                    </span>

                    <Link
                      href={`/products/${product.slug}`}
                      className="font-medium text-neutral-900 hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default function CategoryDetailPage() {
  return (
    <Suspense fallback={<CategoryDetailSkeleton />}>
      <CategoryDetailContent />
    </Suspense>
  );
}
