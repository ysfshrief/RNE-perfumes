"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { writeDoc, subscribeDoc } from "@/lib/store";

// Central admin-editable site config. Defaults live here; the admin dashboard
// overrides them and persists to localStorage (front-end prototype). In
// production this comes from the backend.

export const defaultConfig = {
  // "Learn more about our fragrances" — Drive file or YouTube link
  learnMore: {
    enabled: true,
    url: "https://www.youtube.com/results?search_query=rne+perfumes",
    type: "youtube", // "youtube" | "drive" | "link"
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

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    const unsub = subscribeDoc("config", defaultConfig, (data) => {
      setConfig({ ...defaultConfig, ...(data || {}) });
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
