"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  User as UserIcon,
  Banknote,
  CreditCard,
  ShieldCheck,
  Package,
  Clock,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrdersContext";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice } from "@/lib/utils";

type PaymentMethod = "cash" | "visa";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const { settings, calculateTotals } = useSettings();

  const [done, setDone] = useState(false);
  const [orderInfo, setOrderInfo] = useState<{
    id: string;
    status: "confirmed" | "pending";
    payment: PaymentMethod;
  } | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    emirate: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name,
        phone: prev.phone || user.phone,
      }));
    }
  }, [user]);

  const totals = useMemo(
    () => calculateTotals(subtotal, form.emirate),
    [subtotal, form.emirate, calculateTotals]
  );

  const { shipping, taxAmount, discountAmount, total } = totals;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;

    if (!form.name || !form.phone || !form.address || !form.emirate) {
      alert("يرجى إكمال جميع الحقول المطلوبة بما فيها الإمارة");
      return;
    }

    const orderStatus = payment === "cash" ? "confirmed" : "pending";

    setSubmitting(true);

    try {
      const newOrder = await addOrder({
        customerId: user?.id,
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: user?.email,
        emirate: form.emirate,
        address: form.address,
        notes: form.notes,
        items: items.map((it) => ({
          productId: it.product.id,
          productName: it.product.name,
          productNameAr: it.product.nameAr,
          price: it.product.price,
          qty: it.qty,
          image: it.product.images?.[0],
        })),
        subtotal,
        shipping,
        taxAmount,
        discountAmount,
        total,
        paymentMethod: payment,
        status: orderStatus,
        source: "website",
      });

      setOrderInfo({
        id: newOrder.id,
        status: orderStatus,
        payment,
      });

      setDone(true);
      setTimeout(() => clearCart(), 500);
    } catch (err) {
      console.error(err);
      alert("فشل إتمام الطلب. حاول مرة أخرى.");
      setSubmitting(false);
    }
  };

  // ═══════ Success ═══════
  if (done && orderInfo) {
    const isCash = orderInfo.payment === "cash";

    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-[#A88551]"
        >
          <Check className="h-10 w-10 text-white" strokeWidth={3} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 text-center max-w-lg"
        >
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1815]">
            {isCash ? "تم تأكيد طلبك" : "تم استلام طلبك"}
          </h1>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white border border-[#1C1815]/8 px-4 py-2">
            <Package className="h-3.5 w-3.5 text-[#A88551]" />
            <span className="font-mono text-xs text-[#1C1815]">
              #{orderInfo.id}
            </span>
            <span className="w-px h-3 bg-[#1C1815]/20" />
            <span
              className={`text-[10px] font-medium ${
                isCash ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {isCash ? "مؤكد" : "قيد المراجعة"}
            </span>
          </div>

          <p className="mt-6 text-sm sm:text-base text-[#6B6055] leading-loose">
            {isCash
              ? "شكراً لك! طلبك مؤكد وسيتم تجهيزه للشحن قريباً. الدفع نقداً عند الاستلام."
              : "شكراً لك! سيتم التواصل معك عبر واتساب خلال 24 ساعة لإتمام الدفع بالبطاقة وتأكيد الطلب."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 w-full max-w-md"
        >
          <div className="rounded-2xl border border-[#1C1815]/[0.06] bg-white p-6">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#A88551] mb-5 text-center">
              ما التالي؟
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#A88551] text-white">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <div>
                  <p className="text-sm font-medium text-[#1C1815]">
                    استلمنا طلبك
                  </p>
                  <p className="text-xs text-[#6B6055] mt-0.5">
                    تم تسجيل الطلب بنجاح
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    isCash
                      ? "bg-[#A88551] text-white"
                      : "bg-white border-2 border-[#A88551] text-[#A88551]"
                  }`}
                >
                  {isCash ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-medium text-[#1C1815]">
                    {isCash ? "تم تأكيد الطلب" : "تأكيد الدفع"}
                  </p>
                  <p className="text-xs text-[#6B6055] mt-0.5">
                    {isCash
                      ? "طلبك مؤكد وجاري التجهيز"
                      : "سنتواصل معك عبر واتساب لإتمام الدفع"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white border-2 border-[#1C1815]/15 text-[#6B6055]/40">
                  <Package className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-[#6B6055]/50">
                    الشحن والتوصيل
                  </p>
                  <p className="text-xs text-[#6B6055]/60 mt-0.5">
                    سيصلك الطلب خلال 2-5 أيام عمل
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-md"
        >
          {user ? (
            <Link
              href="/account"
              className="flex flex-1 items-center justify-center rounded-full bg-[#1C1815] px-6 py-3.5 text-sm text-white transition hover:bg-[#A88551]"
            >
              تابع طلبك من حسابك
            </Link>
          ) : (
            <Link
              href="/account/signup"
              className="flex flex-1 items-center justify-center rounded-full bg-[#1C1815] px-6 py-3.5 text-sm text-white transition hover:bg-[#A88551]"
            >
              أنشئ حساباً لمتابعة الطلب
            </Link>
          )}

          <Link
            href="/collections"
            className="flex flex-1 items-center justify-center rounded-full border border-[#1C1815]/15 px-6 py-3.5 text-sm text-[#6B6055] transition hover:border-[#A88551] hover:text-[#A88551]"
          >
            متابعة التسوق
          </Link>
        </motion.div>

        {!isCash && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 text-center text-xs text-[#6B6055] max-w-md"
          >
            <MessageCircle className="inline h-3.5 w-3.5 text-[#25D366] -mt-0.5" />{" "}
            سنتواصل معك على{" "}
            <span className="text-[#1C1815] font-medium" dir="ltr">
              {form.phone}
            </span>
          </motion.p>
        )}
      </div>
    );
  }

  // ═══════ Empty Cart ═══════
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center px-4 pt-32">
        <h1 className="font-serif text-3xl text-[#1C1815] mb-4">
          سلتك فارغة
        </h1>
        <Link
          href="/collections"
          className="rounded-full bg-[#1C1815] px-8 py-3 text-sm text-white"
        >
          تسوق الآن
        </Link>
      </div>
    );
  }

  // ═══════ Main Form ═══════
  return (
    <div dir="rtl" className="bg-[#FAF6F0] min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#A88551]">
            Checkout
          </p>
          <h1 className="mt-3 font-serif text-4xl text-[#1C1815]">
            إتمام الطلب
          </h1>
        </div>

        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#A88551]/20 bg-[#A88551]/5 px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <UserIcon className="h-5 w-5 text-[#A88551]" />
              <div>
                <p className="text-sm text-[#1C1815] font-medium">
                  هل لديك حساب؟
                </p>
                <p className="text-xs text-[#6B6055] mt-0.5">
                  سجّل دخولك لتعبئة بياناتك تلقائياً
                </p>
              </div>
            </div>
            <Link
              href="/account/signin"
              className="shrink-0 rounded-full bg-[#1C1815] px-5 py-2.5 text-xs text-white transition hover:bg-[#A88551]"
            >
              تسجيل الدخول
            </Link>
          </motion.div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-[#1C1815]/[0.06] bg-white p-6 space-y-5">
              <h2 className="font-serif text-xl text-[#1C1815]">
                معلومات التوصيل
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="الاسم الكامل *"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  required
                />
                <Input
                  label="رقم الهاتف *"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  required
                  type="tel"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
                  الإمارة / المنطقة *
                </label>
                <select
                  value={form.emirate}
                  onChange={(e) =>
                    setForm({ ...form, emirate: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#1C1815]/10 bg-white px-4 py-3.5 text-sm text-[#1C1815] focus:outline-none focus:border-[#A88551] transition"
                  required
                >
                  <option value="">اختر الإمارة</option>
                  {settings.emirates.map((em) => (
                    <option key={em} value={em}>
                      {em}
                    </option>
                  ))}
                </select>
                {form.emirate && (
                  <p className="mt-2 text-xs text-[#6B6055]">
                    سعر الشحن إلى {form.emirate}:{" "}
                    <span className="text-[#A88551] font-medium">
                      {shipping === 0 ? "مجاني" : formatPrice(shipping)}
                    </span>
                  </p>
                )}
              </div>

              <Input
                label="العنوان التفصيلي *"
                value={form.address}
                onChange={(v) => setForm({ ...form, address: v })}
                required
                placeholder="المبنى، الشارع، المنطقة"
              />

              <div>
                <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
                  ملاحظات (اختياري)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-xl border border-[#1C1815]/10 bg-white px-4 py-3.5 text-sm text-[#1C1815] focus:outline-none focus:border-[#A88551] transition resize-none"
                  placeholder="أي تفاصيل إضافية..."
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#1C1815]/[0.06] bg-white p-6">
              <h2 className="font-serif text-xl text-[#1C1815] mb-5">
                طريقة الدفع
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPayment("cash")}
                  className={`group relative rounded-2xl border-2 p-5 text-right transition-all duration-300 ${
                    payment === "cash"
                      ? "border-[#A88551] bg-[#A88551]/5"
                      : "border-[#1C1815]/8 hover:border-[#A88551]/40"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                        payment === "cash"
                          ? "bg-[#A88551] text-white"
                          : "bg-[#FAF6F0] text-[#6B6055]"
                      }`}
                    >
                      <Banknote className="h-5 w-5" />
                    </span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                        payment === "cash"
                          ? "border-[#A88551] bg-[#A88551]"
                          : "border-[#1C1815]/20"
                      }`}
                    >
                      {payment === "cash" && (
                        <Check
                          className="h-3 w-3 text-white"
                          strokeWidth={3}
                        />
                      )}
                    </span>
                  </div>
                  <p className="font-medium text-[#1C1815]">
                    الدفع عند التوصيل
                  </p>
                  <p className="mt-1 text-xs text-[#6B6055] leading-relaxed">
                    ادفع نقداً عند استلام طلبك
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPayment("visa")}
                  className={`group relative rounded-2xl border-2 p-5 text-right transition-all duration-300 ${
                    payment === "visa"
                      ? "border-[#A88551] bg-[#A88551]/5"
                      : "border-[#1C1815]/8 hover:border-[#A88551]/40"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                        payment === "visa"
                          ? "bg-[#A88551] text-white"
                          : "bg-[#FAF6F0] text-[#6B6055]"
                      }`}
                    >
                      <CreditCard className="h-5 w-5" />
                    </span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                        payment === "visa"
                          ? "border-[#A88551] bg-[#A88551]"
                          : "border-[#1C1815]/20"
                      }`}
                    >
                      {payment === "visa" && (
                        <Check
                          className="h-3 w-3 text-white"
                          strokeWidth={3}
                        />
                      )}
                    </span>
                  </div>
                  <p className="font-medium text-[#1C1815]">بطاقة فيزا</p>
                  <p className="mt-1 text-xs text-[#6B6055] leading-relaxed">
                    سنتواصل معك لإتمام الدفع
                  </p>
                </button>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#FAF6F0] p-4">
                <ShieldCheck className="h-5 w-5 text-[#A88551] shrink-0 mt-0.5" />
                <p className="text-xs text-[#6B6055] leading-relaxed">
                  {payment === "cash"
                    ? "طلبك سيؤكد مباشرة، والدفع نقداً عند الاستلام."
                    : "سيتم مراجعة طلبك، وسيتواصل معك فريقنا عبر واتساب لإتمام الدفع بالبطاقة."}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-[#1C1815]/[0.06] bg-white p-6 sticky top-28">
              <h2 className="font-serif text-xl text-[#1C1815] mb-6">
                ملخص الطلب
              </h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-[#6B6055]">
                      {item.product.name} × {item.qty}
                    </span>
                    <span className="text-[#1C1815]">
                      {formatPrice(item.product.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#1C1815]/10 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#6B6055]">
                  <span>المجموع</span>
                  <span className="text-[#1C1815]">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{settings.discount.label}</span>
                    <span>− {formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#6B6055]">
                  <span>الشحن</span>
                  <span className="text-[#1C1815]">
                    {form.emirate ? (
                      shipping === 0 ? (
                        <span className="text-green-600">مجاني</span>
                      ) : (
                        formatPrice(shipping)
                      )
                    ) : (
                      <span className="text-[#6B6055]/60 text-xs">
                        اختر الإمارة
                      </span>
                    )}
                  </span>
                </div>

                {taxAmount > 0 && (
                  <div className="flex justify-between text-[#6B6055]">
                    <span>
                      {settings.tax.label} ({settings.tax.rate}%)
                    </span>
                    <span className="text-[#1C1815]">
                      {formatPrice(taxAmount)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-[#1C1815]/10 pt-4 flex justify-between items-center">
                <span className="text-base text-[#1C1815]">الإجمالي</span>
                <span className="font-serif text-2xl text-[#1C1815]">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#1C1815] py-4 text-sm font-medium text-white transition hover:bg-[#A88551] disabled:opacity-60"
              >
                {submitting ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    تأكيد الطلب
                  </>
                )}
              </button>

              <Link
                href="/cart"
                className="mt-3 flex w-full items-center justify-center rounded-full border border-[#1C1815]/10 py-3 text-sm text-[#6B6055] transition hover:border-[#A88551]"
              >
                العودة للسلة
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
  type = "text",
  dir,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  dir?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        dir={dir}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#1C1815]/10 bg-white px-4 py-3.5 text-sm text-[#1C1815] focus:outline-none focus:border-[#A88551] transition"
      />
    </div>
  );
}