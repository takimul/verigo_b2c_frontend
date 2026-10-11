"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  AtSign,
  ExternalLink,
  LoaderCircle,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { getPublicSettings } from "@/services/settings";
import type { SiteSettings } from "@/types/settings";

function whatsappUrl(value: string) {
  const number = value.replace(/[^\d]/g, "");
  return number ? `https://wa.me/${number}` : "";
}

function socialLinks(settings: SiteSettings) {
  return [
    { label: "Instagram", url: settings.instagram },
    { label: "Facebook", url: settings.facebook },
    { label: "LinkedIn", url: settings.linkedin },
    { label: "YouTube", url: settings.youtube },
  ].filter((item): item is { label: string; url: string } =>
    Boolean(item.url?.trim()),
  );
}

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        setLoading(true);
        setError("");

        const response = await getPublicSettings();

        console.log("Public settings API response:", response);

        if (!response.success) {
          throw new Error(response.message || "Failed to load settings.");
        }

        if (!cancelled) {
          setSettings(response.data);
        }
      } catch (err) {
        console.error("Failed to load public settings:", err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load contact information.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const socials = settings ? socialLinks(settings) : [];
  const whatsapp = settings?.whatsapp ? whatsappUrl(settings.whatsapp) : "";

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            Get in touch
          </p>

          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Let&apos;s discuss your requirements.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
            Contact us about wholesale products, bulk orders, customization, or
            an OEM/ODM project. Tell us what you need and we&apos;ll have a
            clear starting point for the conversation.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Contact information
          </p>

          {loading ? (
            <div className="mt-7 flex items-center gap-3 text-sm text-neutral-500">
              <LoaderCircle size={20} className="animate-spin" />
              Loading contact details...
            </div>
          ) : error ? (
            <div className="mt-6 border border-neutral-200 p-5">
              <p className="text-sm text-neutral-700">
                Contact details could not be loaded.
              </p>
              <p className="mt-2 text-sm text-neutral-500">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 text-sm font-medium underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex gap-4 py-5 hover:bg-neutral-50"
                >
                  <AtSign
                    size={20}
                    className="mt-1 shrink-0 text-neutral-500"
                  />
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-[0.12em] text-neutral-500">
                      Email
                    </span>
                    <span className="mt-1 block break-all text-sm font-medium">
                      {settings.email}
                    </span>
                  </span>
                </a>
              )}

              {settings?.phone && (
                <a
                  href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                  className="flex gap-4 py-5 hover:bg-neutral-50"
                >
                  <Phone size={20} className="mt-1 shrink-0 text-neutral-500" />
                  <span>
                    <span className="block text-xs uppercase tracking-[0.12em] text-neutral-500">
                      Phone
                    </span>
                    <span className="mt-1 block text-sm font-medium">
                      {settings.phone}
                    </span>
                  </span>
                </a>
              )}

              {settings?.whatsapp && whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 py-5 hover:bg-neutral-50"
                >
                  <MessageCircle
                    size={20}
                    className="mt-1 shrink-0 text-neutral-500"
                  />
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-[0.12em] text-neutral-500">
                      WhatsApp
                    </span>
                    <span className="mt-1 block text-sm font-medium">
                      {settings.whatsapp}
                    </span>
                  </span>
                  <ExternalLink
                    size={14}
                    className="ml-auto mt-1 shrink-0 text-neutral-400"
                  />
                </a>
              )}

              {settings?.address && (
                <div className="flex gap-4 py-5">
                  <MapPin
                    size={20}
                    className="mt-1 shrink-0 text-neutral-500"
                  />
                  <span>
                    <span className="block text-xs uppercase tracking-[0.12em] text-neutral-500">
                      Address
                    </span>
                    <span className="mt-1 block whitespace-pre-line text-sm leading-6">
                      {settings.address}
                    </span>
                  </span>
                </div>
              )}

              {!settings?.email &&
                !settings?.phone &&
                !settings?.whatsapp &&
                !settings?.address && (
                  <p className="py-5 text-sm leading-6 text-neutral-500">
                    Contact information has not been configured yet. Please send
                    your requirements through the inquiry form.
                  </p>
                )}
            </div>
          )}

          {socials.length > 0 && (
            <div className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Follow us
              </p>

              <div className="mt-3 flex flex-wrap gap-4">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline underline-offset-4 hover:text-neutral-500"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border border-neutral-200 p-6 sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Wholesale &amp; business inquiries
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Tell us about your project.
          </h2>

          <p className="mt-4 text-sm leading-7 text-neutral-600">
            Include the product name, estimated quantity, sizes, colors, and
            customization requirements. For OEM/ODM projects, include your
            specifications and intended branding.
          </p>

          <div className="mt-7 border-t border-neutral-200 pt-6">
            <Link
              href="/inquiry"
              className="inline-flex w-full items-center justify-center gap-2 bg-neutral-950 px-5 py-3.5 text-sm font-medium text-white hover:bg-neutral-800 sm:w-auto"
            >
              Open inquiry form <ArrowRight size={16} />
            </Link>

            <p className="mt-4 text-xs leading-5 text-neutral-500">
              Submit your contact details and requirements through our business
              inquiry form.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
