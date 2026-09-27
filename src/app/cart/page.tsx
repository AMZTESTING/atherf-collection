"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center px-4 pt-32 pb-20">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EFE9DF]">
          <ShoppingBag className="h-8 w-8 text-[#A88551]" />
        </div>
        <h1 className="mt-6 font-serif text-3xl text-[#1C1815]">
          سلتك فارغة
        </h1>
        <p className="mt-3 text-[#6B6055]">
          لم تقم بإضافة أي منتج بعد.
        </p>
        <Link
          href="/collections"
          className="mt-8 rounded-full bg-[#1C1815] px-8 py-3 text-sm text-white transition hover:bg-[#A88551]"
        >
          تسوق المجموعة
        </Link>
      </div>
    );
  }

  return (
    <div dir="rtl" className="bg-[#FAF6F0] min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-4xl text-[#1C1815] mb-10">
          سلة التسوق
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 rounded-2xl border border-[#1C1815]/[0.06] bg-white p-4"
              >
                <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-[#EFE9DF]">
                  {item.product.images?.[0] && (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.nameAr}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg text-[#1C1815]">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-[#6B6055]">
                    {item.product.nameAr}
                  </p>
                  <p className="mt-1 text-sm text-[#A88551]">
                    {formatPrice(item.product.price)}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-[#1C1815]/10">
                      <button
                        onClick={() =>
                          updateQty(item.product.id, Math.max(1, item.qty - 1))
                        }
                        className="px-3 py-1.5 text-[#1C1815]"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">
                        {item.qty}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(item.product.id, item.qty + 1)
                        }
                        className="px-3 py-1.5 text-[#1C1815]"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-[#1C1815]/[0.06] bg-white p-6 sticky top-28">
              <h2 className="font-serif text-xl text-[#1C1815] mb-6">
                ملخص الطلب
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#6B6055]">
                  <span>المجموع الفرعي</span>
                  <span className="text-[#1C1815]">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6B6055]">
                  <span>الشحن</span>
                  <span className="text-[#1C1815]">يُحدد عند الطلب</span>
                </div>
              </div>

              <div className="mt-6 border-t border-[#1C1815]/10 pt-4 flex justify-between items-center">
                <span className="text-base text-[#1C1815]">الإجمالي</span>
                <span className="font-serif text-2xl text-[#1C1815]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center rounded-full bg-[#1C1815] py-4 text-sm text-white transition hover:bg-[#A88551]"
              >
                إتمام الطلب
              </Link>

              <Link
                href="/collections"
                className="mt-3 flex w-full items-center justify-center rounded-full border border-[#1C1815]/10 py-3 text-sm text-[#6B6055] transition hover:border-[#A88551]"
              >
                متابعة التسوق
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}