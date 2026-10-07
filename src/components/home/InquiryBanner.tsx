"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "motion/react";

import { revealUp, staggerContainer } from "@/lib/animations";

export default function InquiryBanner() {
  return (
    <section className="overflow-hidden bg-[#eeebe4] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
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

          <div className="relative z-10 max-w-[900px]">
            <motion.div variants={revealUp}>
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center border border-[#d2ccc2]">
                  <MessageCircle
                    size={15}
                    strokeWidth={1.3}
                    className="text-[#34312d]"
                  />
                </span>

                <span className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#756e64]">
                  Start a Conversation
                </span>
              </div>
            </motion.div>

            <motion.h2
              variants={revealUp}
              className="max-w-[850px] font-serif text-[43px] font-normal leading-[0.98] tracking-[-0.035em] text-[#171717] sm:text-[58px] lg:text-[76px]"
            >
              Have a collection
              <br />
              in mind?
            </motion.h2>

            <motion.p
              variants={revealUp}
              className="mt-7 max-w-[620px] text-[13px] leading-7 text-[#68635c] sm:text-[14px] sm:leading-8"
            >
              Tell us about your products, quantities, branding requirements and
              production needs. Our team will help you explore the right
              manufacturing approach.
            </motion.p>

            <motion.div
              variants={revealUp}
              className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Link
                href="/contact"
                className="group inline-flex w-fit items-center justify-center gap-4 bg-[#171717] px-7 py-4 text-[10px] font-medium uppercase tracking-[0.11em] text-[#f7f5f0] transition-all duration-300 hover:bg-[#302f2c]"
              >
                Send an Inquiry
                <ArrowRight
                  size={14}
                  strokeWidth={1.4}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/products"
                className="group inline-flex w-fit items-center gap-3 px-2 py-3 text-[10px] font-medium uppercase tracking-[0.11em] text-[#292725]"
              >
                Explore Products
                <ArrowRight
                  size={14}
                  strokeWidth={1.4}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </div>

          {/* Bottom information */}
          <motion.div
            variants={revealUp}
            className="relative z-10 mt-14 grid max-w-[900px] border-t border-[#d9d4cb] pt-6 sm:mt-16 sm:grid-cols-3"
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
                OEM / ODM
              </p>
              <p className="mt-2 text-[11px] text-[#3e3a35]">
                Custom development
              </p>
            </div>

            <div className="border-t border-[#d9d4cb] pt-5 sm:border-l sm:border-t-0 sm:px-6 sm:pt-0">
              <p className="text-[9px] uppercase tracking-[0.18em] text-[#8a847b]">
                Production
              </p>
              <p className="mt-2 text-[11px] text-[#3e3a35]">
                Specification driven
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
