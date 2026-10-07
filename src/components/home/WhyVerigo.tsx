"use client";

import Link from "next/link";
import {
  ArrowRight,
  Globe2,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

import { revealUp, staggerContainer } from "@/lib/animations";

const reasons = [
  {
    number: "01",
    title: "Quality Focused",
    description:
      "We maintain a quality-first approach across materials, construction and finishing.",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "Built for Brands",
    description:
      "Our production approach is designed around the specifications and identity of each brand.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Flexible Development",
    description:
      "From product details to branding elements, we support custom requirements throughout development.",
    icon: Layers3,
  },
  {
    number: "04",
    title: "Global Outlook",
    description:
      "We work with a wholesale mindset focused on consistent production and long-term relationships.",
    icon: Globe2,
  },
];

export default function WhyVerigo() {
  return (
    <section className="overflow-hidden bg-[#171717] px-5 py-20 text-[#f7f5f0] sm:px-8 sm:py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1600px]">
        {/* Heading */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end"
        >
          <div>
            <motion.p
              variants={revealUp}
              className="mb-4 text-[9px] font-medium uppercase tracking-[0.38em] text-[#a8a197]"
            >
              Why Verigo
            </motion.p>

            <motion.h2
              variants={revealUp}
              className="max-w-[700px] font-serif text-[42px] font-normal leading-[0.98] tracking-[-0.03em] sm:text-[54px] lg:text-[68px]"
            >
              Made with purpose.
              <br />
              Built for brands.
            </motion.h2>
          </div>

          <motion.p
            variants={revealUp}
            className="max-w-[600px] text-[14px] leading-7 text-[#b8b1a8] sm:text-[15px] sm:leading-8 lg:justify-self-end"
          >
            We combine apparel manufacturing expertise with a detail-driven
            approach to help brands create products that feel considered from
            the first specification to the finished garment.
          </motion.p>
        </motion.div>

        {/* Reasons */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16 grid border-t border-[#3a3937] sm:mt-20 sm:grid-cols-2 lg:grid-cols-4"
        >
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <motion.article
                key={reason.number}
                variants={revealUp}
                className={[
                  "group border-b border-[#3a3937] py-8",
                  index < 3 ? "lg:border-r" : "",
                  index % 2 === 0 ? "sm:border-r lg:px-8" : "sm:px-8",
                  "lg:py-10",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] tracking-[0.18em] text-[#817b73]">
                    {reason.number}
                  </span>

                  <Icon
                    size={18}
                    strokeWidth={1.2}
                    className="text-[#aaa39a] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                  />
                </div>

                <h3 className="mt-10 text-[15px] font-medium text-[#f4f1eb]">
                  {reason.title}
                </h3>

                <p className="mt-3 max-w-[260px] text-[11px] leading-6 text-[#918b83]">
                  {reason.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 flex flex-col gap-7 border-t border-[#3a3937] pt-8 sm:mt-16 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-[560px] text-[11px] leading-6 text-[#918b83]">
            Looking for a manufacturing partner for your next collection?
            Let&apos;s talk about your requirements.
          </p>

          <Link
            href="/contact"
            className="group inline-flex w-fit items-center gap-3 border border-[#777169] px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[#f7f5f0] transition-all duration-300 hover:border-[#f7f5f0] hover:bg-[#f7f5f0] hover:text-[#171717]"
          >
            Talk to Our Team
            <ArrowRight
              size={14}
              strokeWidth={1.4}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
