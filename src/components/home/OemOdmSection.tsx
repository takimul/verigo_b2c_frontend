"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Package,
  Palette,
  PenTool,
  Shirt,
  Tags,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

import { revealUp, staggerContainer } from "@/lib/animations";

const capabilities = [
  {
    title: "Custom Fabric",
    description:
      "Develop fabric specifications tailored to your product requirements.",
    icon: Shirt,
  },
  {
    title: "Custom Color",
    description:
      "Match your brand identity with customized colors and fabric tones.",
    icon: Palette,
  },
  {
    title: "Custom Printing",
    description:
      "Create branded garments with your preferred printing techniques.",
    icon: PenTool,
  },
  {
    title: "Custom Embroidery",
    description:
      "Add refined embroidered branding, artwork and details to your garments.",
    icon: Sparkles,
  },
  {
    title: "Custom Neck Label",
    description:
      "Build a consistent branded experience with customized neck labels.",
    icon: Tags,
  },
  {
    title: "Custom Packaging",
    description:
      "Complete your brand presentation with packaging designed around your needs.",
    icon: Package,
  },
];

export default function OemOdmSection() {
  return (
    <section className="overflow-hidden bg-[#f7f5f0] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1600px]">
        {/* Intro */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
        >
          <div>
            <motion.p
              variants={revealUp}
              className="mb-4 text-[9px] font-medium uppercase tracking-[0.38em] text-[#756e64] sm:text-[10px]"
            >
              OEM / ODM
            </motion.p>

            <motion.h2
              variants={revealUp}
              className="max-w-[700px] font-serif text-[42px] font-normal leading-[0.98] tracking-[-0.03em] text-[#171717] sm:text-[54px] lg:text-[68px]"
            >
              Your vision.
              <br />
              Our expertise.
            </motion.h2>
          </div>

          <motion.div
            variants={revealUp}
            className="max-w-[650px] lg:justify-self-end"
          >
            <p className="text-[14px] leading-7 text-[#5f5a53] sm:text-[15px] sm:leading-8">
              From concept to finished garment, we help brands develop apparel
              tailored to their specifications. Our manufacturing capabilities
              allow you to customize the details that make your collection
              uniquely yours.
            </p>

            <Link
              href="/contact"
              className="group mt-7 inline-flex items-center gap-3 border-b border-[#292929] pb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#171717]"
            >
              Start Your Project
              <ArrowRight
                size={14}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Capability grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="mt-16 grid border-t border-[#d9d4cb] sm:mt-20 sm:grid-cols-2 lg:grid-cols-3"
        >
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;

            return (
              <motion.article
                key={capability.title}
                variants={revealUp}
                className={[
                  "group relative border-b border-[#d9d4cb] py-8 sm:px-7",
                  index % 2 === 0 ? "sm:border-r" : "",
                  index % 3 !== 2 ? "lg:border-r" : "",
                  "lg:px-8 lg:py-10",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex h-10 w-10 items-center justify-center border border-[#d5d0c7] transition-colors duration-300 group-hover:border-[#171717]">
                    <Icon
                      size={17}
                      strokeWidth={1.2}
                      className="text-[#35322e]"
                    />
                  </div>

                  <span className="text-[9px] tracking-[0.15em] text-[#aaa39a]">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-8 text-[15px] font-medium tracking-[-0.01em] text-[#171717]">
                  {capability.title}
                </h3>

                <p className="mt-3 max-w-[360px] text-[11px] leading-6 text-[#777169]">
                  {capability.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#817a70]">
                  <Check size={12} strokeWidth={1.5} />
                  Available for custom development
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Bottom statement */}
        <motion.div
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 border-t border-[#d9d4cb] pt-8 sm:mt-16 sm:flex sm:items-center sm:justify-between"
        >
          <p className="max-w-[650px] text-[11px] leading-6 text-[#777169]">
            Whether you are developing a new collection or scaling an existing
            one, our team works around your specifications, branding and
            production requirements.
          </p>

          <Link
            href="/contact"
            className="group mt-6 inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-widest text-[#171717] sm:mt-0"
          >
            Discuss Your Requirements
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
