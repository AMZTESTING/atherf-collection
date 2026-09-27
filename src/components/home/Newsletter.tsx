"use client";

import { motion } from "framer-motion";

export default function Newsletter() {
  return (
    <section className="py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl px-4 text-center"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-gold">النشرة البريدية</p>
        <h2 className="mt-4 font-serif text-4xl text-dark">انضم لعائلة Ather</h2>
        <p className="mt-4 text-muted">
          كن أول من يعرف عن الإصدارات الجديدة والعروض الخاصة.
        </p>
        <form className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="بريدك الإلكتروني"
            className="flex-1 rounded-full border border-gold/20 bg-white px-6 py-3 text-dark placeholder:text-muted focus:border-gold focus:outline-none"
          />
          <button className="rounded-full bg-gold px-8 py-3 text-sm uppercase tracking-widest text-white transition hover:bg-gold-light hover:text-dark">
            اشترك
          </button>
        </form>
      </motion.div>
    </section>
  );
}