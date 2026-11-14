"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, X, ArrowUpRight, Mail, Phone } from "lucide-react";
import { getPublicSettings } from "@/services/settings";
import type { SiteSettings } from "@/types/settings";
import InlineEditable from "@/components/ui/InlineEditable";
import { useLiveEdit } from "@/context/LiveEditContext";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Custom Development", href: "/custom-development" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [mounted, setMounted] = useState(false);
  const { getContent } = useLiveEdit();
  const showTitleBelowLogo =
    getContent("header_show_title_below_logo", "true") === "true";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const response = await getPublicSettings();
        if (active && response.success) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to load settings in navbar:", error);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  // Close mobile navigation on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const siteName = settings?.siteName || "Verigo Essential";
  const announcementText =
    settings?.announcementText ||
    "Sourced from Bangladesh. Supplied to the world.";

  const tagline =
    settings?.tagline || "ESSENTIAL APPAREL, SOURCED FROM BANGLADESH.";

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f7f5f0]/95 backdrop-blur-md shadow-2xs">
        {/* Announcement Bar */}
        <div className="border-b border-black/10 bg-[#171717] px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-[#f7f5f0] sm:text-[11px]">
          <InlineEditable
            contentKey="announcement_text"
            defaultValue={announcementText}
          />
        </div>

        <div className="border-b border-black/10">
          <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
            {/* Logo and Tagline */}
            <div className="flex items-center">
              <Link
                href="/"
                className="group inline-flex items-center"
                onClick={() => setMobileOpen(false)}
                aria-label={`${siteName} Home`}
              >
                {settings?.logoUrl ? (
                  <span className="flex flex-col items-center leading-none">
                    <img
                      src={settings.logoUrl}
                      alt={siteName}
                      className="h-7 sm:h-8 w-auto max-w-[140px] sm:max-w-[170px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    {showTitleBelowLogo && (
                      <span className="mt-1 flex flex-col items-center leading-none">
                        <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.24em] text-[#111]">
                          VERIGO
                        </span>
                        <span className="mt-0.5 text-center text-[5px] sm:text-[5.5px] tracking-[0.42em] text-[#6f6b64]">
                          ESSENTIAL
                        </span>
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="flex flex-col leading-none">
                    <span className="text-[22px] font-medium tracking-[0.24em] text-[#111]">
                      VERIGO
                    </span>
                    <span className="mt-1 text-center text-[7px] tracking-[0.42em] text-[#6f6b64]">
                      ESSENTIAL
                    </span>
                  </span>
                )}
              </Link>

              <span className="hidden border-l border-black/10 py-1 pl-5 ml-5 text-[8.5px] font-medium uppercase tracking-[0.22em] text-[#6f6b64] xl:inline-block">
                <InlineEditable
                  contentKey="header_tagline"
                  defaultValue={tagline}
                />
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative text-[12px] font-medium tracking-[0.04em] text-[#252525]"
                >
                  <InlineEditable
                    contentKey={`nav_link_${item.label.toLowerCase().replace(/\s+/g, "_")}`}
                    defaultValue={item.label}
                  />

                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#111] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden items-center gap-5 lg:flex">
              <Link
                href="/categories"
                aria-label="Search categories"
                className="text-[#171717] transition-transform duration-300 hover:-translate-y-0.5"
              >
                <Search size={18} strokeWidth={1.5} />
              </Link>

              <Link
                href="/contact"
                className="group flex items-center gap-3 bg-[#111] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-white transition-all duration-300 hover:bg-[#292929]"
              >
                <InlineEditable
                  contentKey="nav_quote_cta"
                  defaultValue="REQUEST A QUOTE"
                />
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-4 lg:hidden">
              <Link
                href="/categories"
                aria-label="Search categories"
                className="text-[#171717]"
              >
                <Search size={18} strokeWidth={1.5} />
              </Link>

              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((prev) => !prev)}
                className="relative flex h-10 w-10 items-center justify-center rounded-sm text-[#171717] transition hover:bg-black/5"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer so page content never goes behind fixed header */}
      <div
        className="h-[110px] sm:h-[114px] w-full shrink-0"
        aria-hidden="true"
      />

      {/* Full-Screen Luxury Mobile Navigation Drawer via Portal (Zero Layout Shift, Above All Content) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                key="luxury-mobile-drawer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.28,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="fixed inset-0 z-[9999] flex flex-col justify-between overflow-y-auto bg-[#f7f5f0] text-[#171717]"
              >
                {/* Overlay Top Bar: Brand Logo & Close 'X' */}
                <div className="sticky top-0 z-10 flex h-[76px] items-center justify-between border-b border-black/10 bg-[#f7f5f0]/95 px-5 backdrop-blur-md sm:px-8">
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center"
                    aria-label={`${siteName} Home`}
                  >
                    {settings?.logoUrl ? (
                      <span className="flex flex-col items-center leading-none">
                        <img
                          src={settings.logoUrl}
                          alt={siteName}
                          className="h-7 sm:h-8 w-auto max-w-[140px] sm:max-w-[170px] object-contain"
                        />
                        {showTitleBelowLogo && (
                          <span className="mt-1 flex flex-col items-center leading-none">
                            <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.24em] text-[#111]">
                              VERIGO
                            </span>
                            <span className="mt-0.5 text-center text-[5px] sm:text-[5.5px] tracking-[0.42em] text-[#6f6b64]">
                              ESSENTIAL
                            </span>
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="flex flex-col leading-none">
                        <span className="text-[22px] font-medium tracking-[0.24em] text-[#111]">
                          VERIGO
                        </span>
                        <span className="mt-1 text-center text-[7px] tracking-[0.42em] text-[#6f6b64]">
                          ESSENTIAL
                        </span>
                      </span>
                    )}
                  </Link>

                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[#111] shadow-xs transition hover:bg-black hover:text-white"
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Overlay Body Content */}
                <div className="flex-1 px-5 py-6 sm:px-8">
                  {/* Quick Search Card */}
                  <Link
                    href="/categories"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 border border-black/15 bg-white px-4 py-3 text-xs text-[#555] shadow-2xs transition hover:border-black/40"
                  >
                    <Search size={16} className="text-[#888]" />
                    <span>Search catalogue &amp; collections...</span>
                  </Link>

                  {/* Main Navigation Links */}
                  <nav className="mt-6 flex flex-col divide-y divide-black/10 border-y border-black/10">
                    {navigation.map((item, index) => {
                      const isActive = pathname === item.href;
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.04 + 0.06,
                            duration: 0.25,
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center justify-between py-4 text-[16px] sm:text-[18px] transition-colors ${
                              isActive
                                ? "font-semibold text-[#111]"
                                : "font-normal text-[#333] hover:text-black"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              {isActive && (
                                <span className="h-2 w-2 rounded-full bg-[#111]" />
                              )}
                              <InlineEditable
                                contentKey={`nav_link_${item.label.toLowerCase().replace(/\s+/g, "_")}`}
                                defaultValue={item.label}
                              />
                            </span>
                            <ArrowUpRight
                              size={17}
                              strokeWidth={1.3}
                              className="text-[#888]"
                            />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>

                  {/* Primary CTA: Request a Quote */}
                  <div className="mt-8">
                    <Link
                      href="/contact"
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center justify-center gap-3 bg-[#111] px-6 py-4 text-[11px] font-medium uppercase tracking-[0.14em] text-white shadow-md active:bg-[#333] transition"
                    >
                      <InlineEditable
                        contentKey="nav_quote_cta"
                        defaultValue="REQUEST A QUOTE"
                      />
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>

                  {/* Featured Collections Quick Pills */}
                  <div className="mt-8">
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#817b73] mb-3">
                      Collections
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href="/categories/winter-essentials"
                        onClick={() => setMobileOpen(false)}
                        className="border border-black/15 bg-white px-3 py-1.5 text-xs text-[#222] transition hover:border-black hover:bg-black hover:text-white"
                      >
                        Winter Essentials
                      </Link>
                      <Link
                        href="/categories/summer-essentials"
                        onClick={() => setMobileOpen(false)}
                        className="border border-black/15 bg-white px-3 py-1.5 text-xs text-[#222] transition hover:border-black hover:bg-black hover:text-white"
                      >
                        Summer Essentials
                      </Link>
                      <Link
                        href="/categories"
                        onClick={() => setMobileOpen(false)}
                        className="border border-black/15 bg-white px-3 py-1.5 text-xs text-[#222] transition hover:border-black hover:bg-black hover:text-white"
                      >
                        All Categories →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Overlay Footer: Direct Contact Info */}
                <div className="border-t border-black/10 bg-[#eeeae3] px-5 py-6 sm:px-8">
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#817b73]">
                    Direct Sourcing Contact
                  </p>

                  <div className="mt-3 flex flex-col gap-2.5 text-xs">
                    {settings?.email && (
                      <a
                        href={`mailto:${settings.email}`}
                        className="flex items-center gap-2.5 text-[#333] hover:text-black font-medium"
                      >
                        <Mail size={14} className="text-[#888]" />
                        <span>{settings.email}</span>
                      </a>
                    )}
                    {settings?.phone && (
                      <a
                        href={`tel:${settings.phone}`}
                        className="flex items-center gap-2.5 text-[#333] hover:text-black font-medium"
                      >
                        <Phone size={14} className="text-[#888]" />
                        <span>{settings.phone}</span>
                      </a>
                    )}
                  </div>

                  {settings?.whatsapp && (
                    <div className="mt-4">
                      <a
                        href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-black/20 bg-white px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#111] transition hover:border-black shadow-2xs"
                      >
                        WhatsApp Us
                      </a>
                    </div>
                  )}

                  <p className="mt-5 text-[9px] uppercase tracking-[0.2em] text-[#888]">
                    {tagline}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
