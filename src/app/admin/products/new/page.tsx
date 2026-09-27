"use client";

import ProductForm from "@/components/admin/ProductForm";
import { useProducts } from "@/context/ProductsContext";

export default function NewProductPage() {
  const { addProduct } = useProducts();
  return <ProductForm title="إضافة منتج جديد" onSave={addProduct} />;
}