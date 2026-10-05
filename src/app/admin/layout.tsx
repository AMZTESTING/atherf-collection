"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Plus,
  LogOut,
  BookOpen,
  MessageSquare,
  Image as ImageIcon,
  ShoppingCart,
  Users,
  BarChart3,
  PanelBottom,
  Settings,
  Menu,
  X,
  Tag,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }
    const auth = localStorage.getItem("ather-admin-auth");
    if (auth !== "true") {
      router.push("/admin/login");
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = sidebarOpen ? "hidden" : "";
    }
    return () => {
      if (typeof window !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [sidebarOpen]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (!ready) return null;

  const logout = () => {
    localStorage.removeItem("ather-admin-auth");
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
    { href: "/admin/reports", label: "التقارير", icon: BarChart3 },
    { href: "/admin/customers", label: "العملاء", icon: Users },
    { href: "/admin/products", label: "المنتجات", icon: Package },
    { href: "/admin/products/new", label: "إضافة منتج", icon: Plus },
    { href: "/admin/offer", label: "العرض الترويجي", icon: Tag },
    { href: "/admin/logo", label: "اللوقو", icon: ImageIcon },
    { href: "/admin/story", label: "قسم قصتنا", icon: BookOpen },
    { href: "/admin/testimonials", label: "آراء العملاء", icon: MessageSquare },
    { href: "/admin/footer", label: "الفوتر", icon: PanelBottom },
    { href: "/admin/settings", label: "الإعدادات", icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-5 lg:p-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl lg:text-2xl tracking-[0.3em] text-white">
            ATHER
          </h1>
          <p className="text-[9px] lg:text-[10px] tracking-[0.3em] uppercase text-[#C9AE84] mt-1">
            Admin Panel
          </p>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/5 transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 p-3 lg:p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                active
                  ? "bg-[#C9AE84] text-[#1C1815]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 lg:p-4 border-t border-white/10">
        <Link
          href="/"
          className="mb-2 flex items-center gap-3 rounded-lg px-4 py-2.5 text-xs text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          ← العودة للموقع
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/70 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          تسجيل الخروج
        </button>
      </div>
    </>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[#F5EFE6] flex">
      <aside className="hidden lg:flex w-64 bg-[#1C1815] text-white flex-col fixed h-full z-30">
        <SidebarContent />
      </aside>

      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          sidebarOpen ? "visible" : "invisible"
        }`}
      >
        <div
          onClick={() => setSidebarOpen(false)}
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute top-0 right-0 h-full w-[280px] max-w-[85%] bg-[#1C1815] text-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <SidebarContent />
        </aside>
      </div>

      <div className="flex-1 lg:mr-64 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between gap-3 bg-[#1C1815] text-white px-4 py-3 shadow-lg">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/5 transition"
          >
            <Menu className="h-5 w-5" />
          </button>

          <h1 className="font-serif text-lg tracking-[0.3em] text-white">
            ATHER
          </h1>

          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/5 transition text-xs"
          >
            ←
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}