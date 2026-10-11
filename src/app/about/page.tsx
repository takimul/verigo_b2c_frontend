import Link from "next/link";
import { ArrowRight, Check, Compass, Handshake, Package } from "lucide-react";

const principles = [
  {
    icon: Package,
    title: "Product-focused",
    text: "Product specifications, materials, sizing, and order requirements matter at every stage of a wholesale project.",
  },
  {
    icon: Handshake,
    title: "Built around collaboration",
    text: "Clear requirements and communication help buyers and suppliers understand expectations.",
  },
  {
    icon: Compass,
    title: "Practical solutions",
    text: "Every inquiry starts with understanding the product, quantity, customization needs, and intended use.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            About Verigo Essential
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Wholesale apparel, shaped around your business.
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
            Verigo Essential helps wholesale buyers explore apparel products,
            understand product specifications, and discuss customization and
            bulk order requirements through a straightforward inquiry process.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 bg-neutral-950 px-5 py-3.5 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Explore our collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            What we focus on
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Making wholesale inquiries clearer.
          </h2>
        </div>

        <div className="space-y-5 text-sm leading-7 text-neutral-600">
          <p>
            Finding the right apparel product involves more than choosing a
            style. Buyers may need to compare fabric, GSM, composition, size
            ranges, colors, minimum order quantities, and customization options.
          </p>

          <p>
            Our product catalog brings these details together so buyers can
            review available information and send inquiries with their
            requirements.
          </p>

          <p>
            Whether you are exploring existing products or discussing an OEM/ODM
            project, the aim is to make the initial conversation focused on the
            details that matter to your business.
          </p>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Our approach
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Three principles
          </h2>

          <div className="mt-8 grid gap-px border border-neutral-200 bg-neutral-200 md:grid-cols-3">
            {principles.map((principle, index) => {
              const Icon = principle.icon;

              return (
                <article key={principle.title} className="bg-white p-6 sm:p-8">
                  <Icon size={27} strokeWidth={1.4} />
                  <p className="mt-6 text-xs text-neutral-400">0{index + 1}</p>
                  <h3 className="mt-2 text-lg font-semibold">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">
                    {principle.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Working together
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Start with a clear brief.
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Share your intended product, estimated quantity, specifications,
              and branding requirements. This gives our team a starting point
              for discussing your inquiry.
            </p>
          </div>

          <div className="border border-neutral-200 p-6 sm:p-8">
            {[
              "Product type and specifications",
              "Estimated quantity and size breakdown",
              "Fabric, colors, and customization",
              "Contact details and delivery requirements",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-3 border-b border-neutral-100 py-3 last:border-0"
              >
                <Check size={17} className="mt-0.5 shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}

            <Link
              href="/inquiry"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
            >
              Send an inquiry <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
