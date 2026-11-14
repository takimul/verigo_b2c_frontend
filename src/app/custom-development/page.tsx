import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata = {
  title: "Custom Development",
  description:
    "Custom apparel development tailored to your brand specifications with our partner factories in Bangladesh.",
};

const customizationItems = [
  {
    title: "Custom Fabric",
    description: "Fabric and GSM matched to your specification.",
  },
  {
    title: "Custom Color",
    description: "Colors matched to your brand.",
  },
  {
    title: "Custom Printing",
    description: "Your artwork, printed to order.",
  },
  {
    title: "Custom Embroidery",
    description: "Embroidered logos and details.",
  },
  {
    title: "Custom Neck Label",
    description: "Your brand label on every piece.",
  },
  {
    title: "Custom Packaging",
    description: "Branded bags, tags and packaging.",
  },
];

export default function CustomDevelopmentPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      {/* Intro Hero */}
      <section className="border-b border-neutral-200 bg-[#f7f5f0]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            CUSTOM DEVELOPMENT
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Your vision. Our expertise.
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
            From concept to finished garment, we help brands develop apparel
            tailored to their specifications. Together with our partner
            factories, we help you customize the details that make your
            collection uniquely yours.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-neutral-950 px-6 py-3.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              START YOUR PROJECT <ArrowRight size={16} />
            </Link>

            <Link
              href="/categories"
              className="inline-flex items-center justify-center border border-neutral-300 px-6 py-3.5 text-sm font-medium hover:bg-white"
            >
              Explore categories
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Options List */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Customization services
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Tailored to your exact specifications
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customizationItems.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 border border-neutral-200 bg-neutral-50 p-6"
            >
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white">
                <Check size={13} strokeWidth={2.5} />
              </div>

              <div>
                <h3 className="text-base font-semibold text-neutral-950">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-neutral-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs italic text-neutral-500">
          All customization is subject to order quantity and factory confirmation.
        </p>

        {/* Bottom Section */}
        <div className="mt-14 border-t border-neutral-200 pt-8">
          <p className="max-w-3xl text-sm leading-7 text-neutral-700 sm:text-base">
            Developing a new collection or scaling an existing one? Tell us what
            you need and we will coordinate it with our partner factories.
          </p>
        </div>
      </section>
    </main>
  );
}

