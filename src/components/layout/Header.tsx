"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  ShoppingBag,
  Heart,
  X,
  User as UserIcon,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSiteContent } from "@/context/SiteContentContext";
import { useAuth } from "@/context/AuthContext";

const nav = [
  { label: "الرئيسية", href: "/" },
  { label: "المجموعات", href: "/collections" },
  { label: "من نحن", href: "/about" },
  { label: "تواصل", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, openCart } = useCart();
  const { items: wishlist } = useWishlist();
  const { content } = useSiteContent();
  const { user } = useAuth();
  const logo = content.logo;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/account/signin") ||
    pathname?.startsWith("/account/signup")
  )
    return null;

  return (
    <>
      {/* الشريط العلوي الإعلاني */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#1C1815] py-2 text-center">
        <p className="text-[9px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-[#C9AE84]">
          Free shipping over 500 AED
        </p>
      </div>

      <header
        className={`fixed top-[30px] sm:top-[32px] w-full z-50 transition-all duration-700 ease-out ${
          scrolled
            ? "bg-[#FAF6F0]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(28,24,21,0.06)]"
            : "bg-transparent"
        }`}
      >
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-[#A88551]/30 to-transparent" />
        )}

        <div className="relative mx-auto flex h-[68px] sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-10">
          {/* الجانب الأيسر (RTL): القائمة + التنقل */}
          <div className="flex items-center gap-1 flex-1 lg:flex-initial">
            <button
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full text-[#1C1815] transition hover:bg-[#1C1815]/5"
              onClick={() => setMobileOpen(true)}
              aria-label="فتح القائمة"
            >
              <Menu className="h-5 w-5" />
            </button>

            <nav className="hidden lg:flex items-center gap-1">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative px-4 py-2 text-[13px] tracking-[0.15em] uppercase text-[#1C1815] transition-colors hover:text-[#A88551]"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span
                      className={`absolute bottom-1 left-4 right-4 h-px bg-[#A88551] transition-transform duration-500 origin-right ${
                        active
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* اللوقو في المنتصف */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group z-10"
          >
            {logo ? (
              <img
                src={logo}
                alt="Ather Logo"
                loading="eager"
                style={{ width: "auto" }}
                className="h-8 sm:h-10 md:h-11 object-contain transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <span className="font-serif text-lg sm:text-xl md:text-2xl tracking-[0.35em] text-[#1C1815] transition-colors group-hover:text-[#A88551]">
                ATHER
              </span>
            )}
          </Link>

          {/* الجانب الأيمن (RTL): الأيقونات */}
          <div className="flex items-center gap-0 sm:gap-1 flex-1 lg:flex-initial justify-end">
            <Link
              href="/search"
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-[#1C1815] transition-all duration-300 hover:bg-[#1C1815]/5 hover:text-[#A88551]"
              aria-label="بحث"
            >
              <Search className="h-[18px] w-[18px]" />
            </Link>

            <Link
              href="/wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#1C1815] transition-all duration-300 hover:bg-[#1C1815]/5 hover:text-[#A88551]"
              aria-label="المفضلة"
            >
              <Heart className="h-[18px] w-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A88551] px-1 text-[9px] font-medium text-white ring-2 ring-[#FAF6F0]">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              href={user ? "/account" : "/account/signin"}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#1C1815] transition-all duration-300 hover:bg-[#1C1815]/5 hover:text-[#A88551]"
              aria-label="حسابي"
            >
              <UserIcon className="h-[18px] w-[18px]" />
              {user && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#A88551] ring-2 ring-[#FAF6F0]" />
              )}
            </Link>

            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#1C1815] transition-all duration-300 hover:bg-[#1C1815]/5 hover:text-[#A88551]"
              aria-label="السلة"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A88551] px-1 text-[9px] font-medium text-white ring-2 ring-[#FAF6F0]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* قائمة الجوال */}
      <div
        className={`fixed inset-0 z-[80] lg:hidden transition-all duration-500 ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-[#FAF6F0] shadow-2xl flex flex-col transition-transform duration-500 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C1815]/8">
            <Link href="/" onClick={() => setMobileOpen(false)}>
              {logo ? (
                <img
                  src={logo}
                  alt="Ather Logo"
                  loading="eager"
                  style={{ width: "auto" }}
                  className="h-9 object-contain"
                />
              ) : (
                <span className="font-serif text-xl tracking-[0.35em] text-[#1C1815]">
                  ATHER
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#1C1815] transition hover:bg-[#1C1815]/5"
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-8">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#A88551] mb-5">
              القائمة
            </p>
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="group flex items-center justify-between py-4 border-b border-[#1C1815]/8 transition-colors"
                  >
                    <span className="font-serif text-2xl text-[#1C1815] group-hover:text-[#A88551] transition-colors">
                      {item.label}
                    </span>
                    <span className="text-[#A88551] opacity-0 group-hover:opacity-100 transition-opacity">
                      ←
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[10px] tracking-[0.4em] uppercase text-[#A88551] mb-5">
              حسابي
            </p>
            <ul className="space-y-3">
              <li>
                <Link
                  href={user ? "/account" : "/account/signin"}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-sm text-[#6B6055] hover:text-[#A88551]"
                >
                  <UserIcon className="h-4 w-4" />
                  {user
                    ? `حسابي (${user.name.split(" ")[0]})`
                    : "تسجيل الدخول"}
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-sm text-[#6B6055] hover:text-[#A88551]"
                >
                  <Heart className="h-4 w-4" />
                  المفضلة
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-sm text-[#6B6055] hover:text-[#A88551]"
                >
                  <Search className="h-4 w-4" />
                  البحث
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openCart();
                  }}
                  className="flex items-center gap-3 text-sm text-[#6B6055] hover:text-[#A88551]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  سلة التسوق ({totalItems})
                </button>
              </li>
            </ul>
          </nav>

          <div className="border-t border-[#1C1815]/8 px-6 py-5">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#A88551] mb-3">
              تواصل معنا
            </p>
            <div className="flex items-center gap-4 text-sm text-[#6B6055]">
              <a
                href="https://instagram.com/atherr.co"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#A88551]"
              >
                Instagram
              </a>
              <span className="w-px h-3 bg-[#1C1815]/20" />
              <a
                href="https://wa.me/971521695582"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#A88551]"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}