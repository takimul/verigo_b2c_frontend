"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquare, ShieldCheck } from "lucide-react";
import InlineEditable from "@/components/ui/InlineEditable";

const howWeWorkCards = [
  {
    id: "card_1",
    icon: ShieldCheck,
    title: "Quality Checked",
    text: "Materials, stitching and finishing checked before shipping.",
  },
  {
    id: "card_2",
    icon: CheckCircle2,
    title: "Samples First",
    text: "Approve a sample before bulk production.",
  },
  {
    id: "card_3",
    icon: MessageSquare,
    title: "Clear Communication",
    text: "Clear requirements and regular updates, from inquiry to delivery.",
  },
];

export default function AboutClient() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      {/* Hero Section */}
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <InlineEditable
            contentKey="about_badge"
            defaultValue="About Verigo Essential"
            as="p"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500"
          />

          <InlineEditable
            contentKey="about_headline"
            defaultValue="Apparel sourced from Bangladesh."
            as="h1"
            className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          />

          <InlineEditable
            contentKey="about_description"
            defaultValue="Verigo Essential is a Bangladesh-based apparel sourcing and export company. We work with trusted partner factories to supply quality garments to wholesale buyers and brands."
            as="p"
            multiline
            className="mt-6 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8"
          />

          <Link
            href="/categories"
            className="mt-8 inline-flex items-center gap-2 bg-neutral-950 px-5 py-3.5 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Explore categories <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* How we work */}
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <InlineEditable
            contentKey="about_approach_badge"
            defaultValue="Our approach"
            as="p"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
          />

          <InlineEditable
            contentKey="about_approach_title"
            defaultValue="How we work."
            as="h2"
            className="mt-3 text-3xl font-semibold tracking-tight"
          />

          <div className="mt-8 grid gap-px border border-neutral-200 bg-neutral-200 md:grid-cols-3">
            {howWeWorkCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <article key={card.id} className="bg-white p-6 sm:p-8">
                  <Icon size={26} strokeWidth={1.4} className="text-neutral-900" />
                  <p className="mt-6 text-xs text-neutral-400">0{index + 1}</p>
                  <InlineEditable
                    contentKey={`about_${card.id}_title`}
                    defaultValue={card.title}
                    as="h3"
                    className="mt-2 text-lg font-semibold"
                  />
                  <div className="mt-3">
                    <InlineEditable
                      contentKey={`about_${card.id}_text`}
                      defaultValue={card.text}
                      as="p"
                      multiline
                      className="text-sm leading-7 text-neutral-600"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Start with a clear brief */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <InlineEditable
              contentKey="about_working_together_badge"
              defaultValue="Working together"
              as="p"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
            />

            <InlineEditable
              contentKey="about_brief_title"
              defaultValue="Start with a clear brief."
              as="h2"
              className="mt-3 text-3xl font-semibold tracking-tight"
            />

            <InlineEditable
              contentKey="about_brief_desc"
              defaultValue="Share your product, estimated quantity and branding requirements, and we will advise on production feasibility, lead times and estimated pricing."
              as="p"
              multiline
              className="mt-4 text-sm leading-7 text-neutral-600"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-neutral-950 px-5 py-3.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              REQUEST A QUOTE
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center border border-neutral-300 px-5 py-3.5 text-sm font-medium hover:bg-neutral-50"
            >
              Explore categories
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

