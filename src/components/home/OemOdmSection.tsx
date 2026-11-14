"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";

import { revealUp, staggerContainer } from "@/lib/animations";
import InlineEditable from "@/components/ui/InlineEditable";

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

export default function OemOdmSection() {
  return (
    <section className="overflow-hidden bg-[#f7f5f0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1600px]">
        {/* Intro */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
        >
          <div>
            <motion.div variants={revealUp}>
              <InlineEditable
                contentKey="custom_dev_badge"
                defaultValue="CUSTOM DEVELOPMENT"
                as="p"
                className="mb-3 text-[9px] font-medium uppercase tracking-[0.38em] text-[#756e64] sm:text-[10px]"
              />
            </motion.div>

            <motion.div variants={revealUp}>
              <InlineEditable
                contentKey="custom_dev_headline"
                defaultValue="Your vision. Our expertise."
                as="h2"
                multiline
                className="max-w-[700px] font-serif text-[40px] font-normal leading-[1] tracking-[-0.03em] text-[#171717] sm:text-[50px] lg:text-[62px]"
              />
            </motion.div>
          </div>

          <motion.div
            variants={revealUp}
            className="max-w-[650px] lg:justify-self-end"
          >
            <InlineEditable
              contentKey="custom_dev_description"
              defaultValue="From concept to finished garment, we help brands develop apparel tailored to their specifications. Together with our partner factories, we help you customize the details that make your collection uniquely yours."
              as="p"
              multiline
              className="text-[13px] leading-7 text-[#5f5a53] sm:text-[14px] sm:leading-8"
            />

            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-3 border-b border-[#292929] pb-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#171717]"
            >
              START YOUR PROJECT
              <ArrowRight
                size={14}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Short one-line list of custom options */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="mt-12 grid border-t border-[#d9d4cb] sm:grid-cols-2 lg:grid-cols-3"
        >
          {customizationItems.map((item, index) => (
            <motion.div
              key={item.title}
              variants={revealUp}
              className={[
                "flex items-start gap-3.5 border-b border-[#d9d4cb] py-5 sm:px-6",
                index % 2 === 0 ? "sm:border-r" : "",
                index % 3 !== 2 ? "lg:border-r" : "",
                "lg:py-6",
              ].join(" ")}
            >
              <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white">
                <Check size={11} strokeWidth={2.5} />
              </div>

              <div>
                <h3 className="text-[13px] font-medium text-[#171717]">
                  {item.title}
                </h3>
                <p className="mt-1 text-[11px] leading-5 text-[#777169]">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Small note */}
        <motion.p
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-6 text-[11px] italic text-[#8a847b]"
        >
          All customization is subject to order quantity and factory confirmation.
        </motion.p>

        {/* Bottom paragraph (without Discuss Your Requirements button) */}
        <motion.div
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 border-t border-[#d9d4cb] pt-6"
        >
          <p className="max-w-[780px] text-[12px] leading-6 text-[#68635c] sm:text-[13px]">
            Developing a new collection or scaling an existing one? Tell us what
            you need and we will coordinate it with our partner factories.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
