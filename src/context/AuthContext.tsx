"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  users: User[];
  isReady: boolean;
  signUp: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
  updateProfile: (
    updates: Partial<Omit<User, "id" | "password">>
  ) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function fromDB(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    password: row.password,
    createdAt: row.created_at,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isReady, setIsReady] = useState(false);

  const refreshUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers((data || []).map(fromDB));
    } catch (e) {
      console.error("Users load failed:", e);
    }
  };

  useEffect(() => {
    const currentId = localStorage.getItem("ather-current-user");
    if (currentId) {
      supabase
        .from("customers")
        .select("*")
        .eq("id", currentId)
        .single()
        .then(({ data, error }) => {
          if (!error && data) setUser(fromDB(data));
          setIsReady(true);
        });
    } else {
      setIsReady(true);
    }

    refreshUsers();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("ather-current-user", user.id);
    } else {
      localStorage.removeItem("ather-current-user");
    }
  }, [user]);

  const signUp = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    try {
      // تحقق من عدم وجود الإيميل
      const { data: existing } = await supabase
        .from("customers")
        .select("id")
        .eq("email", data.email.toLowerCase())
        .maybeSingle();

      if (existing) {
        return { ok: false, error: "هذا البريد الإلكتروني مسجّل بالفعل" };
      }

      const newUser = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        password: data.password,
      };

      const { data: inserted, error } = await supabase
        .from("customers")
        .insert(newUser)
        .select()
        .single();

      if (error) {
        return { ok: false, error: error.message };
      }

      const u = fromDB(inserted);
      setUser(u);
      setUsers((prev) => [u, ...prev]);
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e.message || "خطأ غير متوقع" };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("email", email.toLowerCase())
        .eq("password", password)
        .maybeSingle();

      if (error || !data) {
        return {
          ok: false,
          error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        };
      }

      setUser(fromDB(data));
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e.message || "خطأ غير متوقع" };
    }
  };

  const signOut = () => setUser(null);

  const updateProfile = async (
    updates: Partial<Omit<User, "id" | "password">>
  ) => {
    if (!user) return;
    const { error } = await supabase
      .from("customers")
      .update({
        name: updates.name ?? user.name,
        phone: updates.phone ?? user.phone,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Update profile failed:", error);
      return;
    }

    const updated = { ...user, ...updates };
    setUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
  };

  const deleteUser = async (id: string) => {
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) {
      console.error("Delete user failed:", error);
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (user?.id === id) setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isReady,
        signUp,
        signIn,
        signOut,
        updateProfile,
        deleteUser,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}