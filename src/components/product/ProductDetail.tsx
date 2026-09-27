"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn, formatPrice } from "@/lib/utils";

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  return (
    <div className="py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col-reverse gap-4 lg:flex-row">
          <div className="flex gap-4 lg:flex-col">
            {product.images.map((img) => (
              <button
                key={img}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  "relative aspect-square w-20 overflow-hidden rounded-lg border",
                  selectedImage === img ? "border-champagne" : "border-champagne/10"
                )}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
          <div className="relative flex-1 aspect-[4/5] overflow-hidden rounded-lg border border-champagne/10">
            <Image src={selectedImage} alt={product.nameAr} fill className="object-cover" />
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-champagne">{product.category}</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl text-ivory">{product.nameAr}</h1>
          <p className="mt-2 text-lg text-muted">{product.tagline}</p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-3xl text-champagne">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xl text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="mt-8">
            <p className="text-sm tracking-widest text-champagne">النوتات العطرية</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.notes.map((note) => (
                <span key={note} className="rounded-full border border-champagne/20 px-4 py-1 text-sm text-muted">
                  {note}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm tracking-widest text-champagne">الحجم</p>
            <div className="mt-3 flex gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "rounded-full border px-6 py-2 text-sm",
                    selectedSize === size
                      ? "border-champagne bg-champagne text-noir"
                      : "border-champagne/20 text-ivory hover:border-champagne"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-champagne/20">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-4 py-3 text-ivory hover:text-champagne"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-ivory">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-4 py-3 text-ivory hover:text-champagne"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => addItem(product, qty)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-champagne py-3 text-sm uppercase tracking-widest text-noir transition hover:bg-champagne-light"
            >
              <ShoppingBag className="h-4 w-4" />
              أضف للسلة
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne/20 text-ivory hover:border-champagne"
              aria-label="أضف للمفضلة"
            >
              <Heart className={cn("h-5 w-5", isWishlisted(product.id) && "fill-champagne text-champagne")} />
            </button>
          </div>

          <div className="mt-10 border-t border-champagne/10 pt-8">
            <h3 className="font-serif text-2xl text-ivory">الوصف</h3>
            <p className="mt-4 leading-8 text-muted">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}