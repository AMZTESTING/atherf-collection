import type { Metadata } from "next";
import { Playfair_Display, Manrope, Amiri, Cairo } from "next/font/google";
import "./globals.css";
import { SiteContentProvider } from "@/context/SiteContentContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/layout/CartSidebar";
import StickyCheckout from "@/components/ui/StickyCheckout";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-arabic",
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-body-arabic",
});

export const metadata: Metadata = {
  title: "Ather Collection | عطور فاخرة",
  description: "متجر Ather للعطور الفاخرة والعود والمسك.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-scroll-behavior="smooth"
      className="overflow-x-hidden max-w-full"
    >
      <body
        className={`${playfair.variable} ${manrope.variable} ${amiri.variable} ${cairo.variable} overflow-x-hidden max-w-full`}
      >
        <SiteContentProvider>
          <SettingsProvider>
            <AuthProvider>
              <ProductsProvider>
                <OrdersProvider>
                  <CartProvider>
                    <WishlistProvider>
                      <Header />
                      <main className="overflow-x-hidden">{children}</main>
                      <Footer />
                      <StickyCheckout />
                      <CartSidebar />
                    </WishlistProvider>
                  </CartProvider>
                </OrdersProvider>
              </ProductsProvider>
            </AuthProvider>
          </SettingsProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}