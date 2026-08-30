"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { writeDoc, subscribeDoc } from "@/lib/store";

// Central admin-editable site config. Defaults live here; the admin dashboard
// overrides them and persists to localStorage (front-end prototype). In
// production this comes from the backend.

export const defaultConfig = {
  // Cinematic hero — media is admin-configurable (Drive links supported via
  // normalizeImageUrl). Copy lives in the content/translation system so it
  // stays editable per language.
  hero: {
    image: "/products/hero.jpg",   // poster / still
    video: "",                     // optional Drive or direct video URL
    productSlug: "",               // optional: pin a product's price + notes to the hero
  },

  // Auth screens (login / register) background — Drive link supported
  authBackground: {
    image: "/products/hero.jpg",
  },

  // Brand story block
  brandStory: {
    image: "/products/silver-mountain-alt.jpg",
    video: "",
  },

  // Site colour theme (admin-editable). These are now DARK-theme semantics:
  // `ink` is the primary text colour on dark surfaces, `paper` the page bg.
  colors: {
    ink: "#16130F",          // primary text on the light ivory system
    paper: "#FAF8F5",        // page background
    accent: "#8B1A2B",       // burgundy — the main accent color
    accentDeep: "#6e1422",
    olive: "#5C5650",
    line: "rgba(22,19,15,0.10)",
    success: "#3F6B45",
    danger: "#A8392A",
  },

  // Visual effects toggle
  effects: {
    enabled: true,            // master toggle — disables ALL effects
    fadeOnScroll: true,       // fade-up as sections enter viewport
    hoverLift: true,          // cards lift on hover
    imageZoom: true,          // images scale on hover
    smoothTransitions: true,  // all transitions
    parallax: true,           // subtle parallax on hero
  },

  // Homepage category cards (admin controls image + label per card)
  categories: [
    { id: "men", key: "Men", label: "رجالي", labelEn: "For Men", image: "/products/bleu-de-chanel.jpg", color: "#26302b" },
    { id: "women", key: "Women", label: "حريمي", labelEn: "For Women", image: "/products/miss-dior.jpg", color: "#7a4b52" },
    { id: "summer", key: "Summer", label: "صيفي", labelEn: "Summer", image: "/products/pacific-chill.jpg", color: "#3d5a6b" },
    { id: "winter", key: "Winter", label: "شتوي", labelEn: "Winter", image: "/products/khamrah.jpg", color: "#8f6a30" },
  ],

  // Discount coupons (admin-managed)
  coupons: [],

  // Payment methods (admin can enable/disable each)
  payments: {
    cod: true,        // default — always available
    card: false,
    instapay: false,
    vodafone: false,
    orange: false,
    etisalat: false,
  },

  // Advertising slider (Noon-style hero carousel)
  adSlides: [
    { id: "s1", title: "خصومات الصيف", titleEn: "Summer Sale", subtitle: "خصم يصل إلى ٢٥٪ على عطور مختارة", subtitleEn: "Up to 25% off selected fragrances", cta: "تسوّق الآن", ctaEn: "Shop now", href: "/shop?offers=true", bg: "#2a1e3a", fg: "#f7f5f1" },
    { id: "s2", title: "وصل حديثًا", titleEn: "New Arrivals", subtitle: "اكتشف أحدث تركيباتنا", subtitleEn: "Discover our newest compositions", cta: "اكتشف", ctaEn: "Explore", href: "/shop", bg: "#1a2a4a", fg: "#f7f5f1" },
    { id: "s3", title: "الأكثر مبيعًا", titleEn: "Best Sellers", subtitle: "العطور المفضّلة لعملائنا", subtitleEn: "Our customers' favorites", cta: "شوف المجموعة", ctaEn: "View collection", href: "/shop", bg: "#3a2a1a", fg: "#f7f5f1" },
  ],

  // Spin-the-wheel prizes (admin defines segments + weights)
  wheel: {
    enabled: true,
    title: "اربح خصمك",
    titleEn: "Win your discount",
    subtitle: "لُف العجلة واحصل على مكافأتك",
    subtitleEn: "Spin the wheel and claim your reward",
    segments: [
      { id: "w1", label: "خصم ٥٪", labelEn: "5% OFF", code: "RNE5", weight: 30, color: "#b8863b" },
      { id: "w2", label: "خصم ١٠٪", labelEn: "10% OFF", code: "RNE10", weight: 20, color: "#0a0a0a" },
      { id: "w3", label: "خصم ١٥٪", labelEn: "15% OFF", code: "RNE15", weight: 10, color: "#96692a" },
      { id: "w4", label: "شحن مجاني", labelEn: "Free Shipping", code: "FREESHIP", weight: 15, color: "#4b6f4a" },
      { id: "w5", label: "حظ أوفر", labelEn: "Try Again", code: "", weight: 20, color: "#6b6a5e" },
      { id: "w6", label: "خصم ٢٠٪", labelEn: "20% OFF", code: "RNE20", weight: 5, color: "#a23b2d" },
    ],
  },
};

const ConfigContext = createContext(null);

/**
 * Deep-merge saved settings over the defaults.
 *
 * A shallow spread replaced whole objects and arrays, so a config saved before
 * a field existed (e.g. an ad slide without `titleEn`) rendered blank instead
 * of falling back. Slides are merged per-id against their default.
 */
function mergeConfig(base, saved) {
  if (!saved || typeof saved !== "object") return base;
  const out = { ...base };

  for (const key of Object.keys(base)) {
    const b = base[key];
    const v = saved[key];
    if (v === undefined || v === null) continue;

    if (Array.isArray(b)) {
      if (!Array.isArray(v)) continue;
      // Fill each saved entry's gaps from the matching default entry.
      out[key] = v.map((item, i) => {
        const fallback = b.find((d) => d && item && d.id === item.id) || b[i] || {};
        if (!item || typeof item !== "object") return item;
        // Drop empty values so they fall back to the default instead of
        // rendering as a blank slide.
        const cleaned = Object.fromEntries(
          Object.entries(item).filter(([, val]) => val !== "" && val !== null && val !== undefined),
        );
        return { ...fallback, ...cleaned };
      });
      // Keep defaults the saved copy never had (e.g. a newly added slide).
      if (b.length > v.length && key === "adSlides") {
        out[key] = [...out[key], ...b.slice(v.length)];
      }
    } else if (b && typeof b === "object") {
      out[key] = { ...b, ...(typeof v === "object" ? v : {}) };
    } else {
      out[key] = v;
    }
  }

  // Preserve any keys the saved config has that defaults don't know about.
  for (const key of Object.keys(saved)) {
    if (!(key in out)) out[key] = saved[key];
  }
  return out;
}

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    const unsub = subscribeDoc("config", defaultConfig, (data) => {
      setConfig(mergeConfig(defaultConfig, data));
    });
    return unsub;
  }, []);

  const save = (next) => {
    setConfig(next);
    writeDoc("config", next);
  };

  const reset = () => {
    setConfig(defaultConfig);
    writeDoc("config", defaultConfig);
  };

  return (
    <ConfigContext.Provider value={{ config, save, reset }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
}
