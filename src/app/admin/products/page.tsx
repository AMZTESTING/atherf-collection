"use client";

import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const { products, deleteProduct, resetToDefaults } = useProducts();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1815]">
            المنتجات
          </h1>
          <p className="mt-1 text-sm text-[#6B6055]">
            {products.length} منتج في المتجر
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              if (confirm("استعادة المنتجات الافتراضية؟")) resetToDefaults();
            }}
            className="rounded-full border border-[#1C1815]/10 px-4 sm:px-5 py-2.5 text-xs text-[#6B6055] transition hover:border-[#A88551] hover:text-[#1C1815]"
          >
            استعادة الافتراضي
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#1C1815] px-5 sm:px-6 py-3 text-sm text-white transition hover:bg-[#A88551]"
          >
            <Plus className="h-4 w-4" />
            منتج جديد
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-12 text-center text-[#6B6055]">
          لا توجد منتجات. أضف منتجك الأول.
        </div>
      ) : (
        <>
          {/* جدول للشاشات الكبيرة */}
          <div className="hidden md:block bg-white rounded-2xl border border-[#1C1815]/[0.06] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-[#FAF6F0] text-xs text-[#6B6055] tracking-wider">
                  <tr>
                    <th className="p-4 text-right">المنتج</th>
                    <th className="p-4 text-right">السعر</th>
                    <th className="p-4 text-right">الحالة</th>
                    <th className="p-4 text-right">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t border-[#1C1815]/[0.05] hover:bg-[#FAF6F0]/50"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-[#FAF6F0] shrink-0">
                            {p.images?.[0] && (
                              <Image
                                src={p.images[0]}
                                alt={p.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[#1C1815]">
                              {p.name}
                            </p>
                            <p className="text-xs text-[#6B6055]">
                              {p.nameAr}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[#1C1815]">
                        {formatPrice(p.price)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-[10px] tracking-wider ${
                            p.inStock
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {p.inStock ? "متوفر" : "نفدت"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1C1815]/10 text-[#6B6055] transition hover:border-[#A88551] hover:text-[#A88551]"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => {
                              if (confirm(`حذف "${p.name}"؟`))
                                deleteProduct(p.id);
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1C1815]/10 text-[#6B6055] transition hover:border-red-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* بطاقات للجوال */}
          <div className="md:hidden space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-[#1C1815]/8 bg-white p-4"
              >
                <div className="flex gap-3 mb-3">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-[#FAF6F0] shrink-0">
                    {p.images?.[0] && (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1C1815] truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-[#6B6055] truncate">
                      {p.nameAr}
                    </p>
                    <p className="text-sm text-[#1C1815] mt-1">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#1C1815]/8">
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] tracking-wider ${
                      p.inStock
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.inStock ? "متوفر" : "نفدت"}
                  </span>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1C1815]/10 text-[#6B6055] transition hover:border-[#A88551] hover:text-[#A88551]"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`حذف "${p.name}"؟`)) deleteProduct(p.id);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1C1815]/10 text-[#6B6055] transition hover:border-red-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}