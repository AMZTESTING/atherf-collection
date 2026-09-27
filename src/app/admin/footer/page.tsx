"use client";

import { useState, useEffect } from "react";
import { Save, Plus, X } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import type { FooterLink } from "@/data/siteContent";

export default function FooterAdminPage() {
  const { content, updateFooter } = useSiteContent();
  const [footer, setFooter] = useState(content.footer);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFooter(content.footer);
  }, [content.footer]);

  const update = (key: keyof typeof footer, value: any) =>
    setFooter((prev) => ({ ...prev, [key]: value }));

  const updateSocial = (key: keyof typeof footer.social, value: string) =>
    setFooter((prev) => ({
      ...prev,
      social: { ...prev.social, [key]: value },
    }));

  const addLink = (type: "quickLinks" | "serviceLinks") =>
    setFooter((prev) => ({
      ...prev,
      [type]: [...prev[type], { label: "", href: "" }],
    }));

  const updateLink = (
    type: "quickLinks" | "serviceLinks",
    index: number,
    key: keyof FooterLink,
    value: string
  ) =>
    setFooter((prev) => ({
      ...prev,
      [type]: prev[type].map((l, i) =>
        i === index ? { ...l, [key]: value } : l
      ),
    }));

  const removeLink = (type: "quickLinks" | "serviceLinks", index: number) =>
    setFooter((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));

  const handleSave = async () => {
    await updateFooter(footer);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls =
    "w-full rounded-lg border border-[#1C1815]/10 bg-white px-4 py-3 text-sm text-[#1C1815] focus:outline-none focus:border-[#A88551]";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1815]">
          تعديل الفوتر
        </h1>
        <p className="mt-2 text-sm text-[#6B6055]">
          تحكم كامل في محتوى الفوتر وروابطه
        </p>
      </div>

      <div className="space-y-5 lg:space-y-6">
        <Card title="قسم البراند (العمود الأول)">
          <div className="space-y-4">
            <Field label="اسم البراند">
              <input
                value={footer.brandName}
                onChange={(e) => update("brandName", e.target.value)}
                className={inputCls}
              />
            </Field>

            <Field label="الوصف">
              <textarea
                value={footer.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </Field>
          </div>
        </Card>

        <Card title="روابط السوشيال ميديا">
          <div className="space-y-4">
            <Field label="Instagram">
              <input
                value={footer.social.instagram}
                onChange={(e) => updateSocial("instagram", e.target.value)}
                className={inputCls}
                dir="ltr"
              />
            </Field>
            <Field label="TikTok">
              <input
                value={footer.social.tiktok}
                onChange={(e) => updateSocial("tiktok", e.target.value)}
                className={inputCls}
                dir="ltr"
              />
            </Field>
            <Field label="WhatsApp">
              <input
                value={footer.social.whatsapp}
                onChange={(e) => updateSocial("whatsapp", e.target.value)}
                className={inputCls}
                dir="ltr"
              />
            </Field>
          </div>
        </Card>

        <Card
          title="الروابط السريعة"
          action={
            <button
              type="button"
              onClick={() => addLink("quickLinks")}
              className="flex items-center gap-1 rounded-lg bg-[#1C1815] px-3 py-1.5 text-xs text-white hover:bg-[#A88551]"
            >
              <Plus className="h-3 w-3" /> إضافة
            </button>
          }
        >
          <Field label="عنوان العمود">
            <input
              value={footer.quickLinksTitle}
              onChange={(e) => update("quickLinksTitle", e.target.value)}
              className={inputCls}
            />
          </Field>

          <div className="space-y-3 mt-4">
            {footer.quickLinks.map((link, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2">
                <input
                  value={link.label}
                  onChange={(e) =>
                    updateLink("quickLinks", i, "label", e.target.value)
                  }
                  placeholder="اسم الرابط"
                  className={`${inputCls} flex-1`}
                />
                <input
                  value={link.href}
                  onChange={(e) =>
                    updateLink("quickLinks", i, "href", e.target.value)
                  }
                  placeholder="/collections"
                  className={`${inputCls} flex-1`}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => removeLink("quickLinks", i)}
                  className="flex h-11 items-center justify-center rounded-lg bg-red-500/10 px-3 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="روابط خدمة العملاء"
          action={
            <button
              type="button"
              onClick={() => addLink("serviceLinks")}
              className="flex items-center gap-1 rounded-lg bg-[#1C1815] px-3 py-1.5 text-xs text-white hover:bg-[#A88551]"
            >
              <Plus className="h-3 w-3" /> إضافة
            </button>
          }
        >
          <Field label="عنوان العمود">
            <input
              value={footer.serviceLinksTitle}
              onChange={(e) => update("serviceLinksTitle", e.target.value)}
              className={inputCls}
            />
          </Field>

          <div className="space-y-3 mt-4">
            {footer.serviceLinks.map((link, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2">
                <input
                  value={link.label}
                  onChange={(e) =>
                    updateLink("serviceLinks", i, "label", e.target.value)
                  }
                  placeholder="اسم الرابط"
                  className={`${inputCls} flex-1`}
                />
                <input
                  value={link.href}
                  onChange={(e) =>
                    updateLink("serviceLinks", i, "href", e.target.value)
                  }
                  placeholder="/shipping"
                  className={`${inputCls} flex-1`}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => removeLink("serviceLinks", i)}
                  className="flex h-11 items-center justify-center rounded-lg bg-red-500/10 px-3 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="تواصل معنا (العمود الرابع)">
          <div className="space-y-4">
            <Field label="عنوان العمود">
              <input
                value={footer.contactTitle}
                onChange={(e) => update("contactTitle", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="رقم الهاتف">
              <input
                value={footer.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputCls}
                dir="ltr"
              />
            </Field>
            <Field label="البريد الإلكتروني">
              <input
                value={footer.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputCls}
                dir="ltr"
              />
            </Field>
            <Field label="الدولة">
              <input
                value={footer.country}
                onChange={(e) => update("country", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </Card>

        <Card title="الشريط السفلي">
          <div className="space-y-4">
            <Field label="حقوق النشر">
              <input
                value={footer.copyright}
                onChange={(e) => update("copyright", e.target.value)}
                className={inputCls}
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="نص العلامة">
                <input
                  value={footer.tagline}
                  onChange={(e) => update("tagline", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="اسم العلامة المميز">
                <input
                  value={footer.taglineBrand}
                  onChange={(e) => update("taglineBrand", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          {saved && (
            <span className="flex items-center text-sm text-green-600">
              ✓ تم الحفظ
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-full bg-[#1C1815] px-6 sm:px-8 py-3 text-sm text-white transition hover:bg-[#A88551]"
          >
            <Save className="h-4 w-4" />
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-base sm:text-lg text-[#1C1815]">
          {title}
        </h2>
        {action}
      </div>
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