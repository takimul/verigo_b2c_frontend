"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import { revealUp, staggerContainer } from "@/lib/animations";
import InlineEditable from "@/components/ui/InlineEditable";

export default function InquiryBanner() {
  return (
    <section className="overflow-hidden bg-[#eeebe4] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1600px]">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative overflow-hidden border border-[#d5d0c7] bg-[#f7f5f0] px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20"
        >
          {/* Decorative typography */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -top-8 select-none font-serif text-[130px] font-normal leading-none tracking-[-0.08em] text-[#e8e4dc] sm:text-[190px] lg:-right-8 lg:-top-14 lg:text-[270px]"
          >
            VE
          </div>

          <div className="relative z-10 max-w-225">
            <motion.div variants={revealUp}>
              <InlineEditable
                contentKey="banner_headline"
                defaultValue="Have a collection in mind?"
                as="h2"
                multiline
                className="max-w-[850px] font-serif text-[42px] font-normal leading-[0.98] tracking-[-0.035em] text-[#171717] sm:text-[56px] lg:text-[72px]"
              />
            </motion.div>

            <motion.div variants={revealUp}>
              <InlineEditable
                contentKey="banner_paragraph"
                defaultValue="Tell us about your products, quantities and branding requirements. We will find the right factory and send you a quote."
                as="p"
                multiline
                className="mt-6 max-w-[620px] text-[13px] leading-7 text-[#68635c] sm:text-[14px] sm:leading-8"
              />
            </motion.div>

            <motion.div
              variants={revealUp}
              className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Link
                href="/contact"
                className="group inline-flex w-fit items-center justify-center gap-3 bg-[#171717] px-7 py-4 text-[10px] font-medium uppercase tracking-[0.11em] text-[#f7f5f0] transition-all duration-300 hover:bg-[#302f2c]"
              >
                REQUEST A QUOTE
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              <Link
                href="/categories"
                className="group inline-flex w-fit items-center gap-3 px-2 py-3 text-[10px] font-medium uppercase tracking-[0.11em] text-[#292725]"
              >
                EXPLORE PRODUCTS
                <ArrowRight
                  size={14}
                  strokeWidth={1.4}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </div>

          {/* Three small lines */}
          <motion.div
            variants={revealUp}
            className="relative z-10 mt-14 grid max-w-225 border-t border-[#d9d4cb] pt-6 sm:mt-16 sm:grid-cols-3"
          >
            <div className="pb-5 sm:pb-0 sm:pr-6">
              <p className="text-[9px] uppercase tracking-[0.18em] text-[#8a847b]">
                Wholesale
              </p>
              <p className="mt-2 text-[11px] text-[#3e3a35]">
                Built for growing brands
              </p>
            </div>

            <div className="border-t border-[#d9d4cb] py-5 sm:border-l sm:border-t-0 sm:px-6 sm:py-0">
              <p className="text-[9px] uppercase tracking-[0.18em] text-[#8a847b]">
                Custom Development
              </p>
              <p className="mt-2 text-[11px] text-[#3e3a35]">
                Your design, our sourcing
              </p>
            </div>

            <div className="border-t border-[#d9d4cb] pt-5 sm:border-l sm:border-t-0 sm:px-6 sm:pt-0">
              <p className="text-[9px] uppercase tracking-[0.18em] text-[#8a847b]">
                Sourcing
              </p>
              <p className="mt-2 text-[11px] text-[#3e3a35]">
                Quality checked
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
