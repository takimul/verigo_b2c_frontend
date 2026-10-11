"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { getPublicSettings } from "@/services/settings";
import type { SiteSettings } from "@/types/settings";
import { revealUp, staggerContainer } from "@/lib/animations";

export default function Footer() {
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

        if (mounted) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to load site settings:", error);
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const siteName = settings?.siteName || "Verigo Essential";

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
      label: "YouTube",
      href: settings?.youtube,
      icon: FaYoutube,
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

  return (
    <footer className="overflow-hidden bg-[#171717] text-[#f7f5f0]">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Main footer */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-14 border-b border-[#373634] py-16 sm:py-20 lg:grid-cols-[1.25fr_0.75fr_0.75fr_1fr] lg:gap-12 lg:py-24"
        >
          {/* Brand */}
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
                  className="max-h-10 w-auto max-w-47.5 object-contain brightness-0 invert"
                />
              ) : (
                <span className="font-serif text-[27px] tracking-[-0.04em] text-[#f7f5f0]">
                  {siteName}
                </span>
              )}
            </Link>

            <p className="mt-5 max-w-85 text-[12px] leading-6 text-[#918b83]">
              {settings?.tagline ||
                "Premium apparel manufacturing for brands with a vision."}
            </p>

            <Link
              href="/contact"
              className="group mt-7 inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.11em] text-[#f7f5f0]"
            >
              Start a Conversation
              <ArrowUpRight
                size={14}
                strokeWidth={1.3}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>

          {/* Explore */}
          <motion.div variants={revealUp}>
            <p className="mb-6 text-[9px] font-medium uppercase tracking-[0.32em] text-[#817b73]">
              Explore
            </p>

            <nav className="flex flex-col items-start gap-3.5">
              <Link
                href="/"
                className="text-[11px] text-[#b8b1a8] transition-colors duration-300 hover:text-[#f7f5f0]"
              >
                Home
              </Link>

              <Link
                href="/products"
                className="text-[11px] text-[#b8b1a8] transition-colors duration-300 hover:text-[#f7f5f0]"
              >
                Products
              </Link>

              <Link
                href="/categories"
                className="text-[11px] text-[#b8b1a8] transition-colors duration-300 hover:text-[#f7f5f0]"
              >
                Categories
              </Link>

              <Link
                href="/about"
                className="text-[11px] text-[#b8b1a8] transition-colors duration-300 hover:text-[#f7f5f0]"
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className="text-[11px] text-[#b8b1a8] transition-colors duration-300 hover:text-[#f7f5f0]"
              >
                Contact
              </Link>
            </nav>
          </motion.div>

          {/* Services */}
          <motion.div variants={revealUp}>
            <p className="mb-6 text-[9px] font-medium uppercase tracking-[0.32em] text-[#817b73]">
              Capabilities
            </p>

            <nav className="flex flex-col items-start gap-3.5">
              <Link
                href="/contact"
                className="text-[11px] text-[#b8b1a8] transition-colors duration-300 hover:text-[#f7f5f0]"
              >
                OEM / ODM
              </Link>

              <Link
                href="/products"
                className="text-[11px] text-[#b8b1a8] transition-colors duration-300 hover:text-[#f7f5f0]"
              >
                Custom Apparel
              </Link>

              <Link
                href="/contact"
                className="text-[11px] text-[#b8b1a8] transition-colors duration-300 hover:text-[#f7f5f0]"
              >
                Wholesale
              </Link>

              <Link
                href="/contact"
                className="text-[11px] text-[#b8b1a8] transition-colors duration-300 hover:text-[#f7f5f0]"
              >
                Production Inquiry
              </Link>
            </nav>
          </motion.div>

          {/* Contact */}
          <motion.div variants={revealUp}>
            <p className="mb-6 text-[9px] font-medium uppercase tracking-[0.32em] text-[#817b73]">
              Contact
            </p>

            <div className="flex flex-col gap-4">
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="group flex items-start gap-3"
                >
                  <Mail
                    size={14}
                    strokeWidth={1.3}
                    className="mt-0.5 shrink-0 text-[#817b73]"
                  />

                  <span className="break-all text-[11px] leading-5 text-[#b8b1a8] transition-colors duration-300 group-hover:text-[#f7f5f0]">
                    {settings.email}
                  </span>
                </a>
              )}

              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="group flex items-start gap-3"
                >
                  <Phone
                    size={14}
                    strokeWidth={1.3}
                    className="mt-0.5 shrink-0 text-[#817b73]"
                  />

                  <span className="text-[11px] leading-5 text-[#b8b1a8] transition-colors duration-300 group-hover:text-[#f7f5f0]">
                    {settings.phone}
                  </span>
                </a>
              )}

              {settings?.address && (
                <div className="flex items-start gap-3">
                  <MapPin
                    size={14}
                    strokeWidth={1.3}
                    className="mt-0.5 shrink-0 text-[#817b73]"
                  />

                  <span className="text-[11px] leading-5 text-[#b8b1a8]">
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
                className="mt-6 inline-flex items-center border border-[#4a4845] px-4 py-3 text-[9px] font-medium uppercase tracking-widest text-[#d8d2c9] transition-colors duration-300 hover:border-[#f7f5f0] hover:text-[#f7f5f0]"
              >
                WhatsApp Us
              </a>
            )}
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-6 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[9px] uppercase tracking-[0.12em] text-[#6f6a63]">
            © {year ?? ""} {siteName}. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-[#777169] transition-colors duration-300 hover:text-[#f7f5f0]"
                >
                  <Icon size={15} strokeWidth={1.3} />
                </a>
              );
            })}

            <span className="ml-2 h-3 w-px bg-[#3d3b38]" />

            <Link
              href="/admin/login"
              className="text-[9px] uppercase tracking-[0.12em] text-[#625e58] transition-colors duration-300 hover:text-[#aaa39a]"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
