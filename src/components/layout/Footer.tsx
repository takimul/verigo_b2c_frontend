"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { getPublicSettings } from "@/services/settings";
import type { SiteSettings } from "@/types/settings";
import { revealUp, staggerContainer } from "@/lib/animations";
import InlineEditable from "@/components/ui/InlineEditable";

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const response = await getPublicSettings();
        if (mounted && response.success) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to load site settings in footer:", error);
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const siteName = settings?.siteName || "Verigo Essential";
  const tagline =
    settings?.tagline || "ESSENTIAL APPAREL, SOURCED FROM BANGLADESH.";

  const socialLinks = [
    {
      label: "Instagram",
      href: settings?.instagram,
      icon: FaInstagram,
    },
    {
      label: "LinkedIn",
      href: settings?.linkedin,
      icon: FaLinkedinIn,
    },
    {
      label: "Facebook",
      href: settings?.facebook,
      icon: FaFacebookF,
    },
  ].filter(
    (
      item,
    ): item is {
      label: string;
      href: string;
      icon: typeof FaInstagram;
    } => Boolean(item.href),
  );

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="overflow-hidden bg-[#171717] text-[#f7f5f0]">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
        {/* Main footer - Super compact on mobile */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-4 border-b border-[#373634] py-5 sm:gap-10 sm:py-12 lg:grid-cols-[1.4fr_1fr_1.2fr] lg:gap-12"
        >
          {/* Brand & Tagline */}
          <motion.div variants={revealUp}>
            <Link
              href="/"
              className="inline-block"
              aria-label={`${siteName} home`}
            >
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={siteName}
                  className="max-h-7 w-auto max-w-36 object-contain brightness-0 invert sm:max-h-9 sm:max-w-45"
                />
              ) : (
                <span className="font-serif text-[18px] tracking-[-0.03em] text-[#f7f5f0] sm:text-[24px]">
                  {siteName}
                </span>
              )}
            </Link>

            <div className="mt-1.5 max-w-85 text-[9px] font-medium uppercase tracking-[0.14em] text-[#a8a197] sm:mt-3.5 sm:text-[11px] sm:tracking-[0.16em]">
              <InlineEditable
                contentKey="footer_tagline"
                defaultValue={tagline}
              />
            </div>
          </motion.div>

          {/* Quick links & Contact grid for mobile */}
          <div className="grid grid-cols-2 gap-3 sm:contents">
            {/* Explore column */}
            <motion.div variants={revealUp}>
              <p className="mb-1.5 text-[8px] font-medium uppercase tracking-[0.25em] text-[#817b73] sm:mb-4 sm:text-[9px] sm:tracking-[0.32em]">
                Explore
              </p>

              <nav className="flex flex-col items-start gap-1.5 sm:gap-3">
                <Link
                  href="/categories"
                  className="text-[10.5px] text-[#b8b1a8] transition-colors duration-300 hover:text-[#f7f5f0] sm:text-[12px]"
                >
                  Categories
                </Link>

                <Link
                  href="/about"
                  className="text-[10.5px] text-[#b8b1a8] transition-colors duration-300 hover:text-[#f7f5f0] sm:text-[12px]"
                >
                  About Us
                </Link>

                <Link
                  href="/contact"
                  className="text-[10.5px] text-[#b8b1a8] transition-colors duration-300 hover:text-[#f7f5f0] sm:text-[12px]"
                >
                  Request a Quote
                </Link>
              </nav>
            </motion.div>

            {/* Contact Details & WhatsApp button */}
            <motion.div variants={revealUp}>
              <p className="mb-1.5 text-[8px] font-medium uppercase tracking-[0.25em] text-[#817b73] sm:mb-4 sm:text-[9px] sm:tracking-[0.32em]">
                Contact
              </p>

              <div className="flex flex-col gap-1.5 sm:gap-3">
                {settings?.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="group flex items-start gap-1.5 sm:gap-2"
                  >
                    <Mail
                      size={11}
                      strokeWidth={1.3}
                      className="mt-0.5 shrink-0 text-[#817b73] sm:size-[14px]"
                    />
                    <span className="break-all text-[9.5px] text-[#b8b1a8] transition-colors duration-300 group-hover:text-[#f7f5f0] sm:text-[11px]">
                      {settings.email}
                    </span>
                  </a>
                )}

                {settings?.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="group flex items-start gap-1.5 sm:gap-2"
                  >
                    <Phone
                      size={11}
                      strokeWidth={1.3}
                      className="mt-0.5 shrink-0 text-[#817b73] sm:size-[14px]"
                    />
                    <span className="text-[9.5px] text-[#b8b1a8] transition-colors duration-300 group-hover:text-[#f7f5f0] sm:text-[11px]">
                      {settings.phone}
                    </span>
                  </a>
                )}

                {settings?.address && (
                  <div className="hidden sm:flex sm:items-start sm:gap-2.5">
                    <MapPin
                      size={14}
                      strokeWidth={1.3}
                      className="mt-0.5 shrink-0 text-[#817b73]"
                    />
                    <span className="text-[11px] text-[#b8b1a8]">
                      {settings.address}
                    </span>
                  </div>
                )}
              </div>

              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center border border-[#4a4845] px-2 py-1 text-[8px] font-medium uppercase tracking-widest text-[#d8d2c9] transition-colors duration-300 hover:border-[#f7f5f0] hover:text-[#f7f5f0] sm:mt-4 sm:px-4 sm:py-2.5 sm:text-[9px]"
                >
                  WhatsApp Us
                </a>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom bar - Minimized */}
        <div className="flex items-center justify-between py-3 text-[8px] text-[#6f6a63] sm:py-5 sm:text-[9px]">
          <p className="uppercase tracking-[0.1em]">
            © {year ?? ""} {siteName}
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-[#817b73] transition-colors duration-300 hover:text-[#f7f5f0]"
                >
                  <Icon size={13} className="sm:size-[15px]" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
