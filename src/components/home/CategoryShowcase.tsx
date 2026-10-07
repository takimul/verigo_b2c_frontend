// const categories = [
//   {
//     name: "Men",
//     href: "/categories/men",
//     image:
//       "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1400&q=85",
//   },
//   {
//     name: "Women",
//     href: "/categories/women",
//     image:
//       "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1400&q=85",
//   },
//   {
//     name: "Kids",
//     href: "/categories/kids",
//     image:
//       "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1400&q=85",
//   },
// ];
"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { getCategories } from "@/services/categories";
import type { Category } from "@/types/category";
import { revealUp, staggerContainer } from "@/lib/animations";

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const response = await getCategories();

        if (mounted) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
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
    <section className="bg-[#f7f5f0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1600px]">
        {/* Heading */}
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
              Explore Our Range
            </motion.p>

            <motion.h2
              variants={revealUp}
              className="font-serif text-[38px] font-normal leading-none tracking-[-0.025em] text-[#171717] sm:text-[48px] lg:text-[54px]"
            >
              Shop by Category
            </motion.h2>
          </div>

          <motion.div variants={revealUp}>
            <Link
              href="/categories"
              className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.07em] text-[#222]"
            >
              View All Categories
              <ArrowRight
                size={15}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="aspect-[1.22/1] animate-pulse bg-[#e6e0d6]"
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {categories.map((category) => (
              <motion.article
                key={category.id}
                variants={revealUp}
                className="group"
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="relative block aspect-[1.35/1] overflow-hidden bg-[#e8e2d8] sm:aspect-[1.25/1] lg:aspect-[1.22/1]"
                >
                  {category.imageUrl ? (
                    <motion.img
                      src={category.imageUrl}
                      alt={category.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      whileHover={{ scale: 1.045 }}
                      transition={{
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#ddd6cb]" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-6 lg:p-7">
                    <div>
                      <h3 className="font-serif text-[30px] font-normal leading-none text-white sm:text-[34px]">
                        {category.name}
                      </h3>

                      <div className="mt-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.1em] text-white/85">
                        <span>View Collection</span>

                        <ArrowUpRight
                          size={13}
                          strokeWidth={1.5}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
