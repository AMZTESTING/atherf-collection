"use client";

import { useState, useMemo } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import ProductCard from "@/components/product/ProductCard";

export default function SearchPage() {
  const { products } = useProducts();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameAr.includes(q) ||
        p.tagline.includes(q) ||
        p.notes?.some((n) => n.includes(q))
    );
  }, [products, query]);

  return (
    <div dir="rtl" className="bg-[#FAF6F0] min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-4xl text-[#1C1815] mb-8">البحث</h1>

        <div className="relative max-w-xl mb-10">
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6055]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن عطر..."
            className="w-full rounded-full border border-[#1C1815]/10 bg-white pr-11 pl-4 py-3.5 text-sm text-[#1C1815] placeholder:text-[#6B6055] focus:outline-none focus:border-[#A88551]"
          />
        </div>

        <p className="text-sm text-[#6B6055] mb-6">
          {filtered.length} نتيجة
        </p>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-[#6B6055]">
            لا توجد نتائج مطابقة.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}