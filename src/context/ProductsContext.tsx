"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { products as defaultProducts } from "@/data/products";
import type { Product } from "@/types";

type ProductsContextType = {
  products: Product[];
  addProduct: (p: Product) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
  isReady: boolean;
  loading: boolean;
};

const ProductsContext = createContext<ProductsContextType | null>(null);

// تحويل من صيغة Supabase إلى Product
function fromDB(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameAr: row.name_ar,
    tagline: row.tagline,
    description: row.description,
    notes: row.notes || [],
    price: Number(row.price),
    compareAtPrice: row.compare_at_price
      ? Number(row.compare_at_price)
      : undefined,
    images: row.images || [],
    category: row.category,
    collection: row.collection,
    sizes: row.sizes || ["100ml"],
    rating: Number(row.rating),
    reviewsCount: row.reviews_count,
    inStock: row.in_stock,
    featured: row.featured,
    bestSeller: row.best_seller,
    isNew: row.is_new,
  };
}

// تحويل من Product إلى صيغة Supabase
function toDB(p: Product) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    name_ar: p.nameAr,
    tagline: p.tagline,
    description: p.description,
    notes: p.notes,
    price: p.price,
    compare_at_price: p.compareAtPrice || null,
    images: p.images,
    category: p.category,
    collection: p.collection,
    sizes: p.sizes,
    rating: p.rating,
    reviews_count: p.reviewsCount,
    in_stock: p.inStock,
    featured: p.featured || false,
    best_seller: p.bestSeller || false,
    is_new: p.isNew || false,
  };
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // إذا كان الجدول فارغ، استخدم البيانات الافتراضية
      if (!data || data.length === 0) {
        setProducts(defaultProducts);
        // ارفع البيانات الافتراضية إلى Supabase
        const { error: insertError } = await supabase
          .from("products")
          .insert(defaultProducts.map(toDB));
        if (insertError) console.warn("Seeding failed:", insertError);
      } else {
        setProducts(data.map(fromDB));
      }
    } catch (e) {
      console.error("Products load failed:", e);
      setProducts(defaultProducts);
    } finally {
      setLoading(false);
      setIsReady(true);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const addProduct = async (p: Product) => {
    const { error } = await supabase.from("products").insert(toDB(p));
    if (error) {
      console.error("Add product failed:", error);
      throw error;
    }
    await refreshProducts();
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.nameAr !== undefined) dbUpdates.name_ar = updates.nameAr;
    if (updates.tagline !== undefined) dbUpdates.tagline = updates.tagline;
    if (updates.description !== undefined)
      dbUpdates.description = updates.description;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.collection !== undefined)
      dbUpdates.collection = updates.collection;
    if (updates.sizes !== undefined) dbUpdates.sizes = updates.sizes;
    if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
    if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
    if (updates.bestSeller !== undefined)
      dbUpdates.best_seller = updates.bestSeller;
    if (updates.isNew !== undefined) dbUpdates.is_new = updates.isNew;
    if (updates.slug !== undefined) dbUpdates.slug = updates.slug;

    const { error } = await supabase
      .from("products")
      .update(dbUpdates)
      .eq("id", id);

    if (error) {
      console.error("Update product failed:", error);
      throw error;
    }
    await refreshProducts();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Delete product failed:", error);
      throw error;
    }
    await refreshProducts();
  };

  const resetToDefaults = async () => {
    await supabase.from("products").delete().neq("id", "");
    await supabase.from("products").insert(defaultProducts.map(toDB));
    await refreshProducts();
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts,
        resetToDefaults,
        isReady,
        loading,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx)
    throw new Error("useProducts must be used inside ProductsProvider");
  return ctx;
}