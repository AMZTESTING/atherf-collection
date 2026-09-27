"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type OrderItem = {
  productId: string;
  productName: string;
  productNameAr: string;
  price: number;
  qty: number;
  image?: string;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  createdAt: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  emirate: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  taxAmount?: number;
  discountAmount?: number;
  total: number;
  paymentMethod: "cash" | "visa";
  status: OrderStatus;
  source: "website" | "manual";
};

type OrdersContextType = {
  orders: Order[];
  addOrder: (o: Omit<Order, "id" | "createdAt">) => Promise<Order>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  getOrder: (id: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
  isReady: boolean;
};

const OrdersContext = createContext<OrdersContextType | null>(null);

function fromDB(row: any): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    emirate: row.emirate,
    address: row.address,
    notes: row.notes,
    items: row.items || [],
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    taxAmount: Number(row.tax_amount),
    discountAmount: Number(row.discount_amount),
    total: Number(row.total),
    paymentMethod: row.payment_method,
    status: row.status,
    source: row.source,
  };
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isReady, setIsReady] = useState(false);

  const refreshOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders((data || []).map(fromDB));
    } catch (e) {
      console.error("Orders load failed:", e);
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  const addOrder = async (o: Omit<Order, "id" | "createdAt">) => {
    const id = "ATH-" + Date.now().toString().slice(-8);

    const dbRow = {
      id,
      customer_id: o.customerId || null,
      customer_name: o.customerName,
      customer_phone: o.customerPhone,
      customer_email: o.customerEmail || null,
      emirate: o.emirate,
      address: o.address,
      notes: o.notes || null,
      items: o.items,
      subtotal: o.subtotal,
      shipping: o.shipping,
      tax_amount: o.taxAmount || 0,
      discount_amount: o.discountAmount || 0,
      total: o.total,
      payment_method: o.paymentMethod,
      status: o.status,
      source: o.source,
    };

    const { data, error } = await supabase
      .from("orders")
      .insert(dbRow)
      .select()
      .single();

    if (error) {
      console.error("Add order failed:", error);
      throw error;
    }

    const newOrder = fromDB(data);
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    const dbUpdates: any = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.customerName !== undefined)
      dbUpdates.customer_name = updates.customerName;
    if (updates.customerPhone !== undefined)
      dbUpdates.customer_phone = updates.customerPhone;
    if (updates.address !== undefined) dbUpdates.address = updates.address;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.emirate !== undefined) dbUpdates.emirate = updates.emirate;

    const { error } = await supabase
      .from("orders")
      .update(dbUpdates)
      .eq("id", id);

    if (error) {
      console.error("Update order failed:", error);
      throw error;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );
  };

  const deleteOrder = async (id: string) => {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      console.error("Delete order failed:", error);
      throw error;
    }
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        getOrder,
        refreshOrders,
        isReady,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used inside OrdersProvider");
  return ctx;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "قيد المراجعة",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};