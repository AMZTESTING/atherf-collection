"use client";

import { useMemo, useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  Package,
} from "lucide-react";
import { useOrders, STATUS_LABELS } from "@/context/OrdersContext";
import { useProducts } from "@/context/ProductsContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";

type Period = "today" | "week" | "month" | "all";

export default function ReportsPage() {
  const { orders } = useOrders();
  const { products } = useProducts();
  const { users } = useAuth();
  const [period, setPeriod] = useState<Period>("all");

  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter((o) => {
      if (o.status === "cancelled") return false;
      const d = new Date(o.createdAt);
      if (period === "today") return d.toDateString() === now.toDateString();
      if (period === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return d >= weekAgo;
      }
      if (period === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return d >= monthAgo;
      }
      return true;
    });
  }, [orders, period]);

  const totalRevenue = filteredOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders = filteredOrders.length;
  const avgOrder =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const productSales = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number }> =
      {};
    filteredOrders.forEach((o) => {
      o.items.forEach((it) => {
        if (!map[it.productId]) {
          map[it.productId] = { name: it.productName, qty: 0, revenue: 0 };
        }
        map[it.productId].qty += it.qty;
        map[it.productId].revenue += it.price * it.qty;
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const periods: { id: Period; label: string }[] = [
    { id: "today", label: "اليوم" },
    { id: "week", label: "هذا الأسبوع" },
    { id: "month", label: "هذا الشهر" },
    { id: "all", label: "الكل" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1815]">
          التقارير
        </h1>
        <p className="mt-1 text-sm text-[#6B6055]">
          نظرة تحليلية على أداء المتجر
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm transition ${
              period === p.id
                ? "bg-[#1C1815] text-white"
                : "bg-white text-[#6B6055] border border-[#1C1815]/10 hover:border-[#A88551]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8 lg:mb-10">
        <StatCard
          icon={<DollarSign className="h-5 w-5" />}
          label="إجمالي المبيعات"
          value={formatPrice(totalRevenue)}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          icon={<ShoppingCart className="h-5 w-5" />}
          label="عدد الطلبات"
          value={totalOrders.toString()}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="متوسط الطلب"
          value={formatPrice(avgOrder)}
          color="bg-purple-100 text-purple-700"
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="العملاء"
          value={users.length.toString()}
          color="bg-amber-100 text-amber-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
        <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Package className="h-5 w-5 text-[#A88551]" />
            <h2 className="font-serif text-lg text-[#1C1815]">
              الأكثر مبيعاً
            </h2>
          </div>

          {productSales.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#6B6055]">
              لا توجد بيانات
            </p>
          ) : (
            <div className="space-y-3">
              {productSales.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border-b border-[#1C1815]/[0.05] pb-3 last:border-0 last:pb-0"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FAF6F0] text-xs font-medium text-[#A88551]">
                    #{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1C1815] truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-[#6B6055]">
                      {p.qty} وحدة مبيعة
                    </p>
                  </div>
                  <span className="text-sm font-medium text-[#1C1815] shrink-0">
                    {formatPrice(p.revenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <ShoppingCart className="h-5 w-5 text-[#A88551]" />
            <h2 className="font-serif text-lg text-[#1C1815]">حالة الطلبات</h2>
          </div>

          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-[#6B6055]">
                  {STATUS_LABELS[status as keyof typeof STATUS_LABELS] ||
                    status}
                </span>
                <span className="text-sm font-medium text-[#1C1815]">
                  {count}
                </span>
              </div>
            ))}
            {Object.keys(statusCounts).length === 0 && (
              <p className="py-4 text-center text-sm text-[#6B6055]">
                لا توجد بيانات
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 lg:mt-6 bg-white rounded-2xl border border-[#1C1815]/[0.06] p-5 sm:p-6">
        <h2 className="font-serif text-lg text-[#1C1815] mb-5">
          آخر الطلبات في الفترة
        </h2>
        {filteredOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#6B6055]">
            لا توجد طلبات في هذه الفترة
          </p>
        ) : (
          <div className="space-y-2">
            {filteredOrders.slice(0, 8).map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between gap-3 border-b border-[#1C1815]/[0.05] py-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="font-mono text-xs text-[#6B6055]">#{o.id}</p>
                  <p className="text-sm text-[#1C1815] mt-0.5 truncate">
                    {o.customerName}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-[#1C1815]">
                    {formatPrice(o.total)}
                  </p>
                  <p className="text-[10px] text-[#6B6055]">
                    {new Date(o.createdAt).toLocaleDateString("ar-AE")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-[#6B6055]">{label}</p>
          <p className="mt-2 font-serif text-xl sm:text-2xl text-[#1C1815] truncate">
            {value}
          </p>
        </div>
        <span
          className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl ${color}`}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}