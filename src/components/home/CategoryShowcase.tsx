"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { getCategories } from "@/services/categories";
import type { Category } from "@/types/category";
import { revealUp, staggerContainer } from "@/lib/animations";
import InlineEditable from "@/components/ui/InlineEditable";

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const response = await getCategories();

        if (mounted && response.success) {
          const all = response.data || [];
          setAllCategories(all);

          // ONLY the main top-level season categories: Winter Essentials & Summer Essentials
          const topSeasons = all.filter(
            (category) => category.isActive && !category.parentId,
          );

          // Sort: Winter Essentials first (sortOrder 0/1), Summer Essentials second
          topSeasons.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

          // Strictly keep the main two
          setCategories(topSeasons.slice(0, 2));
        }
      } catch (error) {
        console.error("Failed to load categories on homepage:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  if (!loading && categories.length === 0) {
    return null;
  }

  return (
    <section
      id="categories"
      className="bg-[#f7f5f0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[1600px]">
        {/* Section Heading */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-9 flex flex-col gap-6 sm:mb-11 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <motion.p
              variants={revealUp}
              className="mb-3 text-[9px] font-medium uppercase tracking-[0.38em] text-[#756e64] sm:text-[10px]"
            >
              <InlineEditable
                contentKey="home_category_eyebrow"
                defaultValue="Wholesale Sourcing Catalogue"
              />
            </motion.p>

            <motion.h2
              variants={revealUp}
              className="font-serif text-[38px] font-normal leading-none tracking-[-0.025em] text-[#171717] sm:text-[48px] lg:text-[54px]"
            >
              <InlineEditable
                contentKey="home_category_headline"
                defaultValue="Shop by Category"
              />
            </motion.h2>
          </div>

          <motion.div variants={revealUp}>
            <Link
              href="/categories"
              className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.07em] text-[#222]"
            >
              <InlineEditable
                contentKey="home_category_explore_link"
                defaultValue="Explore All Collections"
              />
              <ArrowRight
                size={15}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Structured Loading Skeleton: 2 Main Season Cards */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="relative aspect-[1.3/1] sm:aspect-[1.18/1] lg:aspect-[1.14/1] animate-pulse bg-[#dfd7cc] p-6 sm:p-8 lg:p-10 flex flex-col justify-end"
              >
                <div className="h-3 w-28 rounded-xs bg-black/10 mb-2" />
                <div className="h-8 w-60 max-w-[80%] rounded-xs bg-black/15 mb-4" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded-xs bg-black/10" />
                  <div className="h-5 w-20 rounded-xs bg-black/10" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Exactly The Main Two Categories: Winter Essentials and Summer Essentials */
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2"
          >
            {categories.map((category) => {
              // Find child categories / lines for this season
              const subcats = allCategories.filter(
                (c) => c.parentId === category.id && c.isActive,
              );

              return (
                <motion.article
                  key={category.id}
                  variants={revealUp}
                  className="group"
                >
                  <Link
                    href={`/categories/${category.slug}`}
                    className="relative block aspect-[1.3/1] sm:aspect-[1.18/1] lg:aspect-[1.14/1] overflow-hidden bg-[#e8e2d8]"
                  >
                    {category.imageUrl ? (
                      <motion.img
                        src={category.imageUrl}
                        alt={category.name}
                        className="absolute inset-0 h-full w-full object-cover"
                        whileHover={{ scale: 1.04 }}
                        transition={{
                          duration: 0.7,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-linear-to-b from-[#dfd7cc] to-[#cfc6b8]" />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5 opacity-85 transition-opacity duration-500 group-hover:opacity-95" />

                    {/* Category Details at Bottom */}
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
                        Season Collection
                      </p>

                      <h3 className="mt-1 font-serif text-[32px] font-normal leading-tight text-white sm:text-[40px] lg:text-[44px]">
                        {category.name}
                      </h3>

                      {/* Featured Apparel Lines */}
                      {subcats.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-white/85">
                          <span className="text-[10px] uppercase tracking-wider text-white/60">
                            Lines:
                          </span>
                          {subcats.map((sub) => (
                            <span
                              key={sub.id}
                              className="rounded-xs bg-white/20 px-2 py-0.5 text-[11px] backdrop-blur-xs font-medium text-white"
                            >
                              {sub.name}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white">
                        <span>
                          <InlineEditable
                            contentKey="home_category_card_cta"
                            defaultValue="Explore Collection"
                          />
                        </span>
                        <ArrowUpRight
                          size={14}
                          strokeWidth={1.5}
                          className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
