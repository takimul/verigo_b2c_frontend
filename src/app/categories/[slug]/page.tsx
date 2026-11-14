"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle, Package } from "lucide-react";

import { getCategories } from "@/services/categories";
import { getProducts } from "@/services/products";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

function CategoryDetailContent() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const catRes = await getCategories();
        if (cancelled) return;

        const allCategories = catRes.data || [];
        const currentCat = allCategories.find((c) => c.slug === slug);

        if (!currentCat) {
          setError("Category not found.");
          return;
        }

        setCategory(currentCat);

        // Find child subcategories
        const children = allCategories.filter((c) => c.parentId === currentCat.id);
        setSubcategories(children);

        // Load products for this category or its children
        const relevantCategoryIds = [currentCat.id, ...children.map((c) => c.id)];

        const prodRes = await getProducts({ limit: 100 });
        if (cancelled) return;

        const allProducts = prodRes.data?.items || [];
        const matchingProducts = allProducts.filter(
          (p) => p.category?.id && relevantCategoryIds.includes(p.category.id),
        );

        setProducts(matchingProducts);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load category.",
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

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle size={30} className="animate-spin text-neutral-700" />
          <p className="text-sm text-neutral-500">Loading collection...</p>
        </div>
      </main>
    );
  }

  if (error || !category) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-md border border-neutral-200 bg-white p-8 text-center">
          <Package size={32} className="mx-auto text-neutral-400" />
          <h1 className="mt-4 text-xl font-semibold text-neutral-950">
            Category not found
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {error || "The requested category could not be located."}
          </p>
          <Link
            href="/categories"
            className="mt-6 inline-flex items-center gap-2 bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
          >
            <ArrowLeft size={15} /> All Categories
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      {/* Category Header */}
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
              Categories
            </Link>
            <span>/</span>
            <span className="text-neutral-950">{category.name}</span>
          </nav>

          <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
            {category.name}
          </h1>

          {category.description && (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
              {category.description}
            </p>
          )}

          {/* Subcategories if any */}
          {subcategories.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Sub-categories:
              </span>
              {subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/categories/${sub.slug}`}
                  className="border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 transition hover:bg-neutral-100"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Available Products</h2>
            <p className="mt-1 text-xs text-neutral-500">
              {products.length} {products.length === 1 ? "product" : "products"}{" "}
              in this category
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-950"
          >
            <ArrowLeft size={14} /> Back to all categories
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="border border-neutral-200 bg-neutral-50 p-12 text-center">
            <Package size={36} className="mx-auto text-neutral-400" />
            <h3 className="mt-3 text-base font-semibold">No products yet</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Products for this collection will be added soon.
            </p>
            <Link
              href="/categories"
              className="mt-5 inline-flex items-center gap-2 bg-neutral-950 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800"
            >
              Browse other categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
            {products.map((product) => {
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

                      <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center border border-neutral-200 bg-white text-neutral-950 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                        <ArrowRight size={15} />
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">
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
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-3">
            <LoaderCircle size={30} className="animate-spin text-neutral-700" />
            <p className="text-sm text-neutral-500">Loading collection...</p>
          </div>
        </main>
      }
    >
      <CategoryDetailContent />
    </Suspense>
  );
}
