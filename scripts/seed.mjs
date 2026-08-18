/**
 * Seed Firestore with the app's default data so the store renders identically
 * to the local prototype. Optional — the app also works with empty collections
 * (it falls back to the built-in defaults for anything missing).
 *
 * Prerequisites: same serviceAccountKey.json as scripts/setAdmin.mjs.
 *
 * Usage:
 *   node scripts/seed.mjs
 */

import { readFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// settings/content — empty override maps (admin fills these via the dashboard)
await db.doc("settings/content").set({ en: {}, ar: {} }, { merge: true });

// settings/products — empty override map
await db.doc("settings/products").set({}, { merge: true });

// settings/config — defaults for the ad slider + spin wheel.
// Keep this in sync with src/context/ConfigContext.js defaultConfig if you change it.
await db.doc("settings/config").set(
  {
    adSlides: [
      { id: "s1", title: "خصومات الصيف", titleEn: "Summer Sale", subtitle: "خصم يصل إلى ٢٥٪ على عطور مختارة", subtitleEn: "Up to 25% off selected fragrances", cta: "تسوّق الآن", ctaEn: "Shop now", href: "/shop?offers=true", bg: "#2a1e3a", fg: "#f7f5f1" },
      { id: "s2", title: "وصل حديثًا", titleEn: "New Arrivals", subtitle: "اكتشف أحدث تركيباتنا", subtitleEn: "Discover our newest compositions", cta: "اكتشف", ctaEn: "Explore", href: "/shop", bg: "#1a2a4a", fg: "#f7f5f1" },
      { id: "s3", title: "الأكثر مبيعًا", titleEn: "Best Sellers", subtitle: "العطور المفضّلة لعملائنا", subtitleEn: "Our customers' favorites", cta: "شوف المجموعة", ctaEn: "View collection", href: "/shop", bg: "#3a2a1a", fg: "#f7f5f1" },
    ],
    wheel: {
      enabled: true,
      title: "اربح خصمك", titleEn: "Win your discount",
      subtitle: "لُف العجلة واحصل على مكافأتك", subtitleEn: "Spin the wheel and claim your reward",
      segments: [
        { id: "w1", label: "خصم ٥٪", labelEn: "5% OFF", code: "RNE5", weight: 30, color: "#b8863b" },
        { id: "w2", label: "خصم ١٠٪", labelEn: "10% OFF", code: "RNE10", weight: 20, color: "#0a0a0a" },
        { id: "w3", label: "خصم ١٥٪", labelEn: "15% OFF", code: "RNE15", weight: 10, color: "#96692a" },
        { id: "w4", label: "شحن مجاني", labelEn: "Free Shipping", code: "FREESHIP", weight: 15, color: "#4b6f4a" },
        { id: "w5", label: "حظ أوفر", labelEn: "Try Again", code: "", weight: 20, color: "#6b6a5e" },
        { id: "w6", label: "خصم ٢٠٪", labelEn: "20% OFF", code: "RNE20", weight: 5, color: "#a23b2d" },
      ],
    },
  },
  { merge: true }
);

console.log("✅ Firestore seeded (settings/content, settings/products, settings/config).");
process.exit(0);
