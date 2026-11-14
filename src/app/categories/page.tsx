"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";

import { getCategories } from "@/services/categories";
import { getProducts } from "@/services/products";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import InlineEditable from "@/components/ui/InlineEditable";
import { CategoryPageSkeleton } from "@/components/ui/Skeletons";

function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
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

        if (catRes.success) {
          const active = (catRes.data || []).filter((c) => c.isActive);
          // Prioritize Winter Essentials first (sort 0/1), then Summer Essentials (sort 1/2)
          active.sort((a, b) => (a.sortOrder ?? 100) - (b.sortOrder ?? 100));
          setCategories(active);
        }

        if (prodRes.success && prodRes.data?.items) {
          setProducts(prodRes.data.items);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load collections.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Top level season categories (Winter Essentials, Summer Essentials)
  const topCategories = useMemo(
    () => categories.filter((c) => !c.parentId).slice(0, 2),
    [categories],
  );

  // Subcategories / Lines mapping
  const getSubcategories = (parentId: string) =>
    categories.filter((c) => c.parentId === parentId);

  // Filter products by selected category and line
  const filteredProducts = useMemo(() => {
    if (selectedSubcategoryId) {
      return products.filter((p) => p.category?.id === selectedSubcategoryId);
    }

    if (selectedCategoryId === "all") {
      return products;
    }

    const childIds = categories
      .filter((c) => c.parentId === selectedCategoryId)
      .map((c) => c.id);

    return products.filter((p) => {
      if (p.category?.id === selectedCategoryId) return true;
      return p.category?.id ? childIds.includes(p.category.id) : false;
    });
  }, [selectedCategoryId, selectedSubcategoryId, products, categories]);

  if (loading) {
    return <CategoryPageSkeleton />;
  }

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      {/* Hero Header */}
      <section className="border-b border-neutral-200 bg-[#f7f5f0]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500"
          >
            <Link href="/" className="hover:text-neutral-950">
              Home
            </Link>{" "}
            / <span className="text-neutral-950">Collections</span>
          </nav>

          <InlineEditable
            contentKey="categories_page_headline"
            defaultValue="Explore our season collections."
            as="h1"
            className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          />

          <InlineEditable
            contentKey="categories_page_description"
            defaultValue="Discover apparel collections for brands, retailers, and wholesale buyers. We work with trusted Bangladeshi partner factories to supply quality garments tailored to your business."
            as="p"
            multiline
            className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base"
          />
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <InlineEditable
              contentKey="categories_season_title"
              defaultValue="Season Collections"
              as="h2"
              className="text-2xl font-semibold tracking-tight"
            />
            <p className="mt-1 text-sm text-neutral-500">
              {topCategories.length} main season collections available
            </p>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryId("all");
                  setSelectedSubcategoryId(null);
                }}
                className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                  selectedCategoryId === "all" && !selectedSubcategoryId
                    ? "bg-neutral-950 text-white"
                    : "border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                All Products
              </button>

              {topCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setSelectedSubcategoryId(null);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                    selectedCategoryId === cat.id && !selectedSubcategoryId
                      ? "bg-neutral-950 text-white"
                      : "border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {error ? (
          <div className="border border-neutral-200 px-5 py-14 text-center">
            <p className="text-sm text-neutral-600">{error}</p>
          </div>
        ) : topCategories.length === 0 ? (
          <div className="border border-neutral-200 px-5 py-14 text-center">
            <Package size={32} className="mx-auto text-neutral-400" />
            <p className="mt-4 font-medium">No collections available yet</p>
            <p className="mt-2 text-sm text-neutral-500">
              Please check back soon.
            </p>
          </div>
        ) : (
          <>
            {/* Top Two Season Categories Grid: Winter Essentials & Summer Essentials */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {topCategories.map((category) => {
                const subcats = getSubcategories(category.id);
                // Intelligently find category image or fallback to subcategory / product image
                const catImage =
                  category.imageUrl ||
                  subcats.find((s) => s.imageUrl)?.imageUrl ||
                  products.find(
                    (p) =>
                      p.category?.id === category.id ||
                      subcats.some((s) => s.id === p.category?.id),
                  )?.images?.[0]?.url;

                return (
                  <article
                    key={category.id}
                    className="group flex flex-col overflow-hidden border border-neutral-200 bg-[#f7f5f0] transition hover:border-neutral-400 shadow-xs"
                  >
                    {/* Category Image if available */}
                    {catImage && (
                      <Link
                        href={`/categories/${category.slug}`}
                        className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-200 block"
                      >
                        <Image
                          src={catImage}
                          alt={category.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-transparent" />
                      </Link>
                    )}

                    <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                              Season Collection
                            </p>
                            <Link href={`/categories/${category.slug}`}>
                              <h3 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 group-hover:underline sm:text-3xl">
                                {category.name}
                              </h3>
                            </Link>
                          </div>

                          <Link
                            href={`/categories/${category.slug}`}
                            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-neutral-950 shadow-xs transition group-hover:bg-neutral-950 group-hover:text-white"
                          >
                            <ArrowRight size={16} />
                          </Link>
                        </div>

                        {category.description && (
                          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">
                            {category.description}
                          </p>
                        )}
                      </div>

                      {/* Clean Apparel Lines (No developer badges or folder icons) */}
                      {subcats.length > 0 && (
                        <div className="mt-6 border-t border-neutral-200/80 pt-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                            Apparel Lines
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {subcats.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/categories/${sub.slug}`}
                                className="border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Products in Collection Section */}
            <div className="mt-14 border-t border-neutral-200 pt-10">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedSubcategoryId
                      ? `Styles in ${categories.find((c) => c.id === selectedSubcategoryId)?.name}`
                      : selectedCategoryId === "all"
                        ? "All Products"
                        : `${categories.find((c) => c.id === selectedCategoryId)?.name || "Collection"} Styles`}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "product" : "products"}{" "}
                    available
                  </p>
                </div>
              </div>

              {/* Line Filter Row (Clean Pills) */}
              {selectedCategoryId !== "all" &&
                getSubcategories(selectedCategoryId).length > 0 && (
                  <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-neutral-100 pb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Line:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedSubcategoryId(null)}
                      className={`px-3 py-1 text-xs font-medium transition ${
                        !selectedSubcategoryId
                          ? "bg-neutral-900 text-white"
                          : "border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      All in {categories.find((c) => c.id === selectedCategoryId)?.name}
                    </button>
                    {getSubcategories(selectedCategoryId).map((sub) => {
                      const isCurrent = selectedSubcategoryId === sub.id;
                      const subCount = products.filter(
                        (p) => p.category?.id === sub.id,
                      ).length;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setSelectedSubcategoryId(sub.id)}
                          className={`px-3 py-1 text-xs font-medium transition ${
                            isCurrent
                              ? "bg-neutral-900 text-white"
                              : "border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                          }`}
                        >
                          {sub.name} ({subCount})
                        </button>
                      );
                    })}
                  </div>
                )}

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="border border-neutral-200 p-10 text-center">
                  <Package
                    size={32}
                    className="mx-auto text-neutral-400"
                    strokeWidth={1.4}
                  />
                  <p className="mt-3 text-sm font-medium text-neutral-800">
                    No products listed in this selection yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4">
                  {filteredProducts.map((product) => {
                    const primaryImage =
                      product.images.find((image) => image.isPrimary) ||
                      [...product.images].sort(
                        (a, b) => a.sortOrder - b.sortOrder,
                      )[0];

                    return (
                      <article key={product.id} className="group min-w-0">
                        <Link
                          href={`/products/${product.slug}`}
                          className="block"
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
                            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                              {product.category?.name || "Apparel"}
                            </p>

                            <h4 className="mt-1 line-clamp-1 text-sm font-medium leading-5 text-neutral-950 group-hover:underline">
                              {product.name}
                            </h4>
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
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoriesContent />
    </Suspense>
  );
}
