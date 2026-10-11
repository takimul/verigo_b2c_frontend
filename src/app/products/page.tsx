"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Package,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  getProducts,
  getProductCategories,
  type ProductCategory,
} from "@/services/products";
import type { Product } from "@/types/product";

const PAGE_SIZE = 12;

function formatCategoryName(name: string) {
  return name.replace(/\s+/g, " ").trim();
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get("categoryId") || "";

    setSelectedCategory(categoryId);
    setPage(1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const result = await getProductCategories();

        if (!cancelled) {
          setCategories(result);
        }
      } catch (err) {
        console.error("Unable to load product categories:", err);
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getProducts({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        categoryId: selectedCategory || undefined,
      });

      const result = response.data;

      setProducts(result.items);
      setTotalPages(Math.max(1, result.pagination.totalPages));
      setTotalProducts(result.pagination.total);
    } catch (err) {
      console.error("Unable to load products:", err);
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load products. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setSelectedCategory("");
    setPage(1);
  }

  const hasFilters = Boolean(search || selectedCategory);

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      {/* Page introduction */}
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 text-xs text-neutral-500"
          >
            <Link href="/" className="hover:text-neutral-950">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-950">Products</span>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Verigo Essential · Wholesale collection
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Products built for your business.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                Explore our apparel collection for bulk orders, private
                labeling, and custom production. Find the right products for
                your brand and request a wholesale quote.
              </p>
            </div>

            <div className="border-l-2 border-neutral-950 pl-5 lg:justify-self-end">
              <p className="text-3xl font-semibold tabular-nums">
                {loading ? "—" : totalProducts.toLocaleString()}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-neutral-500">
                Products in this collection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and filters */}
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form
              onSubmit={submitSearch}
              className="flex w-full max-w-xl"
              role="search"
            >
              <label htmlFor="product-search" className="sr-only">
                Search products
              </label>

              <div className="relative flex-1">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />

                <input
                  id="product-search"
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search products..."
                  className="h-12 w-full border border-neutral-300 bg-white pl-10 pr-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-950"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 bg-neutral-950 px-5 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Search
              </button>
            </form>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label
                htmlFor="product-category"
                className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500"
              >
                <SlidersHorizontal size={15} />
                Category
              </label>

              <div className="relative min-w-0 sm:min-w-[220px]">
                <select
                  id="product-category"
                  value={selectedCategory}
                  onChange={(event) => {
                    setSelectedCategory(event.target.value);
                    setPage(1);
                  }}
                  className="h-12 w-full appearance-none border border-neutral-300 bg-white px-4 pr-10 text-sm outline-none focus:border-neutral-950"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {formatCategoryName(category.name)}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                />
              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex h-11 items-center justify-center gap-2 px-3 text-sm text-neutral-600 hover:text-neutral-950"
                >
                  <X size={15} />
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {search && (
            <p className="mt-4 text-xs text-neutral-500">
              Search results for{" "}
              <span className="font-medium text-neutral-950">“{search}”</span>
            </p>
          )}
        </div>
      </section>

      {/* Product listing */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {selectedCategory
                ? categories.find((item) => item.id === selectedCategory)
                    ?.name || "Filtered products"
                : "Our collection"}
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              {loading
                ? "Loading products..."
                : `${totalProducts.toLocaleString()} ${
                    totalProducts === 1 ? "product" : "products"
                  } found`}
            </p>
          </div>

          {!loading && totalProducts > 0 && (
            <p className="hidden text-xs text-neutral-500 sm:block">
              Page {page} of {totalPages}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-3">
            <LoaderCircle size={30} className="animate-spin text-neutral-500" />
            <p className="text-sm text-neutral-500">
              Finding products for you...
            </p>
          </div>
        ) : error ? (
          <div className="border border-neutral-200 px-5 py-16 text-center">
            <p className="text-base font-medium">Unable to load products</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void loadProducts()}
              className="mt-5 bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="border border-neutral-200 px-5 py-16 text-center">
            <Package
              size={34}
              strokeWidth={1.3}
              className="mx-auto text-neutral-400"
            />
            <h3 className="mt-4 text-lg font-semibold">No products found</h3>
            <p className="mt-2 text-sm text-neutral-500">
              Try another search term or choose a different category.
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 border border-neutral-300 px-5 py-2.5 text-sm hover:bg-neutral-50"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
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
                              size={42}
                              strokeWidth={1}
                              className="text-neutral-300"
                            />
                          </div>
                        )}

                        {product.isFeatured && (
                          <span className="absolute left-2 top-2 bg-white px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[10px]">
                            Featured
                          </span>
                        )}

                        <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center border border-neutral-200 bg-white text-neutral-950 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                          <ArrowRight size={16} />
                        </span>
                      </div>

                      <div className="mt-4">
                        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500 sm:text-xs">
                          {product.category?.name || "Collection"}
                        </p>

                        <h3 className="mt-2 line-clamp-2 text-sm font-medium leading-5 text-neutral-950 transition group-hover:underline sm:text-base sm:leading-6">
                          {product.name}
                        </h3>
                      </div>
                    </Link>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 pt-3">
                      <p className="text-xs text-neutral-500">
                        MOQ:{" "}
                        <span className="font-semibold tabular-nums text-neutral-950">
                          {product.moq.toLocaleString()}
                        </span>
                      </p>

                      <Link
                        href={`/products/${product.slug}#inquiry`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-neutral-950 hover:underline"
                      >
                        Get a quote
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Product pagination"
                className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-neutral-200 pt-8"
              >
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((current) => Math.max(1, current - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex h-10 items-center gap-1 border border-neutral-300 px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter(
                    (pageNumber) =>
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      Math.abs(pageNumber - page) <= 1,
                  )
                  .reduce<(number | "ellipsis")[]>((result, pageNumber) => {
                    const previous = result[result.length - 1];

                    if (
                      typeof previous === "number" &&
                      pageNumber - previous > 1
                    ) {
                      result.push("ellipsis");
                    }

                    result.push(pageNumber);
                    return result;
                  }, [])
                  .map((item, index) =>
                    item === "ellipsis" ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-1 text-sm text-neutral-400"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        aria-current={page === item ? "page" : undefined}
                        onClick={() => {
                          setPage(item);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`size-10 border text-sm ${
                          page === item
                            ? "border-neutral-950 bg-neutral-950 text-white"
                            : "border-neutral-300 hover:bg-neutral-50"
                        }`}
                      >
                        {item}
                      </button>
                    ),
                  )}

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => {
                    setPage((current) => Math.min(totalPages, current + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex h-10 items-center gap-1 border border-neutral-300 px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </nav>
            )}
          </>
        )}
      </section>

      {/* Wholesale CTA */}
      <section className="border-t border-neutral-200 bg-neutral-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8 lg:py-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
              Wholesale partnerships
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Have a bulk order or custom production requirement?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-300">
              Tell us about your project and let our team help you find the
              right solution for your business.
            </p>
          </div>

          <Link
            href="/inquiry"
            className="inline-flex shrink-0 items-center justify-center gap-2 border border-white px-5 py-3 text-sm font-medium transition hover:bg-white hover:text-neutral-950"
          >
            Submit an inquiry
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
