"use client";

import { motion } from "framer-motion";
import { useSiteContent } from "@/context/SiteContentContext";

export default function Testimonials() {
  const { content } = useSiteContent();
  const testimonials = content.testimonials;

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-28 bg-[#F1EEE8] overflow-hidden">
      <div className="absolute top-20 right-[15%] w-72 h-72 rounded-full bg-[#A88551]/[0.06] blur-[100px]" />
      <div className="absolute bottom-0 left-[10%] w-80 h-80 rounded-full bg-[#A88551]/[0.04] blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.9,
                delay: i * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative"
            >
              <div className="relative h-full rounded-[24px] border border-[#1C1815]/[0.06] bg-white p-8 shadow-[0_4px_20px_rgba(64,53,43,0.04)] transition-all duration-700 hover:border-[#A88551]/30 hover:shadow-[0_20px_50px_rgba(168,133,81,0.10)] hover:-translate-y-1">
                <div className="absolute -top-4 right-8">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A88551] text-white text-2xl font-serif leading-none pb-2">
                    "
                  </span>
                </div>

                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-[#A88551] text-sm">
                      ★
                    </span>
                  ))}
                </div>

                <p className="text-[15px] leading-loose text-[#4A4139]">
                  {t.text}
                </p>

                <div className="my-6 flex items-center gap-3">
                  <span className="h-px flex-1 bg-[#1C1815]/10" />
                  <span className="w-1 h-1 rounded-full bg-[#A88551]" />
                  <span className="h-px flex-1 bg-[#1C1815]/10" />
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#A88551]/30 bg-[#FAF6F0] font-serif text-base text-[#A88551]">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#1C1815]">
                      {t.name}
                    </p>
                    <p className="text-[11px] tracking-wider text-[#6B6055]">
                      {t.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="mt-14 flex items-center justify-center gap-4"
        >
          <span className="h-px w-16 bg-[#A88551]/30" />
          <span className="font-serif italic text-lg text-[#A88551]">
            ATHER
          </span>
          <span className="h-px w-16 bg-[#A88551]/30" />
        </motion.div>
      </div>
    </section>
  );
}