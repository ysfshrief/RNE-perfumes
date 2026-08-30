import { translations } from "./translations";

// Friendly labels for each key-prefix "section", shown in the admin content editor.
export const SECTION_LABELS = {
  common: { en: "Common / Buttons", ar: "عام / أزرار" },
  nav: { en: "Navigation Menu", ar: "قائمة التنقل" },
  home: { en: "Homepage", ar: "الصفحة الرئيسية" },
  shop: { en: "Shop Page", ar: "صفحة المتجر" },
  sort: { en: "Sorting Options", ar: "خيارات الترتيب" },
  product: { en: "Product Page", ar: "صفحة المنتج" },
  discovery: { en: "Test Package (تيست باكيدچ)", ar: "التيست باكيدچ" },
  find: { en: "Find Your Fragrance", ar: "اكتشف عطرك" },
  story: { en: "Brand Story", ar: "قصة البراند" },
  collection: { en: "Collections", ar: "المجموعات" },
  badge: { en: "Product Badges", ar: "شارات المنتج" },
  card: { en: "Product Cards", ar: "بطاقات المنتج" },
  g: { en: "Gender Labels", ar: "تصنيف النوع" },
  s: { en: "Season Labels", ar: "تصنيف الموسم" },
  cart: { en: "Cart", ar: "سلة التسوق" },
  checkout: { en: "Checkout", ar: "الدفع" },
  pay: { en: "Payment Methods", ar: "طرق الدفع" },
  auth: { en: "Login / Register", ar: "تسجيل الدخول / حساب جديد" },
  account: { en: "My Account", ar: "حسابي" },
  status: { en: "Order Status", ar: "حالة الطلب" },
  about: { en: "About Page", ar: "صفحة من نحن" },
  contact: { en: "Contact Page", ar: "صفحة التواصل" },
  faq: { en: "FAQ Page", ar: "الأسئلة الشائعة" },
  shipping: { en: "Shipping Policy", ar: "سياسة الشحن" },
  return: { en: "Return Policy", ar: "سياسة الإرجاع" },
  terms: { en: "Terms Page", ar: "الشروط والأحكام" },
  policy: { en: "Policy Labels", ar: "تسميات السياسات" },
  footer: { en: "Footer", ar: "التذييل (الفوتر)" },
  notfound: { en: "404 Page", ar: "صفحة غير موجودة" },
  lang: { en: "Language Toggle", ar: "زر اللغة" },
  logo: { en: "Logo", ar: "الشعار" },
  whatsapp: { en: "WhatsApp Button", ar: "زر واتساب" },
  adminGate: { en: "Admin Access", ar: "دخول الإدارة" },
};

// Section display order (sections not listed appear after, except admin* which is hidden)
export const SECTION_ORDER = [
  "home", "nav", "common", "product", "discovery", "find", "story", "collection", "card", "badge", "g", "s",
  "shop", "sort", "cart", "checkout", "pay",
  "auth", "account", "status",
  "about", "contact", "faq", "shipping", "return", "terms", "policy",
  "footer", "whatsapp", "lang", "logo", "notfound",
];

// Build grouped structure: [{ prefix, label, keys: [key,...] }]
export function getContentSections() {
  const keys = Object.keys(translations.en);
  const groups = {};
  keys.forEach((key) => {
    const prefix = key.split(".")[0];
    // Hide internal admin dashboard strings from the content editor
    if (prefix === "admin") return;
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(key);
  });

  const ordered = [];
  const seen = new Set();
  SECTION_ORDER.forEach((prefix) => {
    if (groups[prefix]) {
      ordered.push({ prefix, keys: groups[prefix] });
      seen.add(prefix);
    }
  });
  // any remaining (excluding admin) appended
  Object.keys(groups).forEach((prefix) => {
    if (!seen.has(prefix)) ordered.push({ prefix, keys: groups[prefix] });
  });
  return ordered;
}
