"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Mail, ArrowLeft } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

export default function AboutPage() {
  const { content } = useSiteContent();

  return (
    <div dir="rtl" className="bg-[#FAF6F0] overflow-hidden">
      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* خلفية متدرجة */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F1EAE0] via-[#FAF6F0] to-[#FAF6F0]" />

        {/* دوائر ضبابية */}
        <div className="absolute top-20 right-[10%] w-96 h-96 rounded-full bg-[#A88551]/[0.08] blur-[120px]" />
        <div className="absolute bottom-0 left-[10%] w-80 h-80 rounded-full bg-[#A88551]/[0.05] blur-[100px]" />

        {/* خطوط زخرفية */}
        <div className="absolute top-0 right-[20%] w-px h-full bg-gradient-to-b from-transparent via-[#A88551]/15 to-transparent" />
        <div className="absolute top-0 left-[25%] w-px h-full bg-gradient-to-b from-transparent via-[#A88551]/10 to-transparent" />

        <div className="relative mx-auto max-w-4xl px-6 pt-32 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="h-px w-12 bg-[#A88551]/50" />
            <span className="text-[10px] tracking-[0.5em] uppercase text-[#A88551]">
              Our Story
            </span>
            <span className="h-px w-12 bg-[#A88551]/50" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl text-[#1C1815] leading-[1.05] tracking-tight"
          >
            لأن بعض الروائح
            <span className="block mt-3 italic text-[#A88551] font-light">
              لا تُنسى
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="mt-8 mx-auto max-w-xl text-base sm:text-lg text-[#6B6055] leading-loose font-light"
          >
            عطور مصممة بعناية لتكون أكثر من مجرد رائحة،
            بل بصمة تُحفر في الذاكرة.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════
          STORY SECTION
      ══════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* الصورة */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-[#EFE9DF] shadow-2xl">
                {content.story.image ? (
                  <Image
                    src={content.story.image}
                    alt="Ather Collection"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[#6B6055]">
                    لا توجد صورة
                  </div>
                )}
              </div>

              {/* إطار ذهبي زخرفي */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-[#A88551]/40 rounded-tr-[32px] hidden sm:block" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-[#A88551]/40 rounded-bl-[32px] hidden sm:block" />
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
                  {content.story.label || "Our Story"}
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1815] leading-tight">
                {content.story.title}
              </h2>

              <div className="mt-8 space-y-5 text-base sm:text-lg text-[#4A4139] leading-loose">
                <p>{content.story.paragraph1}</p>
                {content.story.paragraph2 && (
                  <p>{content.story.paragraph2}</p>
                )}
              </div>

              {/* الأرقام */}
              {content.story.stats?.length > 0 && (
                <div className="mt-10 pt-8 border-t border-[#1C1815]/10 grid grid-cols-3 gap-4">
                  {content.story.stats.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    >
                      <p className="font-serif text-3xl sm:text-4xl text-[#A88551]">
                        {s.value}
                      </p>
                      <p className="mt-2 text-xs text-[#6B6055] tracking-wider leading-relaxed">
                        {s.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          MEANING
      ══════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-6 bg-[#F1EAE0]/50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#A88551]/[0.05] blur-[120px]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="h-px w-10 bg-[#A88551]/50" />
              <span className="text-[10px] tracking-[0.5em] uppercase text-[#A88551]">
                Meaning
              </span>
              <span className="h-px w-10 bg-[#A88551]/50" />
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1815] leading-tight">
              معنى
              <span className="block mt-2 italic text-[#A88551] font-light">
                أثر
              </span>
            </h2>

            <p className="mt-10 text-lg sm:text-xl text-[#4A4139] leading-loose font-light">
              اسم "أثر" يعني الشيء الذي يبقى بعد مرور الشخص أو اللحظة.
              وتم اختيار الاسم ليعكس فكرة العطر نفسه:
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#A88551]/30" />
              <p className="font-serif italic text-2xl text-[#A88551]">
                رائحة تمر، وأثر يبقى
              </p>
              <span className="h-px w-12 bg-[#A88551]/30" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════
          VALUES
      ══════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="h-px w-12 bg-[#A88551]/50" />
              <span className="text-[10px] tracking-[0.5em] uppercase text-[#A88551]">
                Values
              </span>
              <span className="h-px w-12 bg-[#A88551]/50" />
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl text-[#1C1815]">
              ما يميزنا
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "أصالة شرقية",
                desc: "نمزج فن العطور الشرقية بلمسات عصرية، لنخلق تجربة فريدة تليق بكل ذوق.",
              },
              {
                num: "02",
                title: "مكونات نادرة",
                desc: "نختار أجود أنواع العود والعنبر والورد الطائفي من أفضل المصادر العالمية.",
              },
              {
                num: "03",
                title: "أثر يدوم",
                desc: "كل عطر يُصمم ليبقى حضوراً في الذاكرة، وليس مجرد رائحة عابرة.",
              },
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="group relative rounded-[24px] border border-[#1C1815]/[0.06] bg-white p-8 transition-all duration-700 hover:border-[#A88551]/30 hover:shadow-[0_20px_50px_rgba(168,133,81,0.08)] hover:-translate-y-1"
              >
                <p className="font-serif text-5xl text-[#A88551]/20 group-hover:text-[#A88551]/40 transition-colors">
                  {v.num}
                </p>
                <h3 className="mt-6 font-serif text-2xl text-[#1C1815]">
                  {v.title}
                </h3>
                <p className="mt-4 text-sm sm:text-base text-[#6B6055] leading-loose">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          QUOTE
      ══════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 px-6 bg-[#1C1815] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_30%_30%,#C9AE84_0%,transparent_60%),radial-gradient(circle_at_70%_70%,#C9AE84_0%,transparent_60%)]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1 }}
          >
            <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FAF6F0] leading-[1.4] font-light">
              "العطر ليس مجرد رائحة،
              <span className="block mt-3 italic text-[#C9AE84]">
                بل هو ذاكرة تُحفر في النفوس"
              </span>
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <span className="h-px w-16 bg-[#C9AE84]/40" />
              <span className="font-serif italic text-lg text-[#C9AE84]">
                ATHER
              </span>
              <span className="h-px w-16 bg-[#C9AE84]/40" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CONTACT + CTA
      ══════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="h-px w-12 bg-[#A88551]/50" />
              <span className="text-[10px] tracking-[0.5em] uppercase text-[#A88551]">
                Get in Touch
              </span>
              <span className="h-px w-12 bg-[#A88551]/50" />
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#1C1815]">
              نسعد بتواصلك
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <motion.a
              href="https://wa.me/971521695582"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="group flex items-center gap-4 rounded-2xl border border-[#1C1815]/[0.06] bg-white p-6 transition-all hover:border-[#A88551]/40 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(168,133,81,0.08)]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FAF6F0] text-[#A88551] transition group-hover:bg-[#A88551] group-hover:text-white">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs tracking-wider text-[#6B6055] mb-1">
                  واتساب / هاتف
                </p>
                <p className="text-sm text-[#1C1815]" dir="ltr">
                  +971 52 169 5582
                </p>
              </div>
            </motion.a>

            <motion.a
              href="mailto:Ather.co@hotmail.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="group flex items-center gap-4 rounded-2xl border border-[#1C1815]/[0.06] bg-white p-6 transition-all hover:border-[#A88551]/40 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(168,133,81,0.08)]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FAF6F0] text-[#A88551] transition group-hover:bg-[#A88551] group-hover:text-white">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs tracking-wider text-[#6B6055] mb-1">
                  البريد الإلكتروني
                </p>
                <p className="text-sm text-[#1C1815]" dir="ltr">
                  Ather.co@hotmail.com
                </p>
              </div>
            </motion.a>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Link
              href="/collections"
              className="group inline-flex items-center gap-3 rounded-full bg-[#1C1815] px-10 py-4 text-sm font-medium tracking-wider text-white transition-all duration-500 hover:bg-[#A88551] hover:gap-5"
            >
              تسوق المجموعة
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}