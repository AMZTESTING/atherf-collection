"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Trash2 } from "lucide-react";
import {
  useOrders,
  STATUS_LABELS,
  STATUS_COLORS,
  type OrderStatus,
} from "@/context/OrdersContext";
import { formatPrice } from "@/lib/utils";

export default function AdminOrdersPage() {
  const { orders, deleteOrder } = useOrders();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q)
        );
      }
      return true;
    });
  }, [orders, query, statusFilter]);

  const statuses: (OrderStatus | "all")[] = [
    "all",
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1815]">
            الطلبات
          </h1>
          <p className="mt-1 text-sm text-[#6B6055]">
            {orders.length} طلب إجمالي
          </p>
        </div>
        <Link
          href="/admin/orders/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1C1815] px-6 py-3 text-sm text-white transition hover:bg-[#A88551]"
        >
          <Plus className="h-4 w-4" />
          طلب جديد
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-3 sm:p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6055]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث برقم الطلب، الاسم، أو الجوال..."
              className="w-full rounded-xl border border-[#1C1815]/10 bg-white pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-[#A88551]"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 sm:px-4 py-2 text-xs transition whitespace-nowrap ${
                  statusFilter === s
                    ? "bg-[#1C1815] text-white"
                    : "bg-[#FAF6F0] text-[#6B6055] hover:bg-[#F1EAE0]"
                }`}
              >
                {s === "all" ? "الكل" : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-12 text-center text-[#6B6055]">
          لا توجد طلبات مطابقة.
        </div>
      ) : (
        <>
          {/* جدول للشاشات الكبيرة */}
          <div className="hidden md:block bg-white rounded-2xl border border-[#1C1815]/[0.06] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-[#FAF6F0] text-xs text-[#6B6055] tracking-wider">
                  <tr>
                    <th className="p-4 text-right">رقم الطلب</th>
                    <th className="p-4 text-right">العميل</th>
                    <th className="p-4 text-right">التاريخ</th>
                    <th className="p-4 text-right">الإجمالي</th>
                    <th className="p-4 text-right">الدفع</th>
                    <th className="p-4 text-right">الحالة</th>
                    <th className="p-4 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr
                      key={o.id}
                      className="border-t border-[#1C1815]/[0.05] hover:bg-[#FAF6F0]/50"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-mono text-xs text-[#1C1815]">
                            #{o.id}
                          </p>
                          {o.source === "manual" && (
                            <span className="text-[10px] text-[#A88551]">
                              يدوي
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium text-[#1C1815]">
                          {o.customerName}
                        </p>
                        <p className="text-xs text-[#6B6055]" dir="ltr">
                          {o.customerPhone}
                        </p>
                      </td>
                      <td className="p-4 text-sm text-[#6B6055]">
                        {new Date(o.createdAt).toLocaleDateString("ar-AE")}
                      </td>
                      <td className="p-4 text-sm font-medium text-[#1C1815]">
                        {formatPrice(o.total)}
                      </td>
                      <td className="p-4 text-sm text-[#6B6055]">
                        {o.paymentMethod === "cash" ? "كاش" : "فيزا"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-medium ${
                            STATUS_COLORS[o.status]
                          }`}
                        >
                          {STATUS_LABELS[o.status]}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/orders/${o.id}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1C1815]/10 text-[#6B6055] hover:border-[#A88551] hover:text-[#A88551]"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => {
                              if (confirm(`حذف الطلب #${o.id}؟`))
                                deleteOrder(o.id);
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1C1815]/10 text-[#6B6055] hover:border-red-400 hover:text-red-500"
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
            {filtered.map((o) => (
              <div
                key={o.id}
                className="rounded-xl border border-[#1C1815]/8 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-mono text-xs text-[#6B6055]">#{o.id}</p>
                    {o.source === "manual" && (
                      <span className="text-[10px] text-[#A88551]">يدوي</span>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                      STATUS_COLORS[o.status]
                    }`}
                  >
                    {STATUS_LABELS[o.status]}
                  </span>
                </div>

                <p className="text-sm font-medium text-[#1C1815] mb-1">
                  {o.customerName}
                </p>
                <p className="text-xs text-[#6B6055] mb-3" dir="ltr">
                  {o.customerPhone}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#1C1815]/8">
                  <span className="text-xs text-[#6B6055]">
                    {new Date(o.createdAt).toLocaleDateString("ar-AE")}
                  </span>
                  <span className="text-sm font-medium text-[#1C1815]">
                    {formatPrice(o.total)}
                  </span>
                </div>

                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1C1815] py-2 text-xs text-white hover:bg-[#A88551] transition"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    عرض
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`حذف الطلب #${o.id}؟`)) deleteOrder(o.id);
                    }}
                    className="flex items-center justify-center rounded-lg border border-red-300 px-3 text-red-500 hover:bg-red-500 hover:text-white transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}