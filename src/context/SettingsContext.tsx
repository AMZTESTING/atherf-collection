"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type ShippingRate = {
  emirate: string;
  price: number;
  freeOver?: number;
};

export type TaxSettings = {
  enabled: boolean;
  rate: number;
  label: string;
};

export type DiscountSettings = {
  enabled: boolean;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  label: string;
};

export type StoreSettings = {
  emirates: string[];
  shipping: ShippingRate[];
  tax: TaxSettings;
  discount: DiscountSettings;
};

type SettingsContextType = {
  settings: StoreSettings;
  updateEmirates: (emirates: string[]) => Promise<void>;
  updateShipping: (rates: ShippingRate[]) => Promise<void>;
  updateTax: (tax: Partial<TaxSettings>) => Promise<void>;
  updateDiscount: (discount: Partial<DiscountSettings>) => Promise<void>;
  getShippingForEmirate: (emirate: string, subtotal: number) => number;
  calculateTotals: (
    subtotal: number,
    emirate: string
  ) => {
    subtotal: number;
    shipping: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
  };
  resetToDefaults: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  isReady: boolean;
};

const defaultSettings: StoreSettings = {
  emirates: [
    "دبي",
    "أبوظبي",
    "الشارقة",
    "عجمان",
    "رأس الخيمة",
    "الفجيرة",
    "أم القيوين",
  ],
  shipping: [
    { emirate: "دبي", price: 20 },
    { emirate: "أبوظبي", price: 25 },
    { emirate: "الشارقة", price: 22 },
    { emirate: "عجمان", price: 25 },
    { emirate: "رأس الخيمة", price: 30 },
    { emirate: "الفجيرة", price: 30 },
    { emirate: "أم القيوين", price: 28 },
  ],
  tax: { enabled: false, rate: 5, label: "ضريبة القيمة المضافة" },
  discount: {
    enabled: false,
    type: "percentage",
    value: 0,
    minOrder: 0,
    label: "خصم",
  },
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [isReady, setIsReady] = useState(false);

  const refreshSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          emirates: data.emirates || defaultSettings.emirates,
          shipping: data.shipping || defaultSettings.shipping,
          tax: { ...defaultSettings.tax, ...(data.tax || {}) },
          discount: { ...defaultSettings.discount, ...(data.discount || {}) },
        });
      }
    } catch (e) {
      console.error("Settings load failed:", e);
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const saveToDB = async (newSettings: StoreSettings) => {
    const { error } = await supabase
      .from("settings")
      .upsert({
        id: 1,
        emirates: newSettings.emirates,
        shipping: newSettings.shipping,
        tax: newSettings.tax,
        discount: newSettings.discount,
        updated_at: new Date().toISOString(),
      });

    if (error) console.error("Save settings failed:", error);
  };

  const updateEmirates = async (emirates: string[]) => {
    const updated = { ...settings, emirates };
    setSettings(updated);
    await saveToDB(updated);
  };

  const updateShipping = async (rates: ShippingRate[]) => {
    const updated = { ...settings, shipping: rates };
    setSettings(updated);
    await saveToDB(updated);
  };

  const updateTax = async (tax: Partial<TaxSettings>) => {
    const updated = { ...settings, tax: { ...settings.tax, ...tax } };
    setSettings(updated);
    await saveToDB(updated);
  };

  const updateDiscount = async (discount: Partial<DiscountSettings>) => {
    const updated = {
      ...settings,
      discount: { ...settings.discount, ...discount },
    };
    setSettings(updated);
    await saveToDB(updated);
  };

  const getShippingForEmirate = (emirate: string, subtotal: number) => {
    const rate = settings.shipping.find((s) => s.emirate === emirate);
    if (!rate) return 0;
    if (rate.freeOver && subtotal >= rate.freeOver) return 0;
    return rate.price;
  };

  const calculateTotals = (subtotal: number, emirate: string) => {
    const shipping = getShippingForEmirate(emirate, subtotal);

    let discountAmount = 0;
    if (
      settings.discount.enabled &&
      settings.discount.value > 0 &&
      subtotal >= settings.discount.minOrder
    ) {
      if (settings.discount.type === "percentage") {
        discountAmount = (subtotal * settings.discount.value) / 100;
      } else {
        discountAmount = settings.discount.value;
      }
    }

    const afterDiscount = Math.max(0, subtotal - discountAmount);

    let taxAmount = 0;
    if (settings.tax.enabled && settings.tax.rate > 0) {
      taxAmount = (afterDiscount * settings.tax.rate) / 100;
    }

    const total = afterDiscount + shipping + taxAmount;

    return { subtotal, shipping, taxAmount, discountAmount, total };
  };

  const resetToDefaults = async () => {
    setSettings(defaultSettings);
    await saveToDB(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateEmirates,
        updateShipping,
        updateTax,
        updateDiscount,
        getShippingForEmirate,
        calculateTotals,
        resetToDefaults,
        refreshSettings,
        isReady,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx)
    throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}