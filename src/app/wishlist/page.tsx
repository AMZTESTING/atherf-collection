"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { products } = useProducts();
  const { items } = useWishlist();
  const wishlistProducts = products.filter((p) => items.includes(p.id));

  return (
    <div dir="rtl" className="bg-[#FAF6F0] min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-4xl text-[#1C1815] mb-10">المفضلة</h1>

        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EFE9DF]">
              <Heart className="h-8 w-8 text-[#A88551]" />
            </div>
            <p className="mt-6 text-[#6B6055]">لم تقم بإضافة أي منتج بعد.</p>
            <Link
              href="/collections"
              className="mt-6 rounded-full bg-[#1C1815] px-8 py-3 text-sm text-white"
            >
              تسوق الآن
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}