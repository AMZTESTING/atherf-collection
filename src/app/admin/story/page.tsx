"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Save, Plus, X, Upload } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { supabase } from "@/lib/supabase";

export default function StoryAdminPage() {
  const { content, updateStory } = useSiteContent();
  const [story, setStory] = useState(content.story);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setStory(content.story);
  }, [content.story]);

  const update = (key: keyof typeof story, value: any) =>
    setStory((prev) => ({ ...prev, [key]: value }));

  const updateStat = (i: number, key: "value" | "label", value: string) => {
    const stats = [...story.stats];
    stats[i] = { ...stats[i], [key]: value };
    update("stats", stats);
  };

  const addStat = () =>
    update("stats", [...story.stats, { value: "", label: "" }]);

  const removeStat = (i: number) =>
    update(
      "stats",
      story.stats.filter((_, idx) => idx !== i)
    );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressed = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new window.Image();
          img.onload = () => {
            const MAX = 900;
            let { width, height } = img;
            if (width > height && width > MAX) {
              height = (height * MAX) / width;
              width = MAX;
            } else if (height > MAX) {
              width = (width * MAX) / height;
              height = MAX;
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
          };
          img.src = ev.target?.result as string;
        };
        reader.readAsDataURL(file);
      });

      const fileName = `story-${Date.now()}.jpg`;
      const res = await fetch(compressed);
      const blob = await res.blob();

      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (error) {
        alert("فشل رفع الصورة: " + error.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      update("image", urlData.publicUrl);
    } catch (err) {
      console.error(err);
      alert("فشل رفع الصورة");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    await updateStory(story);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls =
    "w-full rounded-lg border border-[#1C1815]/10 bg-white px-4 py-3 text-sm text-[#1C1815] focus:outline-none focus:border-[#A88551]";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1815] mb-6">
        تعديل قسم قصتنا
      </h1>

      <div className="space-y-5 lg:space-y-6">
        <Card title="الصورة">
          <div className="space-y-4">
            {story.image && (
              <div className="relative aspect-[4/5] max-w-xs rounded-2xl overflow-hidden bg-[#FAF6F0]">
                <Image
                  src={story.image}
                  alt="story"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => update("image", "")}
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <label className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#1C1815]/15 py-4 cursor-pointer text-sm text-[#6B6055] hover:border-[#A88551] transition">
              <Upload className="h-4 w-4" />
              {uploading
                ? "جاري الرفع..."
                : story.image
                ? "تغيير الصورة"
                : "ارفع صورة"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </Card>

        <Card title="المحتوى">
          <div className="space-y-4">
            <Field label="Label العلوي">
              <input
                value={story.label}
                onChange={(e) => update("label", e.target.value)}
                className={inputCls}
              />
            </Field>

            <Field label="العنوان">
              <input
                value={story.title}
                onChange={(e) => update("title", e.target.value)}
                className={inputCls}
              />
            </Field>

            <Field label="الفقرة الأولى">
              <textarea
                value={story.paragraph1}
                onChange={(e) => update("paragraph1", e.target.value)}
                rows={4}
                className={`${inputCls} resize-none`}
              />
            </Field>

            <Field label="الفقرة الثانية (اختياري)">
              <textarea
                value={story.paragraph2}
                onChange={(e) => update("paragraph2", e.target.value)}
                rows={4}
                className={`${inputCls} resize-none`}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="نص الزر">
                <input
                  value={story.ctaText}
                  onChange={(e) => update("ctaText", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="رابط الزر">
                <input
                  value={story.ctaLink}
                  onChange={(e) => update("ctaLink", e.target.value)}
                  className={inputCls}
                  dir="ltr"
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card
          title="الأرقام / الإحصائيات"
          action={
            <button
              type="button"
              onClick={addStat}
              className="flex items-center gap-1 rounded-lg bg-[#1C1815] px-3 py-1.5 text-xs text-white hover:bg-[#A88551]"
            >
              <Plus className="h-3 w-3" /> إضافة
            </button>
          }
        >
          <div className="space-y-3">
            {story.stats.map((s, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2">
                <input
                  value={s.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                  placeholder="القيمة"
                  className={`${inputCls} flex-1`}
                />
                <input
                  value={s.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                  placeholder="الوصف"
                  className={`${inputCls} flex-1`}
                />
                <button
                  type="button"
                  onClick={() => removeStat(i)}
                  className="flex h-11 items-center justify-center rounded-lg bg-red-500/10 px-3 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
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
            disabled={uploading}
            className="flex items-center gap-2 rounded-full bg-[#1C1815] px-6 sm:px-8 py-3 text-sm text-white transition hover:bg-[#A88551] disabled:opacity-50"
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