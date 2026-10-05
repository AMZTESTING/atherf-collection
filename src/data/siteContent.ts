export type Testimonial = {
  id: string;
  name: string;
  location: string;
  text: string;
};

export type StoryContent = {
  label: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  image: string;
  stats: { value: string; label: string }[];
  ctaText: string;
  ctaLink: string;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterContent = {
  brandName: string;
  description: string;
  social: {
    instagram: string;
    tiktok: string;
    whatsapp: string;
  };
  quickLinksTitle: string;
  quickLinks: FooterLink[];
  serviceLinksTitle: string;
  serviceLinks: FooterLink[];
  contactTitle: string;
  phone: string;
  email: string;
  country: string;
  copyright: string;
  tagline: string;
  taglineBrand: string;
};

export type OfferBanner = {
  enabled: boolean;
  badge: string;
  title: string;
  price: string;
  oldPrice: string;
  discountText: string;
  ctaText: string;
};

export type SiteContent = {
  logo: string;
  story: StoryContent;
  testimonials: Testimonial[];
  footer: FooterContent;
  offerBanner: OfferBanner;
};

export const defaultSiteContent: SiteContent = {
  logo: "",
  story: {
    label: "قصتنا",
    title: "صُنعت لتبقى في الذاكرة",
    paragraph1:
      "Ather Collection وُلدت من شغف بالعطور الشرقية الأصيلة. نختار أجود أنواع العود والعنبر والورد الطائفي من أفضل المصادر العالمية، ونمزجها بلمسة عصرية تناسب الذوق الرفيع.",
    paragraph2:
      "كل عطر هو قطعة فنية تعبر عن شخصيتك، وتترك أثراً لا يُنسى بعد أن تمضي. لأننا نؤمن أن العطر ليس مجرد رائحة، بل بصمة تُحفر في الذاكرة.",
    image: "",
    stats: [
      { value: "2", label: "عطور فاخرة" },
      { value: "100%", label: "مكونات أصلية" },
      { value: "FR", label: "صناعة فرنسية" },
    ],
    ctaText: "اكتشف قصتنا",
    ctaLink: "/about",
  },
  testimonials: [
    {
      id: "t1",
      name: "سارة العتيبي",
      location: "دبي",
      text: "أفضل تجربة عطور مررت بها. AZURE أصبح توقيعي اليومي، والناس دائماً تسألني عن اسمه.",
    },
    {
      id: "t2",
      name: "محمد الشهري",
      location: "أبوظبي",
      text: "التغليف فاخر جداً، والثبات ممتاز. تجربة شراء راقية من البداية للنهاية.",
    },
    {
      id: "t3",
      name: "نورة القحطاني",
      location: "الشارقة",
      text: "VELOURS رائحته شرقية عميقة وتدوم طويلاً. خدمة العملاء محترمة والتوصيل سريع.",
    },
  ],
  footer: {
    brandName: "ATHER",
    description:
      "عطور فاخرة مصمم لمن يقدر التفاصيل. عود، مسك، وعنبر من أرقى المصادر.",
    social: {
      instagram: "https://instagram.com/atherr.co",
      tiktok: "https://tiktok.com/@ather.co",
      whatsapp: "https://wa.me/971521695582",
    },
    quickLinksTitle: "روابط سريعة",
    quickLinks: [
      { label: "المتجر", href: "/collections" },
      { label: "من نحن", href: "/about" },
      { label: "تواصل معنا", href: "/contact" },
      { label: "المفضلة", href: "/wishlist" },
    ],
    serviceLinksTitle: "خدمة العملاء",
    serviceLinks: [
      { label: "سياسة الشحن والتوصيل", href: "/shipping" },
      { label: "الاسترجاع والاستبدال", href: "/returns" },
      { label: "الشروط والأحكام", href: "/terms" },
      { label: "سياسة الخصوصية", href: "/privacy" },
    ],
    contactTitle: "تواصل معنا",
    phone: "+971 52 169 5582",
    email: "Ather.co@hotmail.com",
    country: "الإمارات العربية المتحدة",
    copyright: "© 2026 Ather Collection. جميع الحقوق محفوظة.",
    tagline: "صُنع بشغف في الإمارات ·",
    taglineBrand: "ATHER",
  },
  offerBanner: {
    enabled: true,
    badge: "عرض خاص",
    title: "العطران معاً بسعر مميز",
    price: "229 د.إ",
    oldPrice: "258 د.إ",
    discountText: "وفّر 11%",
    ctaText: "اطلب العرض",
  },
};