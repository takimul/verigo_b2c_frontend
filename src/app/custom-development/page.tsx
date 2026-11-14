"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import InlineEditable from "@/components/ui/InlineEditable";

const customizationItems = [
  {
    key: "fabric",
    defaultTitle: "Custom Fabric",
    defaultDesc: "Fabric and GSM matched to your specification.",
  },
  {
    key: "color",
    defaultTitle: "Custom Color",
    defaultDesc: "Colors matched to your brand.",
  },
  {
    key: "printing",
    defaultTitle: "Custom Printing",
    defaultDesc: "Your artwork, printed to order.",
  },
  {
    key: "embroidery",
    defaultTitle: "Custom Embroidery",
    defaultDesc: "Embroidered logos and details.",
  },
  {
    key: "neck_label",
    defaultTitle: "Custom Neck Label",
    defaultDesc: "Your brand label on every piece.",
  },
  {
    key: "packaging",
    defaultTitle: "Custom Packaging",
    defaultDesc: "Branded bags, tags and packaging.",
  },
];

export default function CustomDevelopmentPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      {/* Intro Hero */}
      <section className="border-b border-neutral-200 bg-[#f7f5f0]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            <InlineEditable
              contentKey="custom_dev_eyebrow"
              defaultValue="CUSTOM DEVELOPMENT"
            />
          </p>

          <InlineEditable
            contentKey="custom_dev_headline"
            defaultValue="Your vision. Our expertise."
            as="h1"
            className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          />

          <InlineEditable
            contentKey="custom_dev_description"
            defaultValue="From concept to finished garment, we help brands develop apparel tailored to their specifications. Together with our partner factories, we help you customize the details that make your collection uniquely yours."
            as="p"
            multiline
            className="mt-6 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8"
          />

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-neutral-950 px-6 py-3.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              <InlineEditable
                contentKey="custom_dev_cta_primary"
                defaultValue="START YOUR PROJECT"
              />{" "}
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/categories"
              className="inline-flex items-center justify-center border border-neutral-300 px-6 py-3.5 text-sm font-medium hover:bg-white"
            >
              <InlineEditable
                contentKey="custom_dev_cta_secondary"
                defaultValue="Explore categories"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Options List */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            <InlineEditable
              contentKey="custom_dev_services_eyebrow"
              defaultValue="Customization services"
            />
          </p>
          <InlineEditable
            contentKey="custom_dev_services_headline"
            defaultValue="Tailored to your exact specifications"
            as="h2"
            className="mt-3 text-3xl font-semibold tracking-tight"
          />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customizationItems.map((item) => (
            <div
              key={item.key}
              className="flex items-start gap-4 border border-neutral-200 bg-neutral-50 p-6"
            >
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white">
                <Check size={13} strokeWidth={2.5} />
              </div>

              <div>
                <h3 className="text-base font-semibold text-neutral-950">
                  <InlineEditable
                    contentKey={`custom_item_title_${item.key}`}
                    defaultValue={item.defaultTitle}
                  />
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-neutral-600">
                  <InlineEditable
                    contentKey={`custom_item_desc_${item.key}`}
                    defaultValue={item.defaultDesc}
                    multiline
                  />
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs italic text-neutral-500">
          <InlineEditable
            contentKey="custom_dev_disclaimer"
            defaultValue="All customization is subject to order quantity and factory confirmation."
          />
        </p>

        {/* Bottom Section */}
        <div className="mt-14 border-t border-neutral-200 pt-8">
          <InlineEditable
            contentKey="custom_dev_bottom_text"
            defaultValue="Developing a new collection or scaling an existing one? Tell us what you need and we will coordinate it with our partner factories."
            as="p"
            multiline
            className="max-w-3xl text-sm leading-7 text-neutral-700 sm:text-base"
          />
        </div>
      </section>
    </main>
  );
}
