"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const ADMIN_PASSWORD = "ather2026"; // ← غيّرها لاحقاً

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("ather-admin-auth", "true");
      router.push("/admin");
    } else {
      setError("كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1815] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl tracking-[0.35em] text-[#FAF6F0]">
            ATHER
          </h1>
          <p className="mt-2 text-xs tracking-[0.3em] uppercase text-[#C9AE84]">
            Admin Panel
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#FAF6F0] rounded-2xl p-8 space-y-4">
          <div>
            <label className="block text-xs tracking-wider text-[#6B6055] mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#1C1815]/10 bg-white px-4 py-3 text-[#1C1815] focus:outline-none focus:border-[#A88551]"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-[#1C1815] py-3 text-sm font-medium tracking-wider text-white transition hover:bg-[#A88551]"
          >
            دخول
          </button>
        </form>
      </motion.div>
    </div>
  );
}