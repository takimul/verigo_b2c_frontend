"use client";

import { CheckCircle2, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "motion/react";

import { revealUp, staggerContainer } from "@/lib/animations";
import InlineEditable from "@/components/ui/InlineEditable";

const reasons = [
  {
    id: "card_1",
    title: "Quality Checked",
    description:
      "Materials, stitching and finishing checked before shipping.",
    icon: ShieldCheck,
  },
  {
    id: "card_2",
    title: "Custom Options",
    description: "Your labels, colors and packaging, on request.",
    icon: Sparkles,
  },
  {
    id: "card_3",
    title: "Samples First",
    description: "Approve a sample before bulk production.",
    icon: CheckCircle2,
  },
  {
    id: "card_4",
    title: "Bulk and Wholesale",
    description: "Built for wholesale orders and long-term relationships.",
    icon: Layers,
  },
];

export default function WhyVerigo() {
  return (
    <section className="overflow-hidden bg-[#171717] px-5 py-12 text-[#f7f5f0] sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1600px]">
        {/* Compact Heading */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-end"
        >
          <div>
            <motion.div variants={revealUp}>
              <InlineEditable
                contentKey="why_badge"
                defaultValue="Why Verigo"
                as="p"
                className="mb-3 text-[9px] font-medium uppercase tracking-[0.38em] text-[#a8a197]"
              />
            </motion.div>

            <motion.div variants={revealUp}>
              <InlineEditable
                contentKey="why_headline"
                defaultValue="Why work with us."
                as="h2"
                className="max-w-[700px] font-serif text-[36px] font-normal leading-[1] tracking-[-0.03em] sm:text-[44px] lg:text-[52px]"
              />
            </motion.div>
          </div>

          <motion.div variants={revealUp} className="lg:justify-self-end">
            <InlineEditable
              contentKey="why_description"
              defaultValue="We source from trusted Bangladeshi factories and keep every order clear, on time and well checked."
              as="p"
              multiline
              className="max-w-[600px] text-[13px] leading-6 text-[#b8b1a8] sm:text-[14px] sm:leading-7"
            />
          </motion.div>
        </motion.div>

        {/* Compact 4 items - Small one-row icons */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-10 grid border-t border-[#333230] pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        >
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <motion.article
                key={reason.id}
                variants={revealUp}
                className="group flex flex-col py-4 sm:py-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none border border-[#444] bg-[#222] text-[#eeebe4] transition-colors group-hover:border-[#eeebe4]">
                    <Icon size={16} strokeWidth={1.5} />
                  </div>

                  <InlineEditable
                    contentKey={`why_${reason.id}_title`}
                    defaultValue={reason.title}
                    as="h3"
                    className="text-[14px] font-medium text-[#f4f1eb]"
                  />
                </div>

                <div className="mt-2.5 pl-11">
                  <InlineEditable
                    contentKey={`why_${reason.id}_desc`}
                    defaultValue={reason.description}
                    as="p"
                    multiline
                    className="text-[12px] leading-5 text-[#918b83]"
                  />
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
