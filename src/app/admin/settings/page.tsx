"use client";

import { useState, useEffect } from "react";
import { Save, Plus, X, Truck, Percent, Tag } from "lucide-react";
import { useSettings, type ShippingRate } from "@/context/SettingsContext";

export default function SettingsAdminPage() {
  const {
    settings,
    updateEmirates,
    updateShipping,
    updateTax,
    updateDiscount,
  } = useSettings();

  const [emirates, setEmirates] = useState(settings.emirates);
  const [shipping, setShipping] = useState<ShippingRate[]>(settings.shipping);
  const [tax, setTax] = useState(settings.tax);
  const [discount, setDiscount] = useState(settings.discount);
  const [newEmirate, setNewEmirate] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEmirates(settings.emirates);
    setShipping(settings.shipping);
    setTax(settings.tax);
    setDiscount(settings.discount);
  }, [settings]);

  const addEmirate = () => {
    if (!newEmirate.trim()) return;
    if (emirates.includes(newEmirate.trim())) return;
    setEmirates([...emirates, newEmirate.trim()]);
    setShipping([...shipping, { emirate: newEmirate.trim(), price: 20 }]);
    setNewEmirate("");
  };

  const removeEmirate = (emirate: string) => {
    setEmirates(emirates.filter((e) => e !== emirate));
    setShipping(shipping.filter((s) => s.emirate !== emirate));
  };

  const updateShippingRate = (
    emirate: string,
    key: keyof ShippingRate,
    value: any
  ) => {
    setShipping(
      shipping.map((s) =>
        s.emirate === emirate ? { ...s, [key]: value } : s
      )
    );
  };

  const handleSave = async () => {
    await updateEmirates(emirates);
    await updateShipping(shipping);
    await updateTax(tax);
    await updateDiscount(discount);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls =
    "w-full rounded-lg border border-[#1C1815]/10 bg-white px-4 py-3 text-sm text-[#1C1815] focus:outline-none focus:border-[#A88551]";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1815]">
          الإعدادات
        </h1>
        <p className="mt-2 text-sm text-[#6B6055]">
          التحكم في الشحن، الضريبة، والخصومات
        </p>
      </div>

      <div className="space-y-5 lg:space-y-6">
        {/* Shipping */}
        <Card title="المناطق وسعر الشحن" icon={<Truck className="h-4 w-4" />}>
          <div className="flex flex-col sm:flex-row gap-2 mb-5">
            <input
              value={newEmirate}
              onChange={(e) => setNewEmirate(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addEmirate())
              }
              placeholder="أضف إمارة أو منطقة جديدة..."
              className={`${inputCls} flex-1`}
            />
            <button
              type="button"
              onClick={addEmirate}
              className="flex items-center justify-center gap-1 rounded-lg bg-[#1C1815] px-4 py-3 text-white hover:bg-[#A88551]"
            >
              <Plus className="h-4 w-4" />
              إضافة
            </button>
          </div>

          <div className="space-y-3">
            {shipping.map((rate) => (
              <div
                key={rate.emirate}
                className="border border-[#1C1815]/8 rounded-xl p-3 sm:p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-[#1C1815]">
                    {rate.emirate}
                  </p>
                  <button
                    onClick={() => removeEmirate(rate.emirate)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-[#6B6055] mb-1">
                      سعر الشحن (د.إ)
                    </label>
                    <input
                      type="number"
                      value={rate.price}
                      onChange={(e) =>
                        updateShippingRate(
                          rate.emirate,
                          "price",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-[#1C1815]/10 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#A88551]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#6B6055] mb-1">
                      مجاني فوق
                    </label>
                    <input
                      type="number"
                      value={rate.freeOver || ""}
                      onChange={(e) =>
                        updateShippingRate(
                          rate.emirate,
                          "freeOver",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      placeholder="—"
                      className="w-full rounded-lg border border-[#1C1815]/10 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#A88551]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tax */}
        <Card
          title="الضريبة (VAT)"
          icon={<Percent className="h-4 w-4" />}
          action={
            <Toggle
              checked={tax.enabled}
              onChange={(v) => setTax({ ...tax, enabled: v })}
            />
          }
        >
          {tax.enabled ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
                  نسبة الضريبة (%)
                </label>
                <input
                  type="number"
                  value={tax.rate}
                  onChange={(e) =>
                    setTax({ ...tax, rate: Number(e.target.value) })
                  }
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
                  اسم الضريبة
                </label>
                <input
                  value={tax.label}
                  onChange={(e) => setTax({ ...tax, label: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#6B6055]">الضريبة معطّلة حالياً.</p>
          )}
        </Card>

        {/* Discount */}
        <Card
          title="الخصم"
          icon={<Tag className="h-4 w-4" />}
          action={
            <Toggle
              checked={discount.enabled}
              onChange={(v) => setDiscount({ ...discount, enabled: v })}
            />
          }
        >
          {discount.enabled ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
                    نوع الخصم
                  </label>
                  <select
                    value={discount.type}
                    onChange={(e) =>
                      setDiscount({
                        ...discount,
                        type: e.target.value as "percentage" | "fixed",
                      })
                    }
                    className={inputCls}
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (د.إ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
                    {discount.type === "percentage"
                      ? "نسبة الخصم (%)"
                      : "مبلغ الخصم (د.إ)"}
                  </label>
                  <input
                    type="number"
                    value={discount.value}
                    onChange={(e) =>
                      setDiscount({
                        ...discount,
                        value: Number(e.target.value),
                      })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
                    الحد الأدنى للطلب (د.إ)
                  </label>
                  <input
                    type="number"
                    value={discount.minOrder}
                    onChange={(e) =>
                      setDiscount({
                        ...discount,
                        minOrder: Number(e.target.value),
                      })
                    }
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
                  اسم الخصم
                </label>
                <input
                  value={discount.label}
                  onChange={(e) =>
                    setDiscount({ ...discount, label: e.target.value })
                  }
                  className={inputCls}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#6B6055]">الخصم معطّل حالياً.</p>
          )}
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
  icon,
  children,
  action,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#1C1815]/[0.06] p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2">
          {icon && <span className="text-[#A88551]">{icon}</span>}
          <h2 className="font-serif text-base sm:text-lg text-[#1C1815]">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        checked ? "bg-[#A88551]" : "bg-[#1C1815]/15"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? "right-0.5" : "right-[22px]"
        }`}
      />
    </button>
  );
}