"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { translations } from "@/data/translations";
import { writeDoc, subscribeDoc } from "@/lib/store";

const LangContext = createContext(null);

const OVERRIDES_KEY = "rne-text-overrides";

export function LangProvider({ children }) {
  const [lang, setLang] = useState("ar"); // Arabic default
  const [ready, setReady] = useState(false);
  // Admin text overrides: { en: { key: value }, ar: { key: value } }
  const [overrides, setOverrides] = useState({ en: {}, ar: {} });

  // Hydrate saved language
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rne-lang");
      if (saved === "ar" || saved === "en") setLang(saved);
    } catch (e) {}
    setReady(true);
  }, []);

  // Live subscription to text overrides (Firestore or local fallback)
  useEffect(() => {
    const unsub = subscribeDoc("content", { en: {}, ar: {} }, (data) => {
      setOverrides({ en: data?.en || {}, ar: data?.ar || {} });
    });
    return unsub;
  }, []);

  // Reflect on <html> for direction + persist language
  useEffect(() => {
    if (!ready) return;
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);
    try {
      localStorage.setItem("rne-lang", lang);
    } catch (e) {}
  }, [lang, ready]);

  const t = useCallback((key, vars) => {
    let str =
      overrides?.[lang]?.[key] ??
      translations[lang][key] ??
      overrides?.en?.[key] ??
      translations.en[key] ??
      key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.split(`{${k}}`).join(vars[k]);
      });
    }
    return str;
  }, [lang, overrides]);

  // Read the effective value for a key in a specific language (for the admin editor)
  const getText = useCallback((key, forLang) => {
    const L = forLang || lang;
    return overrides?.[L]?.[key] ?? translations[L]?.[key] ?? "";
  }, [lang, overrides]);

  // Get the original (default) value, ignoring overrides
  const getDefaultText = useCallback((key, forLang) => {
    const L = forLang || lang;
    return translations[L]?.[key] ?? "";
  }, [lang]);

  // Save a single override (used by admin)
  const setOverride = useCallback((key, value, forLang) => {
    setOverrides((prev) => {
      const next = { en: { ...prev.en }, ar: { ...prev.ar } };
      const L = forLang || lang;
      const original = translations[L]?.[key] ?? "";
      if (value === original || value === "") {
        delete next[L][key];
      } else {
        next[L][key] = value;
      }
      writeDoc("content", next);
      return next;
    });
  }, [lang]);

  const saveOverrides = useCallback((next) => {
    setOverrides(next);
    writeDoc("content", next);
  }, []);

  const resetOverrides = useCallback(() => {
    const empty = { en: {}, ar: {} };
    setOverrides(empty);
    writeDoc("content", empty);
  }, []);

  const toggle = () => setLang((l) => (l === "ar" ? "en" : "ar"));
  const isRTL = lang === "ar";

  return (
    <LangContext.Provider
      value={{
        lang, setLang, toggle, t, isRTL, ready,
        overrides, getText, getDefaultText, setOverride, saveOverrides, resetOverrides,
      }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
