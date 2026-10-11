"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, X, ArrowUpRight } from "lucide-react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Products", href: "/products" },
  { label: "OEM / ODM", href: "/oem-odm" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f5f0]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          className="group flex flex-col leading-none"
          onClick={() => setMobileOpen(false)}
        >
          <span className="text-[22px] font-medium tracking-[0.24em] text-[#111]">
            VERIGO
          </span>

          <span className="mt-1 text-center text-[7px] tracking-[0.42em] text-[#6f6b64]">
            ESSENTIAL
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative text-[12px] font-medium tracking-[0.04em] text-[#252525]"
            >
              {item.label}

              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#111] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 lg:flex">
          <button
            type="button"
            aria-label="Search"
            className="text-[#171717] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <Search size={18} strokeWidth={1.5} />
          </button>

          <Link
            href="/contact"
            className="group flex items-center gap-3 bg-[#111] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-white transition-all duration-300 hover:bg-[#292929]"
          >
            Send Inquiry
            <ArrowUpRight
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-4 lg:hidden">
          <button type="button" aria-label="Search" className="text-[#171717]">
            <Search size={18} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((previous) => !previous)}
            className="relative flex h-9 w-9 items-center justify-center"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={22} strokeWidth={1.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={22} strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden border-t border-black/10 bg-[#f7f5f0] lg:hidden"
          >
            <nav className="flex flex-col px-5 py-6 sm:px-8">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.3,
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between border-b border-black/10 py-4 text-[14px] text-[#171717]"
                  >
                    {item.label}

                    <ArrowUpRight size={15} strokeWidth={1.5} />
                  </Link>
                </motion.div>
              ))}

              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-6 flex items-center justify-center gap-3 bg-[#111] px-5 py-4 text-[11px] font-medium uppercase tracking-widest text-white"
              >
                Send Inquiry
                <ArrowUpRight size={14} />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
