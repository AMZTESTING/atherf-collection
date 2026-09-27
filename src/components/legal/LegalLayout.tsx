"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Section = {
  title: string;
  items: (string | { subtitle: string; items: string[] })[];
};

export default function LegalLayout({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro?: string;
  sections: Section[];
}) {
  return (
    <div dir="rtl" className="bg-[#FAF6F0] min-h-screen pt-32 pb-24 px-6">
      <div className="mx-auto max-w-3xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs tracking-wider text-[#6B6055] hover:text-[#A88551] transition mb-6"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            العودة للرئيسية
          </Link>

          <p className="text-[10px] tracking-[0.5em] uppercase text-[#A88551]">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl text-[#1C1815] leading-tight">
            {title}
          </h1>
          <p className="mt-4 text-xs text-[#6B6055] tracking-wider">
            آخر تحديث: {updated}
          </p>
        </motion.div>

        {/* Intro */}
        {intro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-2xl border border-[#A88551]/20 bg-white p-6 sm:p-8 mb-8"
          >
            <p className="text-sm sm:text-base text-[#4A4139] leading-loose">
              {intro}
            </p>
          </motion.div>
        )}

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="rounded-2xl border border-[#1C1815]/[0.06] bg-white p-6 sm:p-8"
            >
              <div className="flex items-start gap-4 mb-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAF6F0] font-serif text-sm text-[#A88551]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-[#1C1815] pt-1">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-4 pr-12">
                {section.items.map((item, j) =>
                  typeof item === "string" ? (
                    <p
                      key={j}
                      className="text-sm sm:text-[15px] text-[#4A4139] leading-loose"
                    >
                      {item}
                    </p>
                  ) : (
                    <div key={j}>
                      <p className="text-sm font-medium text-[#1C1815] mb-2">
                        {item.subtitle}
                      </p>
                      <ul className="space-y-2">
                        {item.items.map((sub, k) => (
                          <li
                            key={k}
                            className="flex items-start gap-2 text-sm text-[#4A4139] leading-loose"
                          >
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#A88551]" />
                            {sub}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12 rounded-2xl bg-[#1C1815] p-8 text-center"
        >
          <p className="text-sm text-white/70 mb-4">
            لأي استفسار بخصوص هذه السياسة
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/971521695582"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#C9AE84] px-6 py-2.5 text-xs font-medium text-[#1C1815] transition hover:bg-white"
            >
              واتساب
            </a>
            <a
              href="mailto:Ather.co@hotmail.com"
              className="rounded-full border border-white/20 px-6 py-2.5 text-xs font-medium text-white transition hover:border-[#C9AE84] hover:text-[#C9AE84]"
            >
              البريد الإلكتروني
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}