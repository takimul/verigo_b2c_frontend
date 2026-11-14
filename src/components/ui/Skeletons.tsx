import React from "react";

/**
 * Structured Skeleton Loader for Main Categories Page (/categories)
 */
export function CategoryPageSkeleton() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      {/* Hero Header Skeleton */}
      <section className="border-b border-neutral-200 bg-[#f7f5f0]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="h-3 w-36 animate-pulse rounded-xs bg-neutral-200" />
          <div className="mt-4 h-10 w-96 max-w-[85vw] animate-pulse rounded-xs bg-neutral-300/80 sm:h-14 sm:w-[480px]" />
          <div className="mt-5 h-4 w-full max-w-2xl animate-pulse rounded-xs bg-neutral-200" />
          <div className="mt-2 h-4 w-3/4 max-w-xl animate-pulse rounded-xs bg-neutral-200/70" />
        </div>
      </section>

      {/* Main Categories & Filter Skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="h-7 w-52 animate-pulse rounded-xs bg-neutral-300/80" />
            <div className="mt-2 h-3.5 w-40 animate-pulse rounded-xs bg-neutral-200" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-24 animate-pulse rounded-xs bg-neutral-900/10" />
            <div className="h-8 w-32 animate-pulse rounded-xs bg-neutral-200" />
            <div className="h-8 w-32 animate-pulse rounded-xs bg-neutral-200" />
          </div>
        </div>

        {/* 2 Grand Season Cards Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden border border-neutral-200 bg-[#f7f5f0]"
            >
              <div className="aspect-[16/9] w-full animate-pulse bg-neutral-200" />
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="h-2.5 w-28 animate-pulse rounded-xs bg-neutral-300/80" />
                    <div className="mt-2 h-8 w-56 animate-pulse rounded-xs bg-neutral-300" />
                  </div>
                  <div className="size-10 animate-pulse rounded-full bg-neutral-200" />
                </div>
                <div className="mt-4 h-4 w-full max-w-md animate-pulse rounded-xs bg-neutral-200" />
                <div className="mt-2 h-4 w-2/3 max-w-sm animate-pulse rounded-xs bg-neutral-200/80" />

                {/* Line Pills */}
                <div className="mt-6 border-t border-neutral-200/80 pt-4">
                  <div className="h-2.5 w-24 animate-pulse rounded-xs bg-neutral-200 mb-2.5" />
                  <div className="flex gap-2">
                    <div className="h-7 w-20 animate-pulse rounded-xs bg-neutral-200" />
                    <div className="h-7 w-24 animate-pulse rounded-xs bg-neutral-200" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Products Section Skeleton */}
        <div className="mt-14 border-t border-neutral-200 pt-10">
          <div className="mb-6 flex items-baseline justify-between">
            <div>
              <div className="h-6 w-48 animate-pulse rounded-xs bg-neutral-300" />
              <div className="mt-1.5 h-3 w-32 animate-pulse rounded-xs bg-neutral-200" />
            </div>
          </div>

          {/* Product Grid Skeleton: 8 items */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="min-w-0">
                <div className="aspect-[4/5] w-full animate-pulse rounded-xs bg-neutral-200" />
                <div className="mt-3 h-2.5 w-16 animate-pulse rounded-xs bg-neutral-200" />
                <div className="mt-2 h-4 w-4/5 animate-pulse rounded-xs bg-neutral-300/80" />
                <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-2">
                  <div className="h-3 w-16 animate-pulse rounded-xs bg-neutral-200" />
                  <div className="h-3 w-20 animate-pulse rounded-xs bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/**
 * Structured Skeleton Loader for Category Details (/categories/[slug])
 */
export function CategoryDetailSkeleton() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      {/* Header Skeleton */}
      <section className="border-b border-neutral-200 bg-[#f7f5f0]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-4 h-3.5 w-44 animate-pulse rounded-xs bg-neutral-200" />
          <div className="h-3 w-32 animate-pulse rounded-xs bg-neutral-200/80" />
          <div className="mt-3 h-10 w-72 max-w-[80vw] animate-pulse rounded-xs bg-neutral-300/80 sm:h-12 sm:w-96" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded-xs bg-neutral-200" />
          <div className="mt-2 h-4 w-3/4 max-w-md animate-pulse rounded-xs bg-neutral-200/70" />
        </div>
      </section>

      {/* Navigation Pills Skeleton */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex gap-2.5">
            <div className="h-9 w-32 animate-pulse rounded-xs bg-neutral-900/10" />
            <div className="h-9 w-24 animate-pulse rounded-xs bg-neutral-200/80" />
            <div className="h-9 w-24 animate-pulse rounded-xs bg-neutral-200/80" />
          </div>
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-8 flex items-baseline justify-between border-b border-neutral-100 pb-3">
          <div>
            <div className="h-6 w-44 animate-pulse rounded-xs bg-neutral-300" />
            <div className="mt-1 h-3.5 w-28 animate-pulse rounded-xs bg-neutral-200/70" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="min-w-0">
              <div className="aspect-[4/5] w-full animate-pulse rounded-xs bg-neutral-200" />
              <div className="mt-3 h-2.5 w-16 animate-pulse rounded-xs bg-neutral-200" />
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded-xs bg-neutral-300/80" />
              <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-2">
                <div className="h-3 w-16 animate-pulse rounded-xs bg-neutral-200/70" />
                <div className="h-3 w-20 animate-pulse rounded-xs bg-neutral-200/70" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

/**
 * Structured Skeleton Loader for Product Details Page (/products/[slug])
 */
export function ProductDetailSkeleton() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="h-3 w-64 animate-pulse rounded-xs bg-neutral-200" />
        </div>
      </div>

      {/* 2-Column Product Detail Layout */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-14">
        {/* Left Column: Image Gallery Skeleton */}
        <div className="min-w-0">
          <div className="aspect-[4/5] w-full animate-pulse rounded-xs bg-neutral-200" />
          <div className="mt-4 flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="size-18 animate-pulse rounded-xs bg-neutral-200"
              />
            ))}
          </div>
        </div>

        {/* Right Column: Product Info Skeleton */}
        <div className="min-w-0">
          <div className="h-3 w-28 animate-pulse rounded-xs bg-neutral-200" />
          <div className="mt-3 h-9 w-4/5 animate-pulse rounded-xs bg-neutral-300 sm:h-11" />

          {/* MOQ Card */}
          <div className="mt-6 border border-neutral-200 bg-[#f7f5f0] p-5">
            <div className="h-3 w-24 animate-pulse rounded-xs bg-neutral-300/70" />
            <div className="mt-2 h-7 w-36 animate-pulse rounded-xs bg-neutral-300" />
            <div className="mt-2 h-3.5 w-60 animate-pulse rounded-xs bg-neutral-200" />
          </div>

          {/* Description */}
          <div className="mt-6 space-y-2">
            <div className="h-4 w-full animate-pulse rounded-xs bg-neutral-200" />
            <div className="h-4 w-5/6 animate-pulse rounded-xs bg-neutral-200" />
            <div className="h-4 w-3/4 animate-pulse rounded-xs bg-neutral-200" />
          </div>

          {/* Customization Options Grid Skeleton */}
          <div className="mt-8 border-t border-neutral-200 pt-6">
            <div className="h-3.5 w-48 animate-pulse rounded-xs bg-neutral-300" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 border border-neutral-200 p-3"
                >
                  <div className="size-4 animate-pulse rounded-xs bg-neutral-200" />
                  <div className="h-3 w-24 animate-pulse rounded-xs bg-neutral-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Specifications Table Skeleton */}
          <div className="mt-8 border-t border-neutral-200 pt-6">
            <div className="h-3.5 w-36 animate-pulse rounded-xs bg-neutral-300" />
            <div className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between py-3">
                  <div className="h-3 w-24 animate-pulse rounded-xs bg-neutral-200" />
                  <div className="h-3 w-32 animate-pulse rounded-xs bg-neutral-200" />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button Skeleton */}
          <div className="mt-8">
            <div className="h-12 w-full animate-pulse rounded-xs bg-neutral-900/15" />
          </div>
        </div>
      </section>

      {/* Bottom Inquiry Skeleton */}
      <section className="border-t border-neutral-200 bg-[#f7f5f0] py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="h-7 w-60 animate-pulse rounded-xs bg-neutral-300" />
          <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded-xs bg-neutral-200" />
          <div className="mt-8 border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="h-10 animate-pulse rounded-xs bg-neutral-100" />
              <div className="h-10 animate-pulse rounded-xs bg-neutral-100" />
              <div className="h-10 animate-pulse rounded-xs bg-neutral-100" />
              <div className="h-10 animate-pulse rounded-xs bg-neutral-100" />
            </div>
            <div className="mt-6 h-28 animate-pulse rounded-xs bg-neutral-100" />
            <div className="mt-6 h-11 w-44 animate-pulse rounded-xs bg-neutral-900/15" />
          </div>
        </div>
      </section>
    </main>
  );
}

/**
 * Structured Skeleton Loader for Wholesale Inquiry (/inquiry)
 */
export function InquiryPageSkeleton() {
  return (
    <main className="min-h-screen bg-[#f7f5f0] text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="h-3 w-48 animate-pulse rounded-xs bg-neutral-200" />
          <div className="mt-3 h-10 w-72 animate-pulse rounded-xs bg-neutral-300 sm:h-12" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded-xs bg-neutral-200" />
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
        {/* Left Column */}
        <aside className="border border-neutral-200 bg-white p-6 h-fit">
          <div className="h-3 w-28 animate-pulse rounded-xs bg-neutral-300" />
          <div className="mt-5 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="size-4 animate-pulse rounded-xs bg-neutral-200" />
                <div className="h-4 w-44 animate-pulse rounded-xs bg-neutral-200" />
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <div className="h-3 w-full animate-pulse rounded-xs bg-neutral-200" />
            <div className="mt-2 h-3 w-3/4 animate-pulse rounded-xs bg-neutral-200" />
          </div>
        </aside>

        {/* Right Column: Form Skeleton */}
        <div className="border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="h-6 w-48 animate-pulse rounded-xs bg-neutral-300" />
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="h-10 animate-pulse rounded-xs bg-neutral-100" />
            <div className="h-10 animate-pulse rounded-xs bg-neutral-100" />
            <div className="h-10 animate-pulse rounded-xs bg-neutral-100" />
            <div className="h-10 animate-pulse rounded-xs bg-neutral-100" />
            <div className="h-10 animate-pulse rounded-xs bg-neutral-100" />
            <div className="h-10 animate-pulse rounded-xs bg-neutral-100" />
          </div>
          <div className="mt-5 h-28 animate-pulse rounded-xs bg-neutral-100" />
          <div className="mt-6 h-11 w-44 animate-pulse rounded-xs bg-neutral-900/15" />
        </div>
      </section>
    </main>
  );
}

/**
 * Structured Skeleton Loader for Contact Page Details (/contact)
 */
export function ContactDetailsSkeleton() {
  return (
    <div className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 py-4">
          <div className="size-5 animate-pulse rounded-xs bg-neutral-200" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 w-20 animate-pulse rounded-xs bg-neutral-200" />
            <div className="h-4 w-48 animate-pulse rounded-xs bg-neutral-300/80" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Structured Skeleton Loader for Home Page (/)
 */
export function HomePageSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <section className="relative flex min-h-[75vh] flex-col justify-end border-b border-neutral-200 bg-[#f7f5f0] p-6 sm:p-12 lg:p-16">
        <div className="max-w-4xl space-y-4">
          <div className="h-3.5 w-32 animate-pulse rounded-xs bg-neutral-300" />
          <div className="h-12 w-full max-w-2xl animate-pulse rounded-xs bg-neutral-300 sm:h-16" />
          <div className="h-5 w-3/4 max-w-xl animate-pulse rounded-xs bg-neutral-200" />
          <div className="pt-4 flex gap-3">
            <div className="h-12 w-44 animate-pulse rounded-xs bg-neutral-900/15" />
            <div className="h-12 w-40 animate-pulse rounded-xs bg-neutral-200" />
          </div>
        </div>
      </section>

      {/* Categories Showcase Skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-4 w-28 animate-pulse rounded-xs bg-neutral-200" />
        <div className="mt-2 h-8 w-64 animate-pulse rounded-xs bg-neutral-300" />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="aspect-[16/10] animate-pulse rounded-xs bg-neutral-200" />
          ))}
        </div>
      </section>

      {/* Featured Products Skeleton */}
      <section className="border-t border-neutral-200 bg-[#faf9f6] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-56 animate-pulse rounded-xs bg-neutral-300" />
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/5] animate-pulse rounded-xs bg-neutral-200" />
                <div className="h-4 w-3/4 animate-pulse rounded-xs bg-neutral-200" />
                <div className="h-3 w-1/2 animate-pulse rounded-xs bg-neutral-200" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/**
 * Structured Skeleton Loader for Products Page (/products)
 */
export function ProductsPageSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-neutral-200 bg-[#f7f5f0] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-3.5 w-32 animate-pulse rounded-xs bg-neutral-200" />
          <div className="mt-3 h-10 w-80 animate-pulse rounded-xs bg-neutral-300 sm:h-12" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded-xs bg-neutral-200" />
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[4/5] animate-pulse rounded-xs bg-neutral-200" />
              <div className="h-4 w-3/4 animate-pulse rounded-xs bg-neutral-200" />
              <div className="h-3 w-1/3 animate-pulse rounded-xs bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

/**
 * Structured Skeleton Loader for About Page (/about)
 */
export function AboutPageSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-neutral-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-3.5 w-28 animate-pulse rounded-xs bg-neutral-200" />
          <div className="mt-4 h-12 w-full max-w-2xl animate-pulse rounded-xs bg-neutral-300 sm:h-16" />
          <div className="mt-5 h-5 w-full max-w-xl animate-pulse rounded-xs bg-neutral-200" />
        </div>
      </header>

      {/* Leadership Section Skeleton */}
      <section className="border-b border-neutral-200 bg-[#fbf9f5] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="flex justify-center">
              <div className="h-[400px] w-[320px] animate-pulse rounded-2xl bg-neutral-200" />
            </div>
            <div className="space-y-4">
              <div className="h-3 w-36 animate-pulse rounded-xs bg-neutral-200" />
              <div className="h-8 w-64 animate-pulse rounded-xs bg-neutral-300" />
              <div className="h-4 w-40 animate-pulse rounded-xs bg-neutral-200" />
              <div className="h-24 w-full animate-pulse rounded-xs bg-neutral-200/60" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

