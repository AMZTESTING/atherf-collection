"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn, formatPrice } from "@/lib/utils";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#EFE9DF]">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.nameAr}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[#6B6055]">
              لا توجد صورة
            </div>
          )}

          {product.isNew && (
            <span className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#1C1815] font-medium">
              جديد
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition hover:scale-110"
            aria-label="أضف للمفضلة"
          >
            <Heart
              className={cn(
                "h-4 w-4 text-[#1C1815]",
                isWishlisted(product.id) && "fill-[#A88551] text-[#A88551]"
              )}
            />
          </button>

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <span className="rounded-full bg-white px-5 py-2 text-sm font-medium text-[#1C1815]">
                نفدت الكمية
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="pt-5">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-xl sm:text-2xl text-[#1C1815] tracking-wide leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-[#6B6055]">{product.nameAr}</p>
        <p className="mt-2 text-xs tracking-wide text-[#A88551]">
          {product.tagline}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="font-serif text-xl text-[#1C1815]">
              {formatPrice(product.price)}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#6B6055]">
              {product.sizes?.[0] || "100ml"} · للجنسين
            </span>
          </div>

          <button
            onClick={() => addItem(product)}
            disabled={!product.inStock}
            className="flex items-center gap-2 rounded-full bg-[#1C1815] px-5 py-2.5 text-xs font-medium tracking-wider text-white transition-all duration-500 hover:bg-[#A88551] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            {product.inStock ? "أضف" : "نفدت"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}