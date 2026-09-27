"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Package,
  Heart,
  LogOut,
  Save,
  ChevronLeft,
  ChevronDown,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  MapPin,
  Phone,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  useOrders,
  STATUS_LABELS,
  type Order,
  type OrderStatus,
} from "@/context/OrdersContext";
import { formatPrice } from "@/lib/utils";

export default function AccountPage() {
  const router = useRouter();
  const { user, isReady, signOut, updateProfile } = useAuth();
  const { items: wishlist } = useWishlist();
  const { orders } = useOrders();
  const [tab, setTab] = useState<"profile" | "orders" | "wishlist">("profile");
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [saved, setSaved] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      router.push("/account/signin");
    } else {
      setProfile({ name: user.name, phone: user.phone });
    }
  }, [user, isReady, router]);

  if (!isReady || !user) return null;

  // فلترة طلبات العميل
  const myOrders = orders.filter(
    (o) => o.customerId === user.id || o.customerEmail === user.email
  );

  const handleSave = () => {
    updateProfile({ name: profile.name, phone: profile.phone });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  const tabs = [
    { id: "profile", label: "بياناتي", icon: UserIcon },
    { id: "orders", label: "طلباتي", icon: Package, badge: myOrders.length },
    { id: "wishlist", label: "المفضلة", icon: Heart, badge: wishlist.length },
  ] as const;

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAF6F0] pt-28 pb-20 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#A88551]">
            My Account
          </p>
          <h1 className="mt-3 font-serif text-4xl text-[#1C1815]">
            مرحباً، {user.name.split(" ")[0]}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-[#1C1815]/[0.06] bg-white p-3">
              <nav className="space-y-1">
                {tabs.map((t) => {
                  const Icon = t.icon;
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm transition ${
                        active
                          ? "bg-[#1C1815] text-white"
                          : "text-[#6B6055] hover:bg-[#FAF6F0]"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        {t.label}
                      </span>
                      {"badge" in t && t.badge !== undefined && t.badge > 0 && (
                        <span
                          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-medium ${
                            active
                              ? "bg-[#C9AE84] text-[#1C1815]"
                              : "bg-[#FAF6F0] text-[#A88551]"
                          }`}
                        >
                          {t.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-500 transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-[#1C1815]/[0.06] bg-white p-6 sm:p-8"
              >
                {/* ═════ Profile ═════ */}
                {tab === "profile" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-serif text-2xl text-[#1C1815]">
                        بياناتي
                      </h2>
                      {!editing && (
                        <button
                          onClick={() => setEditing(true)}
                          className="text-sm text-[#A88551] hover:underline"
                        >
                          تعديل
                        </button>
                      )}
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
                          الاسم الكامل
                        </label>
                        {editing ? (
                          <input
                            value={profile.name}
                            onChange={(e) =>
                              setProfile({ ...profile, name: e.target.value })
                            }
                            className="w-full rounded-xl border border-[#1C1815]/10 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#A88551]"
                          />
                        ) : (
                          <p className="text-[#1C1815]">{user.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
                          البريد الإلكتروني
                        </label>
                        <p className="text-[#1C1815]" dir="ltr">
                          {user.email}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
                          رقم الهاتف
                        </label>
                        {editing ? (
                          <input
                            value={profile.phone}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                phone: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-[#1C1815]/10 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#A88551]"
                            dir="ltr"
                          />
                        ) : (
                          <p className="text-[#1C1815]" dir="ltr">
                            {user.phone}
                          </p>
                        )}
                      </div>

                      {editing && (
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            onClick={handleSave}
                            className="flex items-center gap-2 rounded-full bg-[#1C1815] px-6 py-3 text-sm text-white transition hover:bg-[#A88551]"
                          >
                            <Save className="h-4 w-4" />
                            حفظ
                          </button>
                          <button
                            onClick={() => {
                              setEditing(false);
                              setProfile({
                                name: user.name,
                                phone: user.phone,
                              });
                            }}
                            className="rounded-full border border-[#1C1815]/10 px-6 py-3 text-sm text-[#6B6055]"
                          >
                            إلغاء
                          </button>
                          {saved && (
                            <span className="text-sm text-green-600">
                              ✓ تم الحفظ
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ═════ Orders ═════ */}
                {tab === "orders" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-serif text-2xl text-[#1C1815]">
                        طلباتي
                      </h2>
                      {myOrders.length > 0 && (
                        <span className="text-xs text-[#6B6055]">
                          {myOrders.length} طلب
                        </span>
                      )}
                    </div>

                    {myOrders.length === 0 ? (
                      <div className="py-12 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF6F0] mx-auto mb-4">
                          <Package className="h-6 w-6 text-[#A88551]" />
                        </div>
                        <p className="text-sm text-[#6B6055] mb-6">
                          لا توجد طلبات بعد
                        </p>
                        <Link
                          href="/collections"
                          className="inline-flex items-center gap-2 rounded-full bg-[#1C1815] px-6 py-3 text-sm text-white transition hover:bg-[#A88551]"
                        >
                          ابدأ التسوق
                          <ChevronLeft className="h-4 w-4" />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {myOrders.map((order) => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            expanded={expandedOrder === order.id}
                            onToggle={() =>
                              setExpandedOrder(
                                expandedOrder === order.id ? null : order.id
                              )
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ═════ Wishlist ═════ */}
                {tab === "wishlist" && (
                  <div>
                    <h2 className="font-serif text-2xl text-[#1C1815] mb-6">
                      المفضلة
                    </h2>
                    {wishlist.length === 0 ? (
                      <div className="py-12 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF6F0] mx-auto mb-4">
                          <Heart className="h-6 w-6 text-[#A88551]" />
                        </div>
                        <p className="text-sm text-[#6B6055] mb-6">
                          لا توجد منتجات في المفضلة
                        </p>
                        <Link
                          href="/collections"
                          className="inline-flex items-center gap-2 rounded-full bg-[#1C1815] px-6 py-3 text-sm text-white transition hover:bg-[#A88551]"
                        >
                          تصفح العطور
                        </Link>
                      </div>
                    ) : (
                      <Link
                        href="/wishlist"
                        className="inline-flex items-center gap-2 text-[#A88551] hover:underline text-sm"
                      >
                        عرض المفضلة ({wishlist.length} منتج)
                        <ChevronLeft className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Order Card with Timeline
   ═══════════════════════════════════════ */

function OrderCard({
  order,
  expanded,
  onToggle,
}: {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
}) {
  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="border border-[#1C1815]/8 rounded-2xl overflow-hidden transition-all hover:border-[#A88551]/30">
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 hover:bg-[#FAF6F0]/50 transition text-right"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${statusInfo.bg}`}
          >
            {statusInfo.icon}
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-mono text-xs text-[#6B6055]">#{order.id}</p>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusInfo.badge}`}
              >
                {STATUS_LABELS[order.status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-[#1C1815] font-medium">
              {order.items.length} منتج ·{" "}
              {new Date(order.createdAt).toLocaleDateString("ar-AE")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="font-serif text-lg text-[#1C1815] hidden sm:block">
            {formatPrice(order.total)}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-[#6B6055] transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Body - expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#1C1815]/8 p-4 sm:p-6 space-y-6 bg-[#FAF6F0]/30">
              {/* Timeline */}
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#A88551] mb-4">
                  حالة الطلب
                </p>
                <OrderTimeline status={order.status} />
              </div>

              {/* Items */}
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#A88551] mb-3">
                  المنتجات
                </p>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 bg-white rounded-xl p-3"
                    >
                      {item.image && (
                        <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-[#FAF6F0] shrink-0">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1C1815] truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-[#6B6055]">
                          {item.productNameAr}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-[#6B6055]">
                          × {item.qty}
                        </p>
                        <p className="text-sm text-[#1C1815]">
                          {formatPrice(item.price * item.qty)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary + Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Summary */}
                <div className="bg-white rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-[#6B6055]">
                    <span>المجموع</span>
                    <span className="text-[#1C1815]">
                      {formatPrice(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#6B6055]">
                    <span>الشحن</span>
                    <span className="text-[#1C1815]">
                      {formatPrice(order.shipping)}
                    </span>
                  </div>
                  <div className="border-t border-[#1C1815]/10 pt-2 mt-2 flex justify-between">
                    <span className="text-[#1C1815] font-medium">الإجمالي</span>
                    <span className="font-serif text-lg text-[#1C1815]">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                  <div className="pt-2 flex justify-between text-xs">
                    <span className="text-[#6B6055]">طريقة الدفع</span>
                    <span className="text-[#1C1815]">
                      {order.paymentMethod === "cash"
                        ? "كاش عند التوصيل"
                        : "بطاقة فيزا"}
                    </span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-white rounded-xl p-4 space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-[#A88551] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#6B6055]">عنوان التوصيل</p>
                      <p className="text-[#1C1815] text-xs leading-relaxed mt-0.5">
                        {order.address}
                        {order.emirate && ` — ${order.emirate}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-[#A88551] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-[#6B6055]">الجوال</p>
                      <p className="text-[#1C1815]" dir="ltr">
                        {order.customerPhone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/971521695582?text=${encodeURIComponent(
                    `مرحباً، بخصوص طلبي #${order.id}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-medium text-white transition hover:bg-[#1da851]"
                >
                  استفسار عبر واتساب
                </a>
                <Link
                  href="/contact"
                  className="flex flex-1 items-center justify-center rounded-full border border-[#1C1815]/10 py-3 text-sm text-[#6B6055] transition hover:border-[#A88551]"
                >
                  تواصل معنا
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════
   Timeline Component
   ═══════════════════════════════════════ */

function OrderTimeline({ status }: { status: OrderStatus }) {
  // لو الطلب ملغي → عرض حالة مخصصة
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white">
          <XCircle className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-red-700">تم إلغاء الطلب</p>
          <p className="text-xs text-red-600/70 mt-0.5">
            لأي استفسار، تواصل معنا عبر واتساب
          </p>
        </div>
      </div>
    );
  }

  const steps: {
    id: OrderStatus;
    label: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      id: "pending",
      label: "قيد المراجعة",
      icon: <Clock className="h-4 w-4" />,
      description: "استلمنا طلبك وسنراجعه قريباً",
    },
    {
      id: "confirmed",
      label: "مؤكد",
      icon: <CheckCircle2 className="h-4 w-4" />,
      description: "تم تأكيد الطلب وجاري التجهيز",
    },
    {
      id: "shipped",
      label: "تم الشحن",
      icon: <Truck className="h-4 w-4" />,
      description: "طلبك في الطريق إليك",
    },
    {
      id: "delivered",
      label: "تم التوصيل",
      icon: <CheckCircle2 className="h-4 w-4" />,
      description: "استلمت طلبك بنجاح",
    },
  ];

  const currentIndex = steps.findIndex((s) => s.id === status);

  return (
    <div className="relative">
      {/* خط رأسي (موبايل) / أفقي (ديسكتوب) */}
      <div className="hidden sm:block absolute top-5 right-5 left-5 h-0.5 bg-[#1C1815]/8">
        <div
          className="h-full bg-gradient-to-l from-[#A88551] to-[#C9AE84] transition-all duration-700"
          style={{
            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
            marginRight: 0,
            marginLeft: "auto",
          }}
        />
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative">
        {steps.map((step, i) => {
          const isDone = i <= currentIndex;
          const isActive = i === currentIndex;
          return (
            <div key={step.id} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-right sm:text-center">
              {/* أيقونة */}
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                  isActive
                    ? "bg-[#A88551] border-[#A88551] text-white shadow-[0_0_0_4px_rgba(168,133,81,0.15)]"
                    : isDone
                    ? "bg-[#C9AE84] border-[#C9AE84] text-white"
                    : "bg-white border-[#1C1815]/15 text-[#6B6055]/40"
                }`}
              >
                {step.icon}
              </span>

              {/* النص */}
              <div className="flex-1 sm:flex-none">
                <p
                  className={`text-xs sm:text-[11px] font-medium transition-colors ${
                    isDone ? "text-[#1C1815]" : "text-[#6B6055]/50"
                  }`}
                >
                  {step.label}
                </p>
                <p
                  className={`text-[10px] mt-0.5 leading-relaxed ${
                    isActive
                      ? "text-[#A88551]"
                      : isDone
                      ? "text-[#6B6055]"
                      : "text-[#6B6055]/40"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Helper
   ═══════════════════════════════════════ */

function getStatusInfo(status: OrderStatus) {
  const map: Record<
    OrderStatus,
    { bg: string; badge: string; icon: React.ReactNode }
  > = {
    pending: {
      bg: "bg-yellow-100",
      badge: "bg-yellow-100 text-yellow-700",
      icon: <Clock className="h-5 w-5 text-yellow-700" />,
    },
    confirmed: {
      bg: "bg-blue-100",
      badge: "bg-blue-100 text-blue-700",
      icon: <CheckCircle2 className="h-5 w-5 text-blue-700" />,
    },
    shipped: {
      bg: "bg-purple-100",
      badge: "bg-purple-100 text-purple-700",
      icon: <Truck className="h-5 w-5 text-purple-700" />,
    },
    delivered: {
      bg: "bg-green-100",
      badge: "bg-green-100 text-green-700",
      icon: <CheckCircle2 className="h-5 w-5 text-green-700" />,
    },
    cancelled: {
      bg: "bg-red-100",
      badge: "bg-red-100 text-red-700",
      icon: <XCircle className="h-5 w-5 text-red-700" />,
    },
  };
  return map[status];
}