"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { getPublicSettings } from "@/services/settings";
import type { SiteSettings } from "@/types/settings";
import { revealUp, staggerContainer } from "@/lib/animations";
import InlineEditable from "@/components/ui/InlineEditable";

export default function Hero() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const response = await getPublicSettings();

        if (mounted && response.success) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to load homepage settings:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const bannerImage = settings?.bannerImageUrl ?? null;
  const tagline =
    settings?.tagline || "ESSENTIAL APPAREL, SOURCED FROM BANGLADESH.";

  return (
    <section className="relative min-h-[calc(100svh-110px)] overflow-hidden bg-[#171717] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        {bannerImage ? (
          <motion.img
            src={bannerImage}
            alt={settings?.siteName ?? "Verigo Essential"}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[#292725]" />
        )}

        {/* Editorial image treatment */}
        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-black/15" />

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-110px)] max-w-[1600px] flex-col justify-between px-5 pb-7 pt-20 sm:px-8 sm:pb-9 sm:pt-24 lg:px-12 lg:pb-10 lg:pt-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-225"
        >
          <motion.div variants={revealUp}>
            <InlineEditable
              contentKey="hero_badge"
              defaultValue="APPAREL SOURCING & EXPORT"
              as="p"
              className="mb-5 text-[9px] font-medium uppercase tracking-[0.4em] text-white/80 sm:text-[10px]"
            />
          </motion.div>

          <motion.div variants={revealUp}>
            <InlineEditable
              contentKey="hero_headline"
              defaultValue="Quality apparel, sourced for your brand."
              as="h1"
              multiline
              className="max-w-225 font-serif text-[46px] font-normal leading-[0.94] tracking-[-0.035em] text-white sm:text-[62px] md:text-[74px] lg:text-[88px] xl:text-[98px]"
            />
          </motion.div>

          <motion.div variants={revealUp}>
            <InlineEditable
              contentKey="hero_description"
              defaultValue="We work with trusted partner factories to supply a wide range of apparel to wholesale buyers and brands."
              as="p"
              multiline
              className="mt-6 max-w-140 text-[13px] leading-6 text-white/85 sm:text-[14px] sm:leading-7"
            />
          </motion.div>

          <motion.div variants={revealUp} className="mt-8 flex items-center">
            <Link
              href="/contact"
              className="group inline-flex w-fit items-center justify-center gap-3 bg-white px-7 py-4 text-[10px] font-medium uppercase tracking-[0.11em] text-[#171717] transition-colors duration-300 hover:bg-[#eeebe4]"
            >
              REQUEST A QUOTE
              <ArrowUpRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Bottom information */}
        <div className="grid gap-8 border-t border-white/20 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-[8px] uppercase tracking-[0.25em] text-white/50">
              {loading ? "Loading" : settings?.siteName || "Verigo Essential"}
            </p>

            <p className="mt-2 max-w-125 text-[11px] font-medium uppercase tracking-[0.16em] text-white/85 sm:text-[12px]">
              {tagline}
            </p>
          </div>

          <a
            href="#categories"
            className="group hidden items-center gap-3 text-[9px] font-medium uppercase tracking-[0.18em] text-white/60 transition-colors duration-300 hover:text-white sm:flex"
          >
            Scroll to explore
            <ArrowDown size={13} strokeWidth={1.2} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
