"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Heart, Gift } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSiteContent } from "@/context/SiteContentContext";
import { cn, formatPrice } from "@/lib/utils";

export default function Categories() {
  const { products } = useProducts();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { content } = useSiteContent();
  const offer = content.offerBanner;

  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-[#F1EEE8] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h2 className="font-serif text-[30px] sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#302821]">
            مجموعتنا المميزة
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-10 sm:w-16 bg-[#A88B63]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#A88B63]" />
            <span className="h-px w-10 sm:w-16 bg-[#A88B63]" />
          </div>
          <p className="mt-5 text-sm sm:text-base text-[#756A60] max-w-md mx-auto">
            عطران. مكونات نادرة. أثر يبقى.
          </p>
        </motion.div>

        <div className="mt-12 sm:mt-16 grid grid-cols-2 gap-3 sm:gap-8 lg:gap-10 max-w-4xl mx-auto">
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.9,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group"
            >
              <Link href={`/product/${product.slug}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl sm:rounded-2xl bg-[#EFE9DF]">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.nameAr}
                      fill
                      sizes="(max-width: 640px) 50vw, 50vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#6B6055] text-[10px] sm:text-sm">
                      لا توجد صورة
                    </div>
                  )}

                  {product.isNew && (
                    <span className="absolute top-2 right-2 sm:top-3 sm:right-3 rounded-full bg-white/95 backdrop-blur px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#1C1815] font-medium">
                      جديد
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-2 left-2 sm:top-3 sm:left-3 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition hover:scale-110"
                  >
                    <Heart
                      className={cn(
                        "h-3 w-3 sm:h-4 sm:w-4 text-[#1C1815]",
                        isWishlisted(product.id) &&
                          "fill-[#A88551] text-[#A88551]"
                      )}
                    />
                  </button>

                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <span className="rounded-full bg-white px-3 py-1 text-[10px] sm:px-5 sm:py-2 sm:text-sm font-medium text-[#1C1815]">
                        نفدت
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="pt-3 sm:pt-5">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-serif text-sm sm:text-xl lg:text-2xl text-[#1C1815] tracking-wide leading-tight">
                    {product.name}
                  </h3>
                </Link>
                <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-sm text-[#6B6055]">
                  {product.nameAr}
                </p>
                <p className="mt-1 sm:mt-2 text-[9px] sm:text-xs tracking-wide text-[#A88551] leading-tight">
                  {product.tagline}
                </p>

                <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-serif text-sm sm:text-xl text-[#1C1815]">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-[#6B6055]">
                      {product.sizes?.[0] || "100ml"}
                    </span>
                  </div>

                  <button
                    onClick={() => addItem(product)}
                    disabled={!product.inStock}
                    className="flex items-center justify-center gap-1 sm:gap-2 rounded-full bg-[#1C1815] px-2.5 py-1.5 sm:px-5 sm:py-2.5 text-[9px] sm:text-xs font-medium tracking-wider text-white transition-all duration-500 hover:bg-[#A88551] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    {product.inStock ? "أضف" : "نفدت"}
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* بانر العرض - من لوحة التحكم */}
        {offer?.enabled && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1C1815] to-[#2A241D] px-8 sm:px-12 py-10 sm:py-12">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#C9AE84]/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#C9AE84]/5 blur-3xl" />

              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-right">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                    <Gift className="h-4 w-4 text-[#C9AE84]" />
                    <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9AE84]">
                      {offer.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-white leading-tight">
                    {offer.title}
                  </h3>

                  <div className="mt-3 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                    <span className="font-serif text-3xl text-[#C9AE84]">
                      {offer.price}
                    </span>
                    {offer.oldPrice && (
                      <span className="text-lg text-white/40 line-through">
                        {offer.oldPrice}
                      </span>
                    )}
                    {offer.discountText && (
                      <span className="rounded-full bg-[#C9AE84]/20 px-3 py-1 text-[10px] tracking-wider text-[#C9AE84]">
                        {offer.discountText}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    products.forEach((p) => addItem(p));
                  }}
                  className="shrink-0 rounded-full bg-[#C9AE84] px-8 py-4 text-sm font-medium tracking-wider text-[#1C1815] transition-all duration-500 hover:bg-white hover:tracking-[0.15em]"
                >
                  {offer.ctaText}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}