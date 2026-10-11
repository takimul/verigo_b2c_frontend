// "use client";

// import Link from "next/link";
// import { ArrowRight, ArrowUpRight } from "lucide-react";
// import { motion } from "motion/react";

// import { imageReveal, revealUp, staggerContainer } from "@/lib/animations";

// export default function Hero() {
//   return (
//     <section className="relative min-h-[calc(100svh-76px)] overflow-hidden bg-[#e8e1d7]">
//       {/* Background Image */}
//       <motion.div
//         variants={imageReveal}
//         initial="hidden"
//         animate="visible"
//         className="absolute inset-0"
//       >
//         <img
//           src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2200&q=85"
//           alt="Verigo Essential premium apparel"
//           className="h-full w-full object-cover object-center"
//         />
//       </motion.div>

//       {/* Soft overlay */}
//       <div className="absolute inset-0 bg-linear-to-r from-[#17120e]/65 via-[#17120e]/20 to-transparent" />

//       {/* Content */}
//       <div className="relative mx-auto flex min-h-[calc(100svh-76px)] max-w-[1600px] items-end px-5 pb-14 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
//         <motion.div
//           variants={staggerContainer}
//           initial="hidden"
//           animate="visible"
//           className="max-w-[760px] text-white"
//         >
//           <motion.p
//             variants={revealUp}
//             className="mb-5 text-[10px] font-medium uppercase tracking-[0.38em] text-white/80 sm:text-[11px]"
//           >
//             Premium Apparel Manufacturer
//           </motion.p>

//           <motion.h1
//             variants={revealUp}
//             className="max-w-[760px] font-serif text-[42px] font-normal leading-[0.98] tracking-[-0.025em] sm:text-[58px] md:text-[70px] lg:text-[82px]"
//           >
//             Quality Apparel
//             <br />
//             for Global Brands
//           </motion.h1>

//           <motion.p
//             variants={revealUp}
//             className="mt-6 max-w-[520px] text-[13px] leading-6 text-white/85 sm:text-[14px]"
//           >
//             We manufacture high-quality apparel for men, women and kids,
//             combining thoughtful design, reliable production and global
//             wholesale solutions.
//           </motion.p>

//           <motion.div variants={revealUp} className="mt-8 flex flex-wrap gap-3">
//             <Link
//               href="/products"
//               className="group inline-flex items-center gap-4 bg-white px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[#111] transition-all duration-300 hover:bg-[#f0ece5]"
//             >
//               Explore Collection
//               <ArrowRight
//                 size={15}
//                 strokeWidth={1.5}
//                 className="transition-transform duration-300 group-hover:translate-x-1"
//               />
//             </Link>

//             <Link
//               href="/oem-odm"
//               className="group inline-flex items-center gap-4 border border-white/60 px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-white hover:bg-white/10"
//             >
//               Our Services
//               <ArrowUpRight
//                 size={15}
//                 strokeWidth={1.5}
//                 className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
//               />
//             </Link>
//           </motion.div>

//           {/* Stats */}
//           <motion.div
//             variants={revealUp}
//             className="mt-10 flex gap-8 border-t border-white/25 pt-5 sm:gap-12"
//           >
//             <div>
//               <p className="font-serif text-[27px]">10+</p>
//               <p className="mt-1 text-[9px] uppercase tracking-widest text-white/65">
//                 Years Experience
//               </p>
//             </div>

//             <div>
//               <p className="font-serif text-[27px]">30+</p>
//               <p className="mt-1 text-[9px] uppercase tracking-widest text-white/65">
//                 Global Clients
//               </p>
//             </div>

//             <div>
//               <p className="font-serif text-[27px]">100+</p>
//               <p className="mt-1 text-[9px] uppercase tracking-widest text-white/65">
//                 Apparel Styles
//               </p>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Slide indicator */}
//       <div className="absolute bottom-10 right-5 hidden flex-col gap-5 text-white sm:right-8 lg:flex lg:right-12">
//         <span className="text-[11px]">01</span>

//         <div className="h-px w-7 bg-white" />

//         <span className="text-[11px] text-white/50">02</span>

//         <span className="text-[11px] text-white/50">03</span>
//       </div>
//     </section>
//   );
// }

"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { getPublicSettings } from "@/services/settings";
import type { SiteSettings } from "@/types/settings";
import { revealUp, staggerContainer } from "@/lib/animations";

export default function Hero() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const response = await getPublicSettings();

        if (mounted) {
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

  return (
    <section className="relative min-h-[calc(100svh-76px)] overflow-hidden bg-[#171717] text-white">
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
        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/35 to-black/10" />

        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-76px)] max-w-[1600px] flex-col justify-between px-5 pb-7 pt-20 sm:px-8 sm:pb-9 sm:pt-24 lg:px-12 lg:pb-10 lg:pt-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-225"
        >
          <motion.p
            variants={revealUp}
            className="mb-5 text-[9px] font-medium uppercase tracking-[0.4em] text-white/70 sm:text-[10px]"
          >
            Premium Apparel Manufacturer
          </motion.p>

          <motion.h1
            variants={revealUp}
            className="max-w-225 font-serif text-[48px] font-normal leading-[0.92] tracking-[-0.04em] text-white sm:text-[64px] md:text-[76px] lg:text-[92px] xl:text-[104px]"
          >
            Quality apparel
            <br />
            for global brands.
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="mt-7 max-w-140 text-[13px] leading-6 text-white/75 sm:text-[14px] sm:leading-7"
          >
            From carefully selected materials to custom branding and production,
            we create apparel around your specifications.
          </motion.p>

          <motion.div
            variants={revealUp}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/products"
              className="group inline-flex w-fit items-center justify-center gap-4 bg-white px-6 py-4 text-[10px] font-medium uppercase tracking-[0.11em] text-[#171717] transition-colors duration-300 hover:bg-[#eeebe4]"
            >
              Explore Collection
              <ArrowRight
                size={14}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/contact"
              className="group inline-flex w-fit items-center justify-center gap-3 border border-white/50 px-6 py-4 text-[10px] font-medium uppercase tracking-[0.11em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-[#171717]"
            >
              Start an Inquiry
            </Link>
          </motion.div>
        </motion.div>

        {/* Bottom information */}
        <div className="grid gap-8 border-t border-white/20 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-[8px] uppercase tracking-[0.25em] text-white/45">
              {loading ? "Loading" : settings?.siteName || "Verigo Essential"}
            </p>

            <p className="mt-2 max-w-125 text-[12px] text-white/80 sm:text-[13px]">
              {settings?.tagline ||
                "Premium apparel manufacturing for global brands."}
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
