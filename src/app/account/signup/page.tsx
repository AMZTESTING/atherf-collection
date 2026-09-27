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
  User,
  Phone,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p) || /[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("يجب الموافقة على الشروط والأحكام");
      return;
    }
    if (form.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);

    try {
      const res = await signUp(form);
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
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#C9AE84]/15 blur-[140px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#C9AE84]/10 blur-[160px]" />
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#A88551]/20 to-transparent" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#A88551]/15 to-transparent" />

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
                إنشاء حساب
              </h1>
              <p className="mt-2 text-sm text-white/50">
                انضم إلى أثر في أقل من دقيقة
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="group">
                <label className="block text-[11px] tracking-wider text-white/40 mb-2">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors group-focus-within:text-[#C9AE84]" />
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="محمد أحمد"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] pr-11 pl-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C9AE84]/50 focus:bg-white/[0.05] transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[11px] tracking-wider text-white/40 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors group-focus-within:text-[#C9AE84]" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                    dir="ltr"
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] pr-11 pl-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C9AE84]/50 focus:bg-white/[0.05] transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[11px] tracking-wider text-white/40 mb-2">
                  رقم الهاتف
                </label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors group-focus-within:text-[#C9AE84]" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    required
                    dir="ltr"
                    placeholder="+971 5X XXX XXXX"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] pr-11 pl-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C9AE84]/50 focus:bg-white/[0.05] transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[11px] tracking-wider text-white/40 mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors group-focus-within:text-[#C9AE84]" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    dir="ltr"
                    placeholder="6 أحرف على الأقل"
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

                {form.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex flex-1 gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <span
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i <= passStrength
                              ? passStrength <= 2
                                ? "bg-red-400/70"
                                : passStrength === 3
                                ? "bg-yellow-400/70"
                                : "bg-green-400/70"
                              : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-white/40">
                      {passStrength <= 2
                        ? "ضعيفة"
                        : passStrength === 3
                        ? "متوسطة"
                        : "قوية"}
                    </span>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-3 cursor-pointer pt-2">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="h-4 w-4 rounded-md border border-white/20 transition-colors peer-checked:bg-[#C9AE84] peer-checked:border-[#C9AE84] flex items-center justify-center">
                    {agreed && (
                      <Check
                        className="h-3 w-3 text-[#1C1815]"
                        strokeWidth={3}
                      />
                    )}
                  </span>
                </div>
                <span className="text-xs text-white/50 leading-relaxed">
                  أوافق على{" "}
                  <Link
                    href="#"
                    className="text-[#C9AE84]/80 hover:text-[#C9AE84] underline"
                  >
                    الشروط والأحكام
                  </Link>{" "}
                  و{" "}
                  <Link
                    href="#"
                    className="text-[#C9AE84]/80 hover:text-[#C9AE84] underline"
                  >
                    سياسة الخصوصية
                  </Link>
                </span>
              </label>

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
                      إنشاء الحساب
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
              href="/account/signin"
              className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] py-4 text-sm text-white/80 transition hover:border-[#C9AE84]/40 hover:text-[#C9AE84]"
            >
              لديك حساب؟ سجّل دخولك
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}