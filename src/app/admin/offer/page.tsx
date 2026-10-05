"use client";

import { useState, useEffect } from "react";
import { Save, Eye, EyeOff, Gift } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import type { OfferBanner } from "@/data/siteContent";

export default function OfferAdminPage() {
  const { content, updateOfferBanner } = useSiteContent();
  const [banner, setBanner] = useState<OfferBanner>(content.offerBanner);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setBanner(content.offerBanner);
  }, [content.offerBanner]);

  const update = (key: keyof OfferBanner, value: any) =>
    setBanner((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    await updateOfferBanner(banner);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls =
    "w-full rounded-lg border border-[#1C1815]/10 bg-white px-4 py-3 text-sm text-[#1C1815] focus:outline-none focus:border-[#A88551]";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1815]">
            العرض الترويجي
          </h1>
          <p className="mt-1 text-sm text-[#6B6055]">
            تحكم كامل في بطاقة العرض في الصفحة الرئيسية
          </p>
        </div>

        <button
          onClick={() => update("enabled", !banner.enabled)}
          className={`self-start flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium transition ${
            banner.enabled
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {banner.enabled ? (
            <>
              <Eye className="h-3.5 w-3.5" /> مفعّل
            </>
          ) : (
            <>
              <EyeOff className="h-3.5 w-3.5" /> معطّل
            </>
          )}
        </button>
      </div>

      {/* معاينة */}
      <div className="mb-6 rounded-2xl border border-[#1C1815]/[0.06] bg-white p-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#A88551] mb-4">
          معاينة
        </p>

        <div
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1C1815] to-[#2A241D] px-6 sm:px-8 py-8 transition-opacity ${
            !banner.enabled ? "opacity-40" : ""
          }`}
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#C9AE84]/10 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-right">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                <Gift className="h-4 w-4 text-[#C9AE84]" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9AE84]">
                  {banner.badge}
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl text-white">
                {banner.title}
              </h3>

              <div className="mt-3 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <span className="font-serif text-2xl text-[#C9AE84]">
                  {banner.price}
                </span>
                {banner.oldPrice && (
                  <span className="text-white/40 line-through">
                    {banner.oldPrice}
                  </span>
                )}
                {banner.discountText && (
                  <span className="rounded-full bg-[#C9AE84]/20 px-3 py-1 text-[10px] text-[#C9AE84]">
                    {banner.discountText}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 rounded-full bg-[#C9AE84] px-6 py-3 text-sm font-medium text-[#1C1815]">
              {banner.ctaText}
            </div>
          </div>
        </div>

        {!banner.enabled && (
          <p className="mt-3 text-xs text-[#6B6055] text-center">
            العرض معطّل حالياً — لن يظهر في الموقع
          </p>
        )}
      </div>

      {/* الحقول */}
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-6 space-y-4">
          <Field label="Badge (التسمية العلوية)">
            <input
              value={banner.badge}
              onChange={(e) => update("badge", e.target.value)}
              className={inputCls}
              placeholder="عرض خاص"
            />
          </Field>

          <Field label="العنوان الرئيسي">
            <input
              value={banner.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputCls}
              placeholder="العطران معاً بسعر مميز"
            />
          </Field>

          <Field label="السعر الجديد">
            <input
              value={banner.price}
              onChange={(e) => update("price", e.target.value)}
              className={inputCls}
              placeholder="229 د.إ"
            />
          </Field>

          <Field label="السعر القديم">
            <input
              value={banner.oldPrice}
              onChange={(e) => update("oldPrice", e.target.value)}
              className={inputCls}
              placeholder="258 د.إ"
            />
          </Field>

          <Field label="نص الخصم">
            <input
              value={banner.discountText}
              onChange={(e) => update("discountText", e.target.value)}
              className={inputCls}
              placeholder="وفّر 11%"
            />
          </Field>

          <Field label="نص الزر">
            <input
              value={banner.ctaText}
              onChange={(e) => update("ctaText", e.target.value)}
              className={inputCls}
              placeholder="اطلب العرض"
            />
          </Field>
        </div>

        <div className="flex justify-end gap-3">
          {saved && (
            <span className="flex items-center text-sm text-green-600">
              ✓ تم الحفظ
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-full bg-[#1C1815] px-8 py-3 text-sm text-white transition hover:bg-[#A88551]"
          >
            <Save className="h-4 w-4" />
            حفظ التغييرات
          </button>
        </div>
      </div>
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