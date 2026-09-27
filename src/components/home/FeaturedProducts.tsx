"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Story() {
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
              <Image
                src="/images/story.jpg"
                alt="Ather Collection"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            </div>

            {/* إطار ذهبي */}
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
                Our Story
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1815] leading-tight">
              صُنعت لتبقى في الذاكرة
            </h2>

            <p className="mt-6 text-base leading-loose text-[#6B6055]">
              Ather Collection وُلدت من شغف بالعطور الشرقية الأصيلة.
              نختار أجود أنواع العود والعنبر والورد الطائفي من أفضل
              المصادر العالمية، ونمزجها بلمسة عصرية تناسب الذوق الرفيع.
            </p>

            <p className="mt-4 text-base leading-loose text-[#6B6055]">
              كل عطر هو قطعة فنية تعبر عن شخصيتك، وتترك أثراً لا يُنسى
              بعد أن تمضي. لأننا نؤمن أن العطر ليس مجرد رائحة، بل
              بصمة تُحفر في الذاكرة.
            </p>

            <div className="mt-8 flex items-center gap-6">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-full bg-[#1C1815] px-8 py-3.5 text-sm font-medium tracking-wider text-white transition-all duration-500 hover:bg-[#A88551]"
              >
                اكتشف قصتنا
                <span className="transition-transform duration-500 group-hover:-translate-x-1">
                  ←
                </span>
              </Link>
            </div>

            {/* أرقام */}
            <div className="mt-10 pt-8 border-t border-[#1C1815]/10 grid grid-cols-3 gap-4">
              <div>
                <p className="font-serif text-2xl text-[#A88551]">2</p>
                <p className="mt-1 text-xs text-[#6B6055] tracking-wider">
                  عطور فاخرة
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl text-[#A88551]">100%</p>
                <p className="mt-1 text-xs text-[#6B6055] tracking-wider">
                  مكونات أصلية
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl text-[#A88551]">FR</p>
                <p className="mt-1 text-xs text-[#6B6055] tracking-wider">
                  صناعة فرنسية
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}