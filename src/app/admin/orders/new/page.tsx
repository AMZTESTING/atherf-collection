"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, X, Search } from "lucide-react";
import { useOrders, type OrderItem } from "@/context/OrdersContext";
import { useProducts } from "@/context/ProductsContext";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice } from "@/lib/utils";

export default function NewOrderPage() {
  const router = useRouter();
  const { addOrder } = useOrders();
  const { products } = useProducts();
  const { users } = useAuth();
  const { settings, calculateTotals } = useSettings();

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    emirate: "",
    address: "",
    notes: "",
    paymentMethod: "cash" as "cash" | "visa",
  });

  const [items, setItems] = useState<OrderItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [status, setStatus] = useState<
    "pending" | "confirmed" | "shipped" | "delivered"
  >("confirmed");
  const [saving, setSaving] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  const totals = useMemo(
    () => calculateTotals(subtotal, form.emirate),
    [subtotal, form.emirate, calculateTotals]
  );

  const filteredProducts = products.filter(
    (p) =>
      !items.some((i) => i.productId === p.id) &&
      (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.nameAr.includes(productSearch))
  );

  const filteredCustomers = users.filter(
    (u) =>
      u.name.includes(customerSearch) ||
      u.phone.includes(customerSearch) ||
      u.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const addProduct = (productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    setItems([
      ...items,
      {
        productId: p.id,
        productName: p.name,
        productNameAr: p.nameAr,
        price: p.price,
        qty: 1,
        image: p.images?.[0],
      },
    ]);
    setProductSearch("");
  };

  const updateQty = (productId: string, qty: number) => {
    setItems(
      items.map((i) =>
        i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i
      )
    );
  };

  const removeItem = (productId: string) => {
    setItems(items.filter((i) => i.productId !== productId));
  };

  const selectCustomer = (userId: string) => {
    const u = users.find((x) => x.id === userId);
    if (!u) return;
    setForm({
      ...form,
      customerName: u.name,
      customerPhone: u.phone,
      customerEmail: u.email,
    });
    setShowCustomerList(false);
    setCustomerSearch("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.customerPhone || !form.address) {
      alert("يرجى إكمال البيانات المطلوبة");
      return;
    }
    if (!form.emirate) {
      alert("يرجى اختيار الإمارة");
      return;
    }
    if (items.length === 0) {
      alert("أضف منتجاً واحداً على الأقل");
      return;
    }

    setSaving(true);
    try {
      await addOrder({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail,
        emirate: form.emirate,
        address: form.address,
        notes: form.notes,
        items,
        subtotal,
        shipping: totals.shipping,
        taxAmount: totals.taxAmount,
        discountAmount: totals.discountAmount,
        total: totals.total,
        paymentMethod: form.paymentMethod,
        status,
        source: "manual",
      });

      router.push("/admin/orders");
    } catch (err) {
      console.error(err);
      alert("فشل حفظ الطلب");
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-[#1C1815]/10 bg-white px-4 py-3 text-sm text-[#1C1815] focus:outline-none focus:border-[#A88551] transition";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
      <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1815] mb-6">
        طلب جديد
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
        {/* Customer */}
        <Card title="بيانات العميل">
          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6055]" />
            <input
              value={customerSearch}
              onChange={(e) => {
                setCustomerSearch(e.target.value);
                setShowCustomerList(true);
              }}
              onFocus={() => setShowCustomerList(true)}
              placeholder="ابحث عن عميل مسجّل..."
              className={`${inputCls} pr-10`}
            />
            {showCustomerList && filteredCustomers.length > 0 && (
              <div className="absolute top-full right-0 left-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-[#1C1815]/10 bg-white shadow-lg">
                {filteredCustomers.slice(0, 6).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => selectCustomer(u.id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-right text-sm hover:bg-[#FAF6F0] border-b border-[#1C1815]/[0.05] last:border-0"
                  >
                    <span className="font-medium text-[#1C1815] truncate">
                      {u.name}
                    </span>
                    <span
                      className="text-xs text-[#6B6055] shrink-0"
                      dir="ltr"
                    >
                      {u.phone}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="الاسم *">
              <input
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
                className={inputCls}
                required
              />
            </Field>
            <Field label="الجوال *">
              <input
                value={form.customerPhone}
                onChange={(e) =>
                  setForm({ ...form, customerPhone: e.target.value })
                }
                className={inputCls}
                dir="ltr"
                required
              />
            </Field>
            <Field label="البريد الإلكتروني">
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) =>
                  setForm({ ...form, customerEmail: e.target.value })
                }
                className={inputCls}
                dir="ltr"
              />
            </Field>
            <Field label="الإمارة *">
              <select
                value={form.emirate}
                onChange={(e) =>
                  setForm({ ...form, emirate: e.target.value })
                }
                className={inputCls}
                required
              >
                <option value="">اختر</option>
                {settings.emirates.map((em) => (
                  <option key={em} value={em}>
                    {em}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="العنوان *">
              <input
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                className={inputCls}
                required
              />
            </Field>
          </div>
        </Card>

        {/* Products */}
        <Card title="المنتجات">
          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6055]" />
            <input
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="ابحث عن منتج لإضافته..."
              className={`${inputCls} pr-10`}
            />
            {productSearch && filteredProducts.length > 0 && (
              <div className="absolute top-full right-0 left-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-[#1C1815]/10 bg-white shadow-lg">
                {filteredProducts.slice(0, 5).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addProduct(p.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-right hover:bg-[#FAF6F0] border-b border-[#1C1815]/[0.05] last:border-0"
                  >
                    {p.images?.[0] && (
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-[#FAF6F0] shrink-0">
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 text-right">
                      <p className="text-sm font-medium text-[#1C1815] truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-[#6B6055]">
                        {formatPrice(p.price)}
                      </p>
                    </div>
                    <Plus className="h-4 w-4 text-[#A88551] shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <div className="py-8 text-center text-sm text-[#6B6055]">
              لا توجد منتجات مضافة
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 border border-[#1C1815]/8 rounded-xl p-3"
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
                    <p className="text-xs text-[#6B6055]">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center rounded-full border border-[#1C1815]/10 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      className="px-3 py-1.5 text-[#1C1815]"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      className="px-3 py-1.5 text-[#1C1815]"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-600 p-2 shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Payment & Status */}
        <Card title="الدفع والحالة">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="طريقة الدفع">
              <select
                value={form.paymentMethod}
                onChange={(e) =>
                  setForm({
                    ...form,
                    paymentMethod: e.target.value as "cash" | "visa",
                  })
                }
                className={inputCls}
              >
                <option value="cash">كاش عند التوصيل</option>
                <option value="visa">فيزا</option>
              </select>
            </Field>
            <Field label="حالة الطلب">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className={inputCls}
              >
                <option value="pending">قيد المراجعة</option>
                <option value="confirmed">مؤكد</option>
                <option value="shipped">تم الشحن</option>
                <option value="delivered">تم التوصيل</option>
              </select>
            </Field>
          </div>
        </Card>

        {/* Notes */}
        <Card title="ملاحظات">
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            placeholder="أي تفاصيل إضافية..."
            className={`${inputCls} resize-none`}
          />
        </Card>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-4 sm:p-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[#6B6055]">
              <span>المجموع</span>
              <span className="text-[#1C1815]">{formatPrice(subtotal)}</span>
            </div>

            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>
                  {settings.discount.label} (
                  {settings.discount.type === "percentage"
                    ? `${settings.discount.value}%`
                    : formatPrice(settings.discount.value)}
                  )
                </span>
                <span>− {formatPrice(totals.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#6B6055]">
              <span>الشحن {form.emirate && `(${form.emirate})`}</span>
              <span className="text-[#1C1815]">
                {form.emirate
                  ? totals.shipping === 0
                    ? "مجاني"
                    : formatPrice(totals.shipping)
                  : "— اختر الإمارة"}
              </span>
            </div>

            {totals.taxAmount > 0 && (
              <div className="flex justify-between text-[#6B6055]">
                <span>
                  {settings.tax.label} ({settings.tax.rate}%)
                </span>
                <span className="text-[#1C1815]">
                  {formatPrice(totals.taxAmount)}
                </span>
              </div>
            )}

            <div className="flex justify-between border-t border-[#1C1815]/10 pt-3 mt-3">
              <span className="text-base text-[#1C1815]">الإجمالي</span>
              <span className="font-serif text-xl sm:text-2xl text-[#1C1815]">
                {formatPrice(totals.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/orders")}
            className="rounded-full border border-[#1C1815]/10 px-6 py-3 text-sm text-[#6B6055] hover:border-[#A88551] transition"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[#1C1815] px-8 py-3 text-sm text-white hover:bg-[#A88551] transition disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : "حفظ الطلب"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-4 sm:p-6">
      <h2 className="font-serif text-base sm:text-lg text-[#1C1815] mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}