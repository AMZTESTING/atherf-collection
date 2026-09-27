"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSiteContent } from "@/context/SiteContentContext";

export default function Story() {
  const { content } = useSiteContent();
  const { story } = content;

  return (
    <section className="py-20 sm:py-28 bg-[#FAF6F0]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* صورة */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden bg-[#EFE9DF]">
              {story.image ? (
                <Image
                  src={story.image}
                  alt="Ather Collection"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[#6B6055] text-sm">
                  لا توجد صورة
                </div>
              )}
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 border-t-2 border-r-2 border-[#A88551]/40 rounded-tr-[28px] hidden sm:block" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 border-b-2 border-l-2 border-[#A88551]/40 rounded-bl-[28px] hidden sm:block" />
          </motion.div>

          {/* النص */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-[#A88551]" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#A88551]">
                {story.label}
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1815] leading-tight">
              {story.title}
            </h2>

            <p className="mt-6 text-base leading-loose text-[#6B6055]">
              {story.paragraph1}
            </p>

            {story.paragraph2 && (
              <p className="mt-4 text-base leading-loose text-[#6B6055]">
                {story.paragraph2}
              </p>
            )}

            <div className="mt-8 flex items-center gap-6">
              <Link
                href={story.ctaLink}
                className="group inline-flex items-center gap-2 rounded-full bg-[#1C1815] px-8 py-3.5 text-sm font-medium tracking-wider text-white transition-all duration-500 hover:bg-[#A88551]"
              >
                {story.ctaText}
                <span className="transition-transform duration-500 group-hover:-translate-x-1">
                  ←
                </span>
              </Link>
            </div>

            {story.stats?.length > 0 && (
              <div className="mt-10 pt-8 border-t border-[#1C1815]/10 grid grid-cols-3 gap-4">
                {story.stats.map((s, i) => (
                  <div key={i}>
                    <p className="font-serif text-2xl text-[#A88551]">
                      {s.value}
                    </p>
                    <p className="mt-1 text-xs text-[#6B6055] tracking-wider">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}