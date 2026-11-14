"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import InquiryForm from "@/components/inquiries/InquiryForm";

function Content() {
  const params = useSearchParams();

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
            Verigo Essential · Sourced from Bangladesh
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl font-normal tracking-tight text-neutral-950 sm:text-5xl">
            Request a quote.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
            Share your product, estimated quantity and branding requirements, and
            we will send you a quote.
          </p>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
        {/* Left Column: How It Works */}
        <aside className="border border-neutral-200 bg-white p-6 h-fit">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            How it works
          </p>
          <ol className="mt-5 space-y-4">
            {[
              ["01", "Share your requirements"],
              ["02", "Our team reviews your request"],
              ["03", "Discuss the next steps"],
            ].map(([n, t]) => (
              <li key={n} className="flex gap-3 text-sm">
                <span className="text-xs text-neutral-400 font-medium">{n}</span>
                <span className="font-medium text-neutral-900">{t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs leading-6 text-neutral-600 border-t border-neutral-100 pt-4">
            Include approximate quantities, sizes, colors, and branding
            preferences to help us respond accurately.
          </p>

          <div className="mt-6 border-t border-neutral-100 pt-5">
            <a
              href="https://wa.me/8801918243120"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium text-neutral-700 hover:text-black transition"
            >
              <MessageCircle size={15} />
              Prefer WhatsApp? Direct Chat
            </a>
          </div>
        </aside>

        {/* Right Column: Clean Inquiry Form */}
        <div>
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
