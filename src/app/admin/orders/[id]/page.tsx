"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Save, ArrowRight } from "lucide-react";
import {
  useOrders,
  STATUS_LABELS,
  STATUS_COLORS,
  type OrderStatus,
} from "@/context/OrdersContext";
import { formatPrice } from "@/lib/utils";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getOrder, updateOrder, deleteOrder } = useOrders();
  const order = getOrder(id);

  const [status, setStatus] = useState<OrderStatus>(
    order?.status || "pending"
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (order) setStatus(order.status);
  }, [order]);

  if (!order) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-[#6B6055] mb-4">الطلب غير موجود.</p>
          <button
            onClick={() => router.push("/admin/orders")}
            className="rounded-full bg-[#1C1815] px-6 py-3 text-sm text-white hover:bg-[#A88551]"
          >
            العودة للطلبات
          </button>
        </div>
      </div>
    );
  }

  const handleSaveStatus = async () => {
    setSaving(true);
    try {
      await updateOrder(order.id, { status });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert("فشل الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("حذف الطلب؟")) {
      await deleteOrder(order.id);
      router.push("/admin/orders");
    }
  };

  const statuses: OrderStatus[] = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <button
        onClick={() => router.push("/admin/orders")}
        className="flex items-center gap-2 text-xs text-[#6B6055] hover:text-[#A88551] mb-4 transition"
      >
        <ArrowRight className="h-3.5 w-3.5" />
        العودة للطلبات
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-xs text-[#6B6055]">رقم الطلب</p>
          <h1 className="font-mono text-xl sm:text-2xl text-[#1C1815] mt-1">
            #{order.id}
          </h1>
        </div>
        <span
          className={`self-start sm:self-auto rounded-full px-4 py-2 text-xs font-medium ${
            STATUS_COLORS[order.status]
          }`}
        >
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        <div className="lg:col-span-2 space-y-5 lg:space-y-6">
          {/* Items */}
          <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-4 sm:p-6">
            <h2 className="font-serif text-base sm:text-lg text-[#1C1815] mb-4">
              المنتجات
            </h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 border-b border-[#1C1815]/[0.05] pb-3 last:border-0 last:pb-0"
                >
                  {item.image && (
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-[#FAF6F0] shrink-0">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1C1815] truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-[#6B6055] truncate">
                      {item.productNameAr}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-[#1C1815]">
                      {item.qty} × {formatPrice(item.price)}
                    </p>
                    <p className="text-xs text-[#A88551]">
                      {formatPrice(item.price * item.qty)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#1C1815]/10 space-y-2 text-sm">
              <div className="flex justify-between text-[#6B6055]">
                <span>المجموع الفرعي</span>
                <span className="text-[#1C1815]">
                  {formatPrice(order.subtotal)}
                </span>
              </div>

              {order.discountAmount && order.discountAmount > 0 ? (
                <div className="flex justify-between text-green-600">
                  <span>الخصم</span>
                  <span>− {formatPrice(order.discountAmount)}</span>
                </div>
              ) : null}

              <div className="flex justify-between text-[#6B6055]">
                <span>الشحن</span>
                <span className="text-[#1C1815]">
                  {order.shipping === 0
                    ? "مجاني"
                    : formatPrice(order.shipping)}
                </span>
              </div>

              {order.taxAmount && order.taxAmount > 0 ? (
                <div className="flex justify-between text-[#6B6055]">
                  <span>الضريبة</span>
                  <span className="text-[#1C1815]">
                    {formatPrice(order.taxAmount)}
                  </span>
                </div>
              ) : null}

              <div className="flex justify-between border-t border-[#1C1815]/10 pt-3 mt-3">
                <span className="text-base text-[#1C1815]">الإجمالي</span>
                <span className="font-serif text-lg sm:text-xl text-[#1C1815]">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-4 sm:p-6">
            <h2 className="font-serif text-base sm:text-lg text-[#1C1815] mb-4">
              تحديث الحالة
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded-full px-3 sm:px-4 py-2 text-xs transition ${
                    status === s
                      ? "bg-[#1C1815] text-white"
                      : "bg-[#FAF6F0] text-[#6B6055] hover:bg-[#F1EAE0]"
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveStatus}
                disabled={saving}
                className="flex items-center gap-2 rounded-full bg-[#1C1815] px-5 sm:px-6 py-3 text-sm text-white hover:bg-[#A88551] transition disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "جاري الحفظ..." : "حفظ"}
              </button>
              {saved && (
                <span className="text-sm text-green-600">✓ تم</span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5 lg:space-y-6">
          <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-4 sm:p-6">
            <h3 className="font-serif text-base text-[#1C1815] mb-4">
              معلومات العميل
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-[#6B6055]">الاسم</p>
                <p className="text-[#1C1815]">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B6055]">الجوال</p>
                <a
                  href={`https://wa.me/${order.customerPhone.replace(
                    /[^0-9]/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A88551] hover:underline break-all"
                  dir="ltr"
                >
                  {order.customerPhone}
                </a>
              </div>
              {order.customerEmail && (
                <div>
                  <p className="text-xs text-[#6B6055]">الإيميل</p>
                  <p className="text-[#1C1815] break-all" dir="ltr">
                    {order.customerEmail}
                  </p>
                </div>
              )}
              {order.emirate && (
                <div>
                  <p className="text-xs text-[#6B6055]">الإمارة</p>
                  <p className="text-[#1C1815]">{order.emirate}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-[#6B6055]">العنوان</p>
                <p className="text-[#1C1815]">{order.address}</p>
              </div>
              {order.notes && (
                <div>
                  <p className="text-xs text-[#6B6055]">ملاحظات</p>
                  <p className="text-[#1C1815]">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-4 sm:p-6">
            <h3 className="font-serif text-base text-[#1C1815] mb-4">
              تفاصيل إضافية
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-[#6B6055]">طريقة الدفع</span>
                <span className="text-[#1C1815]">
                  {order.paymentMethod === "cash" ? "كاش" : "فيزا"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#6B6055]">المصدر</span>
                <span className="text-[#1C1815]">
                  {order.source === "website" ? "الموقع" : "يدوي"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#6B6055]">التاريخ</span>
                <span className="text-[#1C1815] text-xs text-left" dir="ltr">
                  {new Date(order.createdAt).toLocaleString("ar-AE")}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-sm text-red-500 hover:bg-red-50 transition"
          >
            <Trash2 className="h-4 w-4" />
            حذف الطلب
          </button>
        </div>
      </div>
    </div>
  );
}