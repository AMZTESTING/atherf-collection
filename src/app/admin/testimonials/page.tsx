"use client";

import { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import type { Testimonial } from "@/data/siteContent";

export default function TestimonialsAdminPage() {
  const { content, addTestimonial, updateTestimonial, deleteTestimonial } =
    useSiteContent();

  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);

  const startNew = () => {
    setEditing({ id: "", name: "", location: "", text: "" });
    setIsNew(true);
  };

  const startEdit = (t: Testimonial) => {
    setEditing({ ...t });
    setIsNew(false);
  };

  const saveEdit = async () => {
    if (!editing) return;
    if (!editing.name || !editing.text) {
      alert("الاسم والرسالة مطلوبان");
      return;
    }
    if (isNew) {
      await addTestimonial({
        name: editing.name,
        location: editing.location,
        text: editing.text,
      });
    } else {
      await updateTestimonial(editing.id, {
        name: editing.name,
        location: editing.location,
        text: editing.text,
      });
    }
    setEditing(null);
  };

  const inputCls =
    "w-full rounded-lg border border-[#1C1815]/10 bg-white px-4 py-3 text-sm text-[#1C1815] focus:outline-none focus:border-[#A88551]";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1815]">
            آراء العملاء
          </h1>
          <p className="mt-1 text-sm text-[#6B6055]">
            {content.testimonials.length} رأي
          </p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1C1815] px-6 py-3 text-sm text-white transition hover:bg-[#A88551]"
        >
          <Plus className="h-4 w-4" />
          إضافة رأي
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-lg sm:text-xl text-[#1C1815]">
                {isNew ? "إضافة رأي جديد" : "تعديل الرأي"}
              </h3>
              <button
                onClick={() => setEditing(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#1C1815]/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
                اسم العميل
              </label>
              <input
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                className={inputCls}
                placeholder="سارة العتيبي"
              />
            </div>

            <div>
              <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
                المنطقة
              </label>
              <input
                value={editing.location}
                onChange={(e) =>
                  setEditing({ ...editing, location: e.target.value })
                }
                className={inputCls}
                placeholder="دبي"
              />
            </div>

            <div>
              <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
                الرسالة
              </label>
              <textarea
                value={editing.text}
                onChange={(e) =>
                  setEditing({ ...editing, text: e.target.value })
                }
                rows={4}
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditing(null)}
                className="rounded-full border border-[#1C1815]/10 px-5 py-2.5 text-sm text-[#6B6055]"
              >
                إلغاء
              </button>
              <button
                onClick={saveEdit}
                className="flex items-center gap-2 rounded-full bg-[#1C1815] px-6 py-2.5 text-sm text-white hover:bg-[#A88551]"
              >
                <Save className="h-4 w-4" />
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {content.testimonials.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-12 text-center text-[#6B6055]">
            لا توجد آراء. أضف الرأي الأول.
          </div>
        ) : (
          content.testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-4 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAF6F0] font-serif text-[#A88551]">
                      {t.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1C1815] truncate">
                        {t.name}
                      </p>
                      <p className="text-[11px] text-[#6B6055] truncate">
                        {t.location}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-[#4A4139]">
                    {t.text}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(t)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1C1815]/10 text-[#6B6055] hover:border-[#A88551] hover:text-[#A88551]"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`حذف رأي "${t.name}"؟`))
                        deleteTestimonial(t.id);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1C1815]/10 text-[#6B6055] hover:border-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}