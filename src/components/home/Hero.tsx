"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import { imageReveal, revealUp, staggerContainer } from "@/lib/animations";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100svh-76px)] overflow-hidden bg-[#e8e1d7]">
      {/* Background Image */}
      <motion.div
        variants={imageReveal}
        initial="hidden"
        animate="visible"
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2200&q=85"
          alt="Verigo Essential premium apparel"
          className="h-full w-full object-cover object-center"
        />
      </motion.div>

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#17120e]/65 via-[#17120e]/20 to-transparent" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[calc(100svh-76px)] max-w-[1600px] items-end px-5 pb-14 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-[760px] text-white"
        >
          <motion.p
            variants={revealUp}
            className="mb-5 text-[10px] font-medium uppercase tracking-[0.38em] text-white/80 sm:text-[11px]"
          >
            Premium Apparel Manufacturer
          </motion.p>

          <motion.h1
            variants={revealUp}
            className="max-w-[760px] font-serif text-[42px] font-normal leading-[0.98] tracking-[-0.025em] sm:text-[58px] md:text-[70px] lg:text-[82px]"
          >
            Quality Apparel
            <br />
            for Global Brands
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="mt-6 max-w-[520px] text-[13px] leading-6 text-white/85 sm:text-[14px]"
          >
            We manufacture high-quality apparel for men, women and kids,
            combining thoughtful design, reliable production and global
            wholesale solutions.
          </motion.p>

          <motion.div variants={revealUp} className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="group inline-flex items-center gap-4 bg-white px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[#111] transition-all duration-300 hover:bg-[#f0ece5]"
            >
              Explore Collection
              <ArrowRight
                size={15}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/oem-odm"
              className="group inline-flex items-center gap-4 border border-white/60 px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              Our Services
              <ArrowUpRight
                size={15}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={revealUp}
            className="mt-10 flex gap-8 border-t border-white/25 pt-5 sm:gap-12"
          >
            <div>
              <p className="font-serif text-[27px]">10+</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-white/65">
                Years Experience
              </p>
            </div>

            <div>
              <p className="font-serif text-[27px]">30+</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-white/65">
                Global Clients
              </p>
            </div>

            <div>
              <p className="font-serif text-[27px]">100+</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-white/65">
                Apparel Styles
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Slide indicator */}
      <div className="absolute bottom-10 right-5 hidden flex-col gap-5 text-white sm:right-8 lg:flex lg:right-12">
        <span className="text-[11px]">01</span>

        <div className="h-px w-7 bg-white" />

        <span className="text-[11px] text-white/50">02</span>

        <span className="text-[11px] text-white/50">03</span>
      </div>
    </section>
  );
}
