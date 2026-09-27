"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function SecondBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[#EEE9E1] h-[200px] sm:h-[320px] lg:h-[380px]">
      {/* صورة الخلفية */}
      <img
        src="/images/hero-2.jpg"
        alt="Ather Collection"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* المحتوى */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex items-center justify-start px-5 sm:px-8 lg:px-12"
      >
        <div dir="rtl" className="text-right max-w-md sm:max-w-lg">
          {/* العنوان */}
          <h2 className="font-serif font-bold text-2xl sm:text-4xl lg:text-5xl text-[#E5D2B4] leading-tight">
            فلسفة أثر
          </h2>

          {/* خط ذهبي */}
          <div className="w-10 h-px bg-[#B49A72] my-2 sm:my-4" />

          {/* الوصف */}
          <p className="text-[10px] sm:text-base lg:text-lg leading-relaxed sm:leading-loose text-white font-light max-w-[240px] sm:max-w-md lg:max-w-lg">
            في &quot;أثر&quot; نؤمن أن العطر ليس مجرد رائحة، بل هو بصمة تتركها في
            النفوس. نمزج بين فن العطور الشرقي ولمسات عصرية، لنخلق تجربة حسية
            فريدة تليق بمن يبحث عن التميز.
          </p>

          {/* الزر */}
          <Link
            href="/collections"
            className="mt-3 sm:mt-5 inline-flex items-center justify-center rounded-full bg-[#B49A72] px-5 sm:px-9 py-2 sm:py-3 text-xs sm:text-base font-medium tracking-wide text-[#12100E] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#C6AC84]"
          >
            تسوق الآن
          </Link>
        </div>
      </motion.div>
    </section>
  );
}