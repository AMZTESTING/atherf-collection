"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn(email, password);
      if (res.ok) {
        router.push("/account");
      } else {
        setError(res.error || "خطأ غير متوقع");
        setLoading(false);
      }
    } catch (err) {
      setError("حدث خطأ غير متوقع");
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F5EFE6] flex items-center justify-center px-5 py-16 relative overflow-hidden"
    >
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#C9AE84]/15 blur-[140px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#C9AE84]/10 blur-[160px]" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#A88551]/20 to-transparent" />
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#A88551]/15 to-transparent" />

      <Link
        href="/"
        className="absolute top-6 right-6 z-20 flex items-center gap-2 rounded-full border border-[#1C1815]/10 bg-white/70 backdrop-blur-md px-4 py-2 text-xs text-[#1C1815]/70 transition hover:border-[#A88551]/40 hover:text-[#A88551]"
      >
        <ArrowRight className="h-3.5 w-3.5" />
        الرئيسية
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative">
          <div className="absolute -inset-[1px] bg-gradient-to-b from-[#C9AE84]/40 via-transparent to-[#C9AE84]/20 rounded-[28px] blur-sm opacity-60" />

          <div className="relative rounded-[28px] border border-white/10 bg-[#0F0D0B]/80 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl tracking-[0.5em] text-[#C9AE84] mb-6">
                ATHER
              </h2>

              <h1 className="font-serif text-3xl text-white leading-tight">
                أهلاً بك مجدداً
              </h1>
              <p className="mt-2 text-sm text-white/50">
                سجّل دخولك لمتابعة تجربتك
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="group">
                <label className="block text-[11px] tracking-wider text-white/40 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors group-focus-within:text-[#C9AE84]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    dir="ltr"
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] pr-11 pl-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C9AE84]/50 focus:bg-white/[0.05] transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] tracking-wider text-white/40">
                    كلمة المرور
                  </label>
                  <button
                    type="button"
                    className="text-[11px] text-[#C9AE84]/70 hover:text-[#C9AE84] transition"
                  >
                    نسيت؟
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors group-focus-within:text-[#C9AE84]" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    dir="ltr"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] pr-11 pl-11 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C9AE84]/50 focus:bg-white/[0.05] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#C9AE84] transition"
                  >
                    {showPass ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#C9AE84] to-[#A88551] py-4 text-sm font-medium text-[#1C1815] transition-all duration-500 hover:shadow-[0_10px_30px_rgba(201,174,132,0.3)] disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#1C1815] border-t-transparent" />
                  ) : (
                    <>
                      تسجيل الدخول
                      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">
                أو
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <Link
              href="/account/signup"
              className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] py-4 text-sm text-white/80 transition hover:border-[#C9AE84]/40 hover:text-[#C9AE84]"
            >
              إنشاء حساب جديد
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-[#6B6055]">
          بالمتابعة أنت توافق على{" "}
          <Link href="#" className="text-[#A88551] hover:underline">
            الشروط والأحكام
          </Link>
        </p>
      </motion.div>
    </div>
  );
}