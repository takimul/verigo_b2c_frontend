// const products = [
//   {
//     id: 1,
//     name: "Essential Oversized Tee",
//     category: "T-Shirts",
//     image:
//       "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85",
//   },
//   {
//     id: 2,
//     name: "Premium Cotton Shirt",
//     category: "Shirts",
//     image:
//       "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=85",
//   },
//   {
//     id: 3,
//     name: "Relaxed Polo",
//     category: "Polos",
//     image:
//       "https://images.unsplash.com/photo-1625910513413-5fc45c4b4f0d?auto=format&fit=crop&w=1000&q=85",
//   },
//   {
//     id: 4,
//     name: "Minimal Hoodie",
//     category: "Hoodies",
//     image:
//       "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85",
//   },
//   {
//     id: 5,
//     name: "Everyday Trousers",
//     category: "Bottoms",
//     image:
//       "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=85",
//   },
//   {
//     id: 6,
//     name: "Kids Essential Set",
//     category: "Kids",
//     image:
//       "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=85",
//   },
// ];

"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { getProducts } from "@/services/products";
import type { Product } from "@/types/product";
import { revealUp, staggerContainer } from "@/lib/animations";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadFeaturedProducts() {
      try {
        setLoading(true);
        setError(false);

        const response = await getProducts({
          featured: true,
          limit: 8,
        });

        if (!mounted) return;

        setProducts(response.data.items ?? []);
      } catch (error) {
        console.error("Failed to load featured products:", error);

        if (mounted) {
          setError(true);
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadFeaturedProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * If the API failed, don't leave a large broken
   * section on the homepage.
   */
  if (error) {
    return null;
  }

  /*
   * If there are no featured products configured
   * in the admin panel, don't show an empty section.
   */
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden bg-[#eeebe4] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1600px]">
        {/* ------------------------------------------------
            SECTION HEADER
        ------------------------------------------------- */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <motion.p
              variants={revealUp}
              className="mb-3 text-[9px] font-medium uppercase tracking-[0.38em] text-[#756e64] sm:text-[10px]"
            >
              Our Selection
            </motion.p>

            <motion.h2
              variants={revealUp}
              className="font-serif text-[38px] font-normal leading-none tracking-[-0.025em] text-[#171717] sm:text-[48px] lg:text-[54px]"
            >
              Featured Collection
            </motion.h2>
          </div>

          <motion.div variants={revealUp}>
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.07em] text-[#222]"
            >
              Explore All Products
              <ArrowRight
                size={15}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* ------------------------------------------------
            LOADING STATE
        ------------------------------------------------- */}
        {loading ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="min-w-0">
                <div className="aspect-[0.78/1] animate-pulse bg-[#ddd7cd]" />

                <div className="pt-4">
                  <div className="h-2.5 w-16 animate-pulse bg-[#d5cec3]" />

                  <div className="mt-3 h-4 w-3/4 animate-pulse bg-[#d5cec3]" />

                  <div className="mt-2 h-2.5 w-24 animate-pulse bg-[#d5cec3]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ------------------------------------------------
              PRODUCTS
          ------------------------------------------------- */
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.1,
            }}
            className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
          >
            {products.map((product) => {
              const primaryImage =
                product.images.find((image) => image.isPrimary)?.url ??
                product.images[0]?.url ??
                null;

              return (
                <motion.article
                  key={product.id}
                  variants={revealUp}
                  className="group min-w-0"
                >
                  <Link href={`/products/${product.slug}`} className="block">
                    {/* ----------------------------------------
                        PRODUCT IMAGE
                    ----------------------------------------- */}
                    <div className="relative aspect-[0.78/1] overflow-hidden bg-[#ded8ce]">
                      {primaryImage ? (
                        <motion.img
                          src={primaryImage}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                          whileHover={{
                            scale: 1.045,
                          }}
                          transition={{
                            duration: 0.65,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#ded8ce]">
                          <span className="text-[9px] uppercase tracking-[0.15em] text-[#777169]">
                            Image unavailable
                          </span>
                        </div>
                      )}

                      {/* ----------------------------------------
                          SUBTLE HOVER OVERLAY
                      ----------------------------------------- */}
                      <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />

                      {/* ----------------------------------------
                          VIEW DETAILS
                      ----------------------------------------- */}
                      <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="flex items-center justify-between bg-white/95 px-4 py-3 backdrop-blur-sm">
                          <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-[#171717]">
                            View Details
                          </span>

                          <ArrowUpRight
                            size={14}
                            strokeWidth={1.4}
                            className="text-[#171717]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ----------------------------------------
                        PRODUCT INFORMATION
                    ----------------------------------------- */}
                    <div className="pt-4">
                      <p className="text-[9px] uppercase tracking-[0.14em] text-[#817a70]">
                        {product.category?.name ?? "Apparel"}
                      </p>

                      <h3 className="mt-1.5 text-[13px] font-medium tracking-[-0.01em] text-[#171717] sm:text-[14px]">
                        {product.name}
                      </h3>

                      <p className="mt-2 text-[10px] leading-4 text-[#777169]">
                        Wholesale available
                      </p>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        {/* ------------------------------------------------
            MOBILE CTA
        ------------------------------------------------- */}
        {!loading && products.length > 0 && (
          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="mt-10 flex justify-center md:hidden"
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 border border-[#222] px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[#171717] transition-colors duration-300 hover:bg-[#171717] hover:text-white"
            >
              View All Products
              <ArrowRight
                size={14}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
