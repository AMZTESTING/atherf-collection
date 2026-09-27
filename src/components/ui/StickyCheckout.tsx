"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function StickyCheckout() {
  const pathname = usePathname();
  const { totalItems, subtotal, openCart } = useCart();

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/account/signin") ||
    pathname?.startsWith("/account/signup")
  )
    return null;

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
        >
          <button
            onClick={openCart}
            className="flex w-full items-center justify-between gap-4 rounded-full bg-[#1C1815] pl-6 pr-2 py-2 shadow-2xl shadow-black/20 transition-all hover:bg-[#2A241D]"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#C9AE84]">
                <ShoppingBag className="h-4 w-4 text-[#1C1815]" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#1C1815]">
                  {totalItems}
                </span>
              </span>
              <div className="text-right">
                <p className="text-xs text-white/60">سلتك</p>
                <p className="text-sm font-medium text-white">
                  {formatPrice(subtotal)}
                </p>
              </div>
            </div>

            <span className="rounded-full bg-[#C9AE84] px-6 py-3 text-xs font-medium tracking-wider text-[#1C1815]">
              إتمام الطلب
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}