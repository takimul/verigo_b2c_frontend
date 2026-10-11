"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers3, LoaderCircle } from "lucide-react";

import { getCategories } from "@/services/categories";
import type { Category } from "@/types/category";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await getCategories();

        if (!cancelled) {
          setCategories(response.data.filter((category) => category.isActive));
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

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            Verigo Essential / Collections
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Explore our categories.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
            Discover apparel collections for brands, retailers, and wholesale
            buyers. Explore our categories to find products suited to your
            business.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">All categories</h2>
            <p className="mt-1 text-sm text-neutral-500">
              {loading
                ? "Loading collections..."
                : `${categories.length} collections`}
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            All products <ArrowRight size={15} />
          </Link>
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
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <article key={category.id} className="group min-w-0">
                <Link
                  href={`/products?categoryId=${encodeURIComponent(category.id)}`}
                  className="block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <Layers3
                          size={44}
                          strokeWidth={1}
                          className="text-neutral-300"
                        />
                      </div>
                    )}

                    <span className="absolute bottom-3 right-3 flex size-10 items-center justify-center bg-white text-neutral-950 transition group-hover:bg-neutral-950 group-hover:text-white">
                      <ArrowRight size={17} />
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-base font-semibold group-hover:underline">
                      {category.name}
                    </h3>

                    {category.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">
                        {category.description}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Need something made for your brand?
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Discuss your product specifications and wholesale requirements.
            </p>
          </div>

          <Link
            href="/oem-odm"
            className="inline-flex items-center justify-center gap-2 bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Explore OEM/ODM <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
