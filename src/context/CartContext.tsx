"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useProducts } from "./ProductsContext";
import type { Product } from "@/types";

type CartEntry = { productId: string; qty: number };
type CartItem = { product: Product; qty: number };

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { products } = useProducts();
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ather-cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const migrated: CartEntry[] = parsed
            .map((item: any) => ({
              productId: item.productId || item.product?.id,
              qty: item.qty || 1,
            }))
            .filter((e: CartEntry) => e.productId);
          setEntries(migrated);
        }
      }
    } catch (e) {
      console.warn("Cart load failed:", e);
      localStorage.removeItem("ather-cart");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("ather-cart", JSON.stringify(entries));
    } catch (e) {
      console.warn("Cart save failed:", e);
    }
  }, [entries]);

  const items: CartItem[] = entries
    .map((entry) => {
      const product = products.find((p) => p.id === entry.productId);
      return product ? { product, qty: entry.qty } : null;
    })
    .filter(Boolean) as CartItem[];

  const addItem = (product: Product, qty = 1) => {
    setEntries((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { productId: product.id, qty }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) =>
    setEntries((prev) => prev.filter((i) => i.productId !== id));

  const updateQty = (id: string, qty: number) =>
    setEntries((prev) =>
      prev.map((i) => (i.productId === id ? { ...i, qty } : i))
    );

  const clearCart = () => setEntries([]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        subtotal,
        totalItems,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}