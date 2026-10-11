import Link from "next/link";
import {
  ArrowRight,
  Check,
  Layers,
  PackageCheck,
  PenTool,
  Shirt,
} from "lucide-react";

const services = [
  {
    number: "01",
    icon: Shirt,
    title: "OEM manufacturing",
    description:
      "Manufacturing based on your designs, specifications, measurements, and material requirements.",
    details: [
      "Customer-provided designs",
      "Fabric and construction specifications",
      "Size and color requirements",
    ],
  },
  {
    number: "02",
    icon: PenTool,
    title: "ODM development",
    description:
      "Discuss product concepts and development requirements with our team to explore a suitable product direction.",
    details: [
      "Product concept discussions",
      "Design and specification planning",
      "Product development requirements",
    ],
  },
  {
    number: "03",
    icon: Layers,
    title: "Private labeling",
    description:
      "Explore branding options that help make products consistent with your brand identity.",
    details: [
      "Neck labels",
      "Custom printing and embroidery",
      "Packaging requirements",
    ],
  },
  {
    number: "04",
    icon: PackageCheck,
    title: "Bulk order planning",
    description:
      "Share your expected quantities, size breakdowns, colors, and delivery requirements for a wholesale quotation.",
    details: [
      "Minimum order quantity discussions",
      "Size and color breakdowns",
      "Order-specific requirements",
    ],
  },
];

export default function OemOdmPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <section className="border-b border-neutral-200">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
              Manufacturing partnerships
            </p>

            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Your product vision. Your brand. Your requirements.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
              Explore OEM and ODM apparel solutions with Verigo Essential. Share
              your designs, specifications, branding preferences, and order
              requirements so we can understand your project.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/inquiry"
                className="inline-flex items-center justify-center gap-2 bg-neutral-950 px-5 py-3.5 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Discuss your project <ArrowRight size={16} />
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center justify-center border border-neutral-300 px-5 py-3.5 text-sm font-medium hover:bg-neutral-50"
              >
                Explore products
              </Link>
            </div>
          </div>

          <div className="border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Start with your requirements
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Tell us what you want to make.
            </h2>

            <p className="mt-3 text-sm leading-6 text-neutral-600">
              The more details you share, the easier it is to understand your
              product requirements and discuss the next steps.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "Product type and reference images",
                "Fabric, GSM, and composition",
                "Sizes, colors, and estimated quantity",
                "Branding and packaging preferences",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <Check size={17} className="mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Our services
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Manufacturing support for your business
          </h2>

          <p className="mt-4 text-sm leading-7 text-neutral-600">
            Every project has different requirements. Choose the type of support
            you need and tell us about your intended product.
          </p>
        </div>

        <div className="mt-9 grid gap-px border border-neutral-200 bg-neutral-200 md:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.number}
                className="bg-white p-6 sm:p-8 lg:p-10"
              >
                <div className="flex items-start justify-between">
                  <Icon size={28} strokeWidth={1.4} />
                  <span className="text-xs tabular-nums text-neutral-400">
                    {service.number}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-semibold">{service.title}</h3>

                <p className="mt-3 text-sm leading-7 text-neutral-600">
                  {service.description}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {service.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2 text-sm text-neutral-700"
                    >
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-neutral-500"
                      />
                      {detail}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            How to get started
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            From requirements to quotation
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "Share your brief",
                text: "Tell us about your product, target market, and requirements.",
              },
              {
                number: "02",
                title: "Discuss specifications",
                text: "Clarify fabric, sizing, colors, branding, and quantities.",
              },
              {
                number: "03",
                title: "Review the proposal",
                text: "Discuss pricing, feasibility, and any relevant production details.",
              },
              {
                number: "04",
                title: "Confirm next steps",
                text: "Agree on the requirements and next steps for your project.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="border-t border-neutral-300 pt-5"
              >
                <p className="text-xs text-neutral-400">{step.number}</p>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/inquiry"
            className="mt-9 inline-flex items-center gap-2 bg-neutral-950 px-5 py-3.5 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Send your requirements <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
