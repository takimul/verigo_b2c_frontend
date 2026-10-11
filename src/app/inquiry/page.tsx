"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import InquiryForm from "@/components/inquiries/InquiryForm";
function Content() {
  const params = useSearchParams();
  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
            Verigo Essential · Wholesale
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
            Tell us what your business needs.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
            Share your product, quantity, and customization requirements. Our
            team will contact you to discuss the details.
          </p>
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
        <aside className="border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            How it works
          </p>
          <ol className="mt-4 space-y-4">
            {[
              ["01", "Share your requirements"],
              ["02", "Our team reviews your request"],
              ["03", "Discuss the next steps"],
            ].map(([n, t]) => (
              <li key={n} className="flex gap-3">
                <span className="text-xs text-neutral-400">{n}</span>
                <span className="text-sm font-medium">{t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm leading-6 text-neutral-600">
            Include approximate quantities, sizes, colors, and branding
            preferences to help us respond accurately.
          </p>
        </aside>
        <div>
          <h2 className="mb-4 text-xl font-semibold">Wholesale inquiry form</h2>
          <InquiryForm initialProductId={params.get("productId") ?? ""} />
        </div>
      </section>
    </main>
  );
}
export default function InquiryPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen p-8 text-sm text-neutral-500">
          Loading inquiry form...
        </main>
      }
    >
      <Content />
    </Suspense>
  );
}
