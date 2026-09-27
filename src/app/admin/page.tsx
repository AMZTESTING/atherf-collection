"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  ArrowLeft,
} from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import {
  useOrders,
  STATUS_LABELS,
  STATUS_COLORS,
} from "@/context/OrdersContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";

export default function AdminHome() {
  const { products } = useProducts();
  const { orders } = useOrders();
  const { users } = useAuth();

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const stats = [
    {
      label: "إجمالي المبيعات",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "الطلبات",
      value: orders.length.toString(),
      sub: pendingOrders > 0 ? `${pendingOrders} قيد المراجعة` : "لا يوجد معلق",
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "العملاء",
      value: users.length.toString(),
      icon: Users,
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: "المنتجات",
      value: products.length.toString(),
      icon: Package,
      color: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1815]">
            لوحة التحكم
          </h1>
          <p className="mt-1 text-sm text-[#6B6055]">نظرة عامة على متجرك</p>
        </div>
        <Link
          href="/admin/orders/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1C1815] px-6 py-3 text-sm text-white transition hover:bg-[#A88551]"
        >
          + طلب جديد
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-[#6B6055]">{s.label}</p>
                  <p className="mt-2 font-serif text-xl sm:text-2xl text-[#1C1815] truncate">
                    {s.value}
                  </p>
                  {s.sub && (
                    <p className="mt-1 text-[11px] text-[#A88551] truncate">
                      {s.sub}
                    </p>
                  )}
                </div>
                <span
                  className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl ${s.color}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="mt-8 lg:mt-10 bg-white rounded-2xl border border-[#1C1815]/[0.06] p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="font-serif text-lg sm:text-xl text-[#1C1815]">
            أحدث الطلبات
          </h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs text-[#A88551] hover:underline"
          >
            عرض الكل
            <ArrowLeft className="h-3 w-3" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#6B6055]">
            لا توجد طلبات بعد
          </div>
        ) : (
          <div className="space-y-1">
            {orders.slice(0, 5).map((o) => (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#1C1815]/[0.05] py-4 last:border-0 hover:bg-[#FAF6F0] -mx-2 px-2 sm:-mx-3 sm:px-3 rounded-lg transition"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="font-mono text-xs text-[#6B6055]">
                    #{o.id}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#1C1815]">
                      {o.customerName}
                    </p>
                    <p className="text-[11px] text-[#6B6055]">
                      {new Date(o.createdAt).toLocaleDateString("ar-AE")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-medium ${
                      STATUS_COLORS[o.status]
                    }`}
                  >
                    {STATUS_LABELS[o.status]}
                  </span>
                  <span className="text-sm font-medium text-[#1C1815]">
                    {formatPrice(o.total)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}