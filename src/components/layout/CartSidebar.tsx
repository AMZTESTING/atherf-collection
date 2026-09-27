"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    updateQty,
    removeItem,
    subtotal,
    totalItems,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            dir="rtl"
            className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-[#FAF6F0] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C1815]/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-[#A88551]" />
                <h2 className="font-serif text-xl text-[#1C1815]">
                  سلة التسوق
                </h2>
                {totalItems > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#A88551] px-2 text-xs text-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#1C1815]/5 transition"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5 text-[#1C1815]" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EFE9DF]">
                    <ShoppingBag className="h-8 w-8 text-[#A88551]" />
                  </div>
                  <p className="mt-5 font-serif text-lg text-[#1C1815]">
                    سلتك فارغة
                  </p>
                  <p className="mt-2 text-sm text-[#6B6055]">
                    أضف عطراً لتبدأ التسوق
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-6 rounded-full bg-[#1C1815] px-8 py-3 text-sm text-white transition hover:bg-[#A88551]"
                  >
                    متابعة التسوق
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-3 rounded-2xl border border-[#1C1815]/[0.06] bg-white p-3"
                    >
                      <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-[#EFE9DF]">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.nameAr}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-[#6B6055]">
                            لا صورة
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-base text-[#1C1815] leading-tight">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-[#6B6055] mt-0.5">
                          {item.product.nameAr}
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#A88551]">
                          {formatPrice(item.product.price)}
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-[#1C1815]/10">
                            <button
                              onClick={() =>
                                updateQty(
                                  item.product.id,
                                  Math.max(1, item.qty - 1)
                                )
                              }
                              className="px-2.5 py-1.5 text-[#1C1815] hover:text-[#A88551]"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-xs">
                              {item.qty}
                            </span>
                            <button
                              onClick={() =>
                                updateQty(item.product.id, item.qty + 1)
                              }
                              className="px-2.5 py-1.5 text-[#1C1815] hover:text-[#A88551]"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-red-500 hover:text-red-600 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#1C1815]/10 px-6 py-5 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-[#6B6055]">المجموع</span>
                  <span className="font-serif text-2xl text-[#1C1815]">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="flex w-full items-center justify-center rounded-full bg-[#1C1815] py-3.5 text-sm font-medium text-white transition hover:bg-[#A88551]"
                >
                  عرض السلة
                </Link>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="mt-2 flex w-full items-center justify-center rounded-full bg-[#A88551] py-3.5 text-sm font-medium text-white transition hover:bg-[#8C6C3A]"
                >
                  إتمام الطلب
                </Link>

                <button
                  onClick={closeCart}
                  className="mt-3 w-full text-center text-xs text-[#6B6055] hover:text-[#1C1815]"
                >
                  متابعة التسوق
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}