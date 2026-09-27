"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import ProductCard from "@/components/product/ProductCard";

export default function CollectionsPage() {
  const { products, isReady } = useProducts();
  const [sortBy, setSortBy] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { value: "featured", label: "الأكثر رواجاً" },
    { value: "newest", label: "الأحدث" },
    { value: "price-asc", label: "السعر: من الأقل" },
    { value: "price-desc", label: "السعر: من الأعلى" },
  ];

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ترتيب المنتجات
  const sortedProducts = useMemo(() => {
    const list = [...products];
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [products, sortBy]);

  return (
    <div dir="rtl" className="bg-[#FAF6F0] min-h-screen">
      {/* =========================
          BREADCRUMB + TITLE
      ========================== */}
      <section className="pt-28 sm:pt-32 pb-8 px-6 border-b border-[#1C1815]/5">
        <div className="mx-auto max-w-6xl">
          <nav className="flex items-center gap-2 text-[11px] tracking-wider text-[#6B6055]">
            <a href="/" className="hover:text-[#1C1815] transition-colors">
              الرئيسية
            </a>
            <span className="text-[#1C1815]/20">/</span>
            <span className="text-[#1C1815]">المتجر</span>
          </nav>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1815] tracking-wide">
                المتجر
              </h1>
              <p className="mt-2 text-sm text-[#6B6055]">
                {products.length} عطر متوفر
              </p>
            </div>

            {/* الترتيب */}
            <div className="flex items-center gap-3" ref={sortRef}>
              <span className="text-xs text-[#6B6055] tracking-wide">
                ترتيب حسب:
              </span>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((v) => !v)}
                  className="group flex items-center gap-2 rounded-full border border-[#1C1815]/10 bg-white px-4 py-2 text-xs text-[#1C1815] transition-all duration-300 hover:border-[#A88551]/50"
                >
                  <span>
                    {sortOptions.find((o) => o.value === sortBy)?.label}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-[#6B6055] transition-transform duration-300 ${
                      sortOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-[#1C1815]/[0.06] bg-white shadow-[0_15px_50px_rgba(28,24,21,0.12)]"
                    >
                      {sortOptions.map((option) => {
                        const active = sortBy === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setSortOpen(false);
                            }}
                            className={`flex w-full items-center justify-between px-5 py-3 text-right text-sm transition-colors duration-200 ${
                              active
                                ? "bg-[#FAF6F0] text-[#1C1815] font-medium"
                                : "text-[#6B6055] hover:bg-[#FAF6F0] hover:text-[#1C1815]"
                            }`}
                          >
                            <span>{option.label}</span>
                            {active && (
                              <Check className="h-4 w-4 text-[#A88551]" />
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          PRODUCTS GRID
      ========================== */}
      <section className="py-12 sm:py-16 px-6">
        <div className="mx-auto max-w-6xl">
          {!isReady ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/5] rounded-2xl bg-[#EFE9DF] animate-pulse"
                />
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="py-32 text-center">
              <p className="font-serif text-2xl text-[#1C1815] mb-3">
                لا توجد منتجات
              </p>
              <p className="text-sm text-[#6B6055]">
                لم نجد منتجات في المتجر حالياً.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {sortedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================
          OFFER STRIP
      ========================== */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl bg-[#1C1815] px-8 py-6"
          >
            <div className="text-center sm:text-right">
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9AE84]">
                عرض خاص
              </p>
              <p className="mt-2 text-white font-serif text-lg sm:text-xl">
                عند شراء العطرين معاً —{" "}
                <span className="text-[#C9AE84]">229 د.إ</span>{" "}
                <span className="text-white/40 line-through text-sm">
                  258 د.إ
                </span>
              </p>
            </div>
            <a
              href="#"
              className="shrink-0 rounded-full bg-[#C9AE84] px-6 py-3 text-xs font-medium tracking-wider text-[#1C1815] transition hover:bg-white"
            >
              احصل على العرض
            </a>
          </motion.div>
        </div>
      </section>

      {/* =========================
          TRUST CARDS
      ========================== */}
      <section className="border-t border-[#1C1815]/5 bg-[#F5EFE6] py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                ),
                title: "شحن سريع",
                desc: "جميع الإمارات 2-5 أيام عمل",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                ),
                title: "دفع آمن",
                desc: "عبر الموقع أو واتساب",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                ),
                title: "استرجاع مرن",
                desc: "خلال 7 أيام من الاستلام",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                ),
                title: "دعم مباشر",
                desc: "تواصل معنا على واتساب",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -4 }}
                className="group flex items-center gap-4 rounded-2xl border border-[#1C1815]/[0.06] bg-white px-6 py-5 transition-all duration-500 hover:border-[#A88551]/30 hover:shadow-[0_10px_30px_rgba(168,133,81,0.08)]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FAF6F0] text-[#A88551] transition-colors duration-500 group-hover:bg-[#A88551] group-hover:text-white">
                  {item.icon}
                </span>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#1C1815]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-[#6B6055] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}