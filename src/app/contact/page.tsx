"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const cards = [
    {
      icon: <Phone className="h-5 w-5 text-[#A88551]" />,
      label: "الهاتف",
      value: "+971 52 169 5582",
      href: "tel:+971521695582",
    },
    {
      icon: <MessageCircle className="h-5 w-5 text-[#A88551]" />,
      label: "واتساب",
      value: "+971 52 169 5582",
      href: "https://wa.me/971521695582",
    },
    {
      icon: <Mail className="h-5 w-5 text-[#A88551]" />,
      label: "البريد الإلكتروني",
      value: "Ather.co@hotmail.com",
      href: "mailto:Ather.co@hotmail.com",
    },
  ];

  return (
    <div dir="rtl" className="bg-[#FAF6F0] min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-[11px] tracking-[0.5em] uppercase text-[#A88551]">
            نتواصل
          </p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl text-[#1C1815]">
            نسعد بخدمتك
          </h1>
          <p className="mt-4 text-[#6B6055]">
            لأي استفسار أو طلب، تواصل معنا مباشرة.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex items-center gap-4 rounded-2xl border border-[#1C1815]/[0.06] bg-white p-6 transition hover:border-[#A88551]/40"
            >
              {c.icon}
              <div>
                <p className="text-xs text-[#6B6055]">{c.label}</p>
                <p className="text-sm text-[#1C1815]" dir="ltr">
                  {c.value}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-[#6B6055]">
          <p>ساعات العمل: يومياً من 9 صباحاً إلى 9 مساءً</p>
        </div>
      </div>
    </div>
  );
}