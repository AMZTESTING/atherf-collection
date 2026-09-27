"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, X, Save } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { supabase } from "@/lib/supabase";

export default function LogoAdminPage() {
  const { content, updateLogo } = useSiteContent();
  const [preview, setPreview] = useState(content.logo);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreview(content.logo);
  }, [content.logo]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressed = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new window.Image();
          img.onload = () => {
            const MAX = 400;
            let { width, height } = img;
            if (width > MAX || height > MAX) {
              if (width > height) {
                height = (height * MAX) / width;
                width = MAX;
              } else {
                width = (width * MAX) / height;
                height = MAX;
              }
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.drawImage(img, 0, 0, width, height);
            if (file.type === "image/png") {
              resolve(canvas.toDataURL("image/png"));
            } else {
              resolve(canvas.toDataURL("image/jpeg", 0.85));
            }
          };
          img.src = ev.target?.result as string;
        };
        reader.readAsDataURL(file);
      });

      const ext = file.type === "image/png" ? "png" : "jpg";
      const fileName = `logo-${Date.now()}.${ext}`;
      const res = await fetch(compressed);
      const blob = await res.blob();

      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, blob, {
          contentType: file.type,
          upsert: true,
        });

      if (error) {
        alert("فشل رفع اللوقو: " + error.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      setPreview(urlData.publicUrl);
    } catch (err) {
      console.error(err);
      alert("فشل رفع اللوقو");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    await updateLogo(preview);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1815]">
          اللوقو
        </h1>
        <p className="mt-2 text-sm text-[#6B6055]">
          ارفع شعار البراند. يفضّل صورة PNG شفافة أو SVG.
        </p>
      </div>

      <div className="space-y-5 lg:space-y-6">
        <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-4 sm:p-8">
          <h2 className="font-serif text-base sm:text-lg text-[#1C1815] mb-5">
            معاينة اللوقو
          </h2>

          <div className="flex items-center justify-center rounded-2xl bg-[#F5EFE6] py-8 sm:py-12 px-4 min-h-[150px] sm:min-h-[180px]">
            {preview ? (
              <Image
                src={preview}
                alt="Logo Preview"
                width={200}
                height={80}
                className="max-h-20 w-auto object-contain"
                unoptimized
              />
            ) : (
              <p className="text-sm text-[#6B6055]">لا يوجد لوقو بعد</p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <label className="flex items-center gap-2 rounded-full bg-[#1C1815] px-6 py-3 text-sm text-white cursor-pointer hover:bg-[#A88551] transition">
              <Upload className="h-4 w-4" />
              {uploading ? "جاري الرفع..." : "رفع لوقو جديد"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>

            {preview && (
              <button
                onClick={() => setPreview("")}
                className="flex items-center gap-2 rounded-full border border-red-300 px-6 py-3 text-sm text-red-500 transition hover:bg-red-500 hover:text-white"
              >
                <X className="h-4 w-4" />
                حذف اللوقو
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-[#FAF6F0] border border-[#1C1815]/[0.06] p-4 sm:p-6">
          <h3 className="text-sm font-medium text-[#1C1815] mb-3">
            نصائح مهمة
          </h3>
          <ul className="space-y-2 text-sm text-[#6B6055] leading-relaxed">
            <li>• استخدم صورة PNG شفافة أو SVG للحصول على أفضل نتيجة.</li>
            <li>• يفضّل أن يكون عرض اللوقو بين 200-400 بكسل.</li>
            <li>• الخلفية البيضاء أو الملونة ستظهر على الموقع.</li>
          </ul>
        </div>

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
            حفظ اللوقو
          </button>
        </div>
      </div>
    </div>
  );
}