"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers3, LoaderCircle, Package } from "lucide-react";

import { getCategories } from "@/services/categories";
import { getProducts } from "@/services/products";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import InlineEditable from "@/components/ui/InlineEditable";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
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
          // Sort by sortOrder, prioritizing Winter Essentials (sort 1) then Summer Essentials (sort 2)
          active.sort((a, b) => (a.sortOrder ?? 100) - (b.sortOrder ?? 100));
          setCategories(active);
        }

        if (prodRes.success && prodRes.data?.items) {
          setProducts(prodRes.data.items);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load categories.",
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

  // Top level categories (no parent or sortOrder < 100)
  const topCategories = categories.filter((c) => !c.parentId);

  // Subcategories mapping
  const getSubcategories = (parentId: string) =>
    categories.filter((c) => c.parentId === parentId);

  // Filter products by selected category
  const filteredProducts =
    selectedCategoryId === "all"
      ? products
      : products.filter((p) => {
          if (p.category?.id === selectedCategoryId) return true;
          // check if product category is child of selected category
          const childIds = categories
            .filter((c) => c.parentId === selectedCategoryId)
            .map((c) => c.id);
          return p.category?.id ? childIds.includes(p.category.id) : false;
        });

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
            / <span className="text-neutral-950">Categories</span>
          </nav>

          <InlineEditable
            contentKey="categories_page_headline"
            defaultValue="Explore our categories."
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
            <h2 className="text-2xl font-semibold tracking-tight">
              Collections &amp; Categories
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {loading
                ? "Loading collections..."
                : `${categories.length} categories available`}
            </p>
          </div>

          {/* Category Filter Pills */}
          {!loading && categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategoryId("all")}
                className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                  selectedCategoryId === "all"
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
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                    selectedCategoryId === cat.id
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

        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-neutral-500">
            <LoaderCircle size={22} className="animate-spin" />
            Loading categories...
          </div>
        ) : error ? (
          <div className="border border-neutral-200 px-5 py-14 text-center">
            <p className="text-sm text-neutral-600">{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="border border-neutral-200 px-5 py-14 text-center">
            <Layers3 size={32} className="mx-auto text-neutral-400" />
            <p className="mt-4 font-medium">No categories available yet</p>
            <p className="mt-2 text-sm text-neutral-500">
              Please check back soon.
            </p>
          </div>
        ) : (
          <>
            {/* Top Categories Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {topCategories.map((category) => {
                const subcats = getSubcategories(category.id);

                return (
                  <article
                    key={category.id}
                    className="group overflow-hidden border border-neutral-200 bg-[#f7f5f0] transition hover:border-neutral-400"
                  >
                    <Link
                      href={`/categories/${category.slug}`}
                      className="block p-6 sm:p-8"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                            Collection
                          </p>
                          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 group-hover:underline sm:text-3xl">
                            {category.name}
                          </h3>
                        </div>

                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-neutral-950 shadow-xs transition group-hover:bg-neutral-950 group-hover:text-white">
                          <ArrowRight size={16} />
                        </span>
                      </div>

                      {category.description && (
                        <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">
                          {category.description}
                        </p>
                      )}

                      {subcats.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2 border-t border-neutral-200/80 pt-4">
                          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                            Sub-categories:
                          </span>
                          {subcats.map((sub) => (
                            <span
                              key={sub.id}
                              className="bg-white px-2.5 py-1 text-xs text-neutral-800"
                            >
                              {sub.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  </article>
                );
              })}
            </div>

            {/* Products in Category */}
            <div className="mt-14 border-t border-neutral-200 pt-10">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedCategoryId === "all"
                      ? "All Products"
                      : categories.find((c) => c.id === selectedCategoryId)
                          ?.name || "Collection Products"}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "product" : "products"}{" "}
                    available
                  </p>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="border border-neutral-200 p-10 text-center">
                  <Package
                    size={32}
                    className="mx-auto text-neutral-400"
                    strokeWidth={1.4}
                  />
                  <p className="mt-3 text-sm font-medium text-neutral-800">
                    No products listed in this collection yet.
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
                                  size={40}
                                  strokeWidth={1}
                                  className="text-neutral-300"
                                />
                              </div>
                            )}

                            <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center border border-neutral-200 bg-white text-neutral-950 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                              <ArrowRight size={15} />
                            </span>
                          </div>

                          <div className="mt-3">
                            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                              {product.category?.name || "Collection"}
                            </p>

                            <h4 className="mt-1 line-clamp-1 text-sm font-medium leading-5 text-neutral-950 transition group-hover:underline">
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
                            Details →
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

      {/* Bottom CTA Section */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Looking for Custom Development?
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Tell us what you need and we will coordinate it with our partner factories.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/custom-development"
              className="inline-flex items-center justify-center gap-2 border border-neutral-300 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:bg-neutral-100"
            >
              Custom Development
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-neutral-950 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800"
            >
              REQUEST A QUOTE <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
