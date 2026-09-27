"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, X, Upload } from "lucide-react";
import type { Product } from "@/types";
import { supabase } from "@/lib/supabase";

const categories = ["رجالي", "نسائي", "عود", "نيش"] as const;

export default function ProductForm({
  initial,
  onSave,
  title,
}: {
  initial?: Product;
  onSave: (p: Product) => Promise<void> | void;
  title: string;
}) {
  const router = useRouter();

  const [form, setForm] = useState<Product>(
    initial || {
      id: Date.now().toString(),
      slug: "",
      name: "",
      nameAr: "",
      tagline: "",
      description: "",
      notes: [],
      price: 129,
      images: [],
      category: "نيش",
      collection: "",
      sizes: ["100ml"],
      rating: 4.8,
      reviewsCount: 0,
      inStock: true,
      featured: true,
      bestSeller: false,
      isNew: true,
    }
  );

  const [noteInput, setNoteInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (key: keyof Product, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addNote = () => {
    if (noteInput.trim()) {
      update("notes", [...form.notes, noteInput.trim()]);
      setNoteInput("");
    }
  };

  const removeNote = (i: number) =>
    update("notes", form.notes.filter((_, idx) => idx !== i));

  const addImage = () => {
    if (imageInput.trim()) {
      update("images", [...form.images, imageInput.trim()]);
      setImageInput("");
    }
  };

  const removeImage = (i: number) =>
    update("images", form.images.filter((_, idx) => idx !== i));

  // ═══════════════════════════════════════════════
  //   رفع الصور مع ضغط تلقائي + Supabase Storage
  // ═══════════════════════════════════════════════
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        // 1. ضغط الصورة
        const compressed = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const img = new window.Image();
            img.onload = () => {
              const MAX = 800;
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
              resolve(canvas.toDataURL("image/jpeg", 0.8));
            };
            img.src = ev.target?.result as string;
          };
          reader.readAsDataURL(file);
        });

        // 2. تحويل base64 إلى Blob
        const res = await fetch(compressed);
        const blob = await res.blob();

        // 3. رفع إلى Supabase Storage
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.jpg`;
        const { error } = await supabase.storage
          .from("product-images")
          .upload(fileName, blob, {
            contentType: "image/jpeg",
            upsert: false,
          });

        if (error) {
          console.error("Upload failed:", error);
          alert("فشل رفع الصورة: " + error.message);
          continue;
        }

        // 4. الحصول على الرابط العام
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        // 5. إضافة الرابط إلى النموذج
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, urlData.publicUrl],
        }));
      } catch (err) {
        console.error("Upload error:", err);
        alert("فشل رفع الصورة");
      }
    }

    setUploading(false);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.nameAr) {
      alert("اسم المنتج مطلوب");
      return;
    }
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");

    setSaving(true);
    try {
      await onSave({ ...form, slug });
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("فشل الحفظ");
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-[#1C1815]/10 bg-white px-4 py-3 text-sm text-[#1C1815] focus:outline-none focus:border-[#A88551]";

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-serif text-3xl text-[#1C1815] mb-8">{title}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic */}
        <Card title="المعلومات الأساسية">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="الاسم بالإنجليزية">
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="AZURE"
                className={inputCls}
              />
            </Field>
            <Field label="الاسم بالعربية">
              <input
                value={form.nameAr}
                onChange={(e) => update("nameAr", e.target.value)}
                placeholder="أزور"
                className={inputCls}
              />
            </Field>
            <Field label="Tagline">
              <input
                value={form.tagline}
                onChange={(e) => update("tagline", e.target.value)}
                placeholder="كريمي – ناعم – منعش"
                className={inputCls}
              />
            </Field>
            <Field label="Collection">
              <input
                value={form.collection}
                onChange={(e) => update("collection", e.target.value)}
                placeholder="Azure Line"
                className={inputCls}
              />
            </Field>
          </div>
        </Card>

        {/* Price */}
        <Card title="السعر والتصنيف">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="السعر (د.إ)">
              <input
                type="number"
                value={form.price}
                onChange={(e) => update("price", Number(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="الفئة">
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className={inputCls}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="الحجم">
              <input
                value={form.sizes.join(", ")}
                onChange={(e) =>
                  update(
                    "sizes",
                    e.target.value.split(",").map((s) => s.trim())
                  )
                }
                placeholder="100ml"
                className={inputCls}
              />
            </Field>
          </div>
        </Card>

        {/* Description */}
        <Card title="الوصف">
          <Field label="الوصف الكامل">
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              className={`${inputCls} resize-none`}
              placeholder="اكتب وصف المنتج..."
            />
          </Field>
        </Card>

        {/* Notes */}
        <Card title="النوتات العطرية">
          <div className="flex gap-2 mb-4">
            <input
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addNote())
              }
              placeholder="مثال: البرغموت"
              className={`${inputCls} flex-1`}
            />
            <button
              type="button"
              onClick={addNote}
              className="rounded-lg bg-[#1C1815] px-4 text-white hover:bg-[#A88551]"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.notes.map((note, i) => (
              <span
                key={i}
                className="flex items-center gap-2 rounded-full bg-[#FAF6F0] px-4 py-1.5 text-sm text-[#1C1815]"
              >
                {note}
                <button
                  type="button"
                  onClick={() => removeNote(i)}
                  className="text-[#6B6055] hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </Card>

        {/* Images */}
        <Card title="الصور">
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addImage())
                }
                placeholder="الصق رابط الصورة..."
                className={`${inputCls} flex-1`}
              />
              <button
                type="button"
                onClick={addImage}
                className="rounded-lg bg-[#1C1815] px-4 text-white hover:bg-[#A88551]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <label
              className={`flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#1C1815]/15 py-4 cursor-pointer text-sm text-[#6B6055] transition hover:border-[#A88551] hover:text-[#A88551] ${
                uploading ? "opacity-60 cursor-wait" : ""
              }`}
            >
              <Upload className="h-4 w-4" />
              {uploading
                ? "جاري رفع الصور..."
                : "أو ارفع صور من جهازك (تُضغط تلقائياً)"}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>

            {form.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {form.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-lg overflow-hidden bg-[#FAF6F0] group"
                  >
                    <Image
                      src={img}
                      alt={`صورة ${i + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Status */}
        <Card title="الحالة">
          <div className="flex flex-wrap gap-6">
            <Toggle
              label="متوفر"
              checked={form.inStock}
              onChange={(v) => update("inStock", v)}
            />
            <Toggle
              label="مميز"
              checked={!!form.featured}
              onChange={(v) => update("featured", v)}
            />
            <Toggle
              label="الأكثر مبيعاً"
              checked={!!form.bestSeller}
              onChange={(v) => update("bestSeller", v)}
            />
            <Toggle
              label="جديد"
              checked={!!form.isNew}
              onChange={(v) => update("isNew", v)}
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="rounded-full border border-[#1C1815]/10 px-6 py-3 text-sm text-[#6B6055] transition hover:border-[#A88551]"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-full bg-[#1C1815] px-8 py-3 text-sm text-white transition hover:bg-[#A88551] disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : "حفظ المنتج"}
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
    <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-6">
      <h2 className="font-serif text-lg text-[#1C1815] mb-4">{title}</h2>
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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#A88551]"
      />
      <span className="text-sm text-[#1C1815]">{label}</span>
    </label>
  );
}