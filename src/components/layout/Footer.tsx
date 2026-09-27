"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

export default function Footer() {
  const pathname = usePathname();
  const { content } = useSiteContent();
  const footer = content.footer;

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/account/signin") ||
    pathname?.startsWith("/account/signup")
  )
    return null;

  return (
    <footer className="border-t border-[#A88551]/10 bg-[#1C1815] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div>
          <h3 className="font-serif text-2xl tracking-[0.35em] text-[#C9AE84]">
            {footer.brandName}
          </h3>
          <p className="mt-4 text-sm leading-7 text-white/60">
            {footer.description}
          </p>

          {/* Social icons */}
          <div className="mt-6 flex items-center gap-3">
            {footer.social.instagram && (
              <a
                href={footer.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-[#C9AE84] hover:text-[#C9AE84]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            )}

            {footer.social.tiktok && (
              <a
                href={footer.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-[#C9AE84] hover:text-[#C9AE84]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.86a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.29z" />
                </svg>
              </a>
            )}

            {footer.social.whatsapp && (
              <a
                href={footer.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-[#C9AE84] hover:text-[#C9AE84]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm tracking-widest text-[#C9AE84]">
            {footer.quickLinksTitle}
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            {footer.quickLinks.map((link, i) => (
              <li key={i}>
                <Link href={link.href} className="hover:text-[#C9AE84]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Service Links */}
        <div>
          <h4 className="text-sm tracking-widest text-[#C9AE84]">
            {footer.serviceLinksTitle}
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            {footer.serviceLinks.map((link, i) => (
              <li key={i}>
                <Link href={link.href} className="hover:text-[#C9AE84]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm tracking-widest text-[#C9AE84]">
            {footer.contactTitle}
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            {footer.phone && (
              <li>
                <a
                  href={`https://wa.me/${footer.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#C9AE84]"
                >
                  <Phone className="h-4 w-4 text-[#C9AE84]" />
                  <span dir="ltr">{footer.phone}</span>
                </a>
              </li>
            )}
            {footer.email && (
              <li>
                <a
                  href={`mailto:${footer.email}`}
                  className="flex items-center gap-2 hover:text-[#C9AE84]"
                >
                  <Mail className="h-4 w-4 text-[#C9AE84]" />
                  <span dir="ltr">{footer.email}</span>
                </a>
              </li>
            )}
            {footer.country && (
              <li className="pt-2 text-xs text-white/40">
                {footer.country}
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-xs text-white/40">{footer.copyright}</p>
          {footer.tagline && (
            <p className="text-xs text-white/40">
              {footer.tagline}{" "}
              <span className="text-[#C9AE84]">{footer.taglineBrand}</span>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}