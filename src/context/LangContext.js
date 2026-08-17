"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "@/data/translations";

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState("ar"); // Arabic default
  const [ready, setReady] = useState(false);

  // Hydrate saved language
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rne-lang");
      if (saved === "ar" || saved === "en") setLang(saved);
    } catch (e) {}
    setReady(true);
  }, []);

  // Reflect on <html> for direction + persist
  useEffect(() => {
    if (!ready) return;
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);
    try {
      localStorage.setItem("rne-lang", lang);
    } catch (e) {}
  }, [lang, ready]);

  const t = (key, vars) => {
    let str = translations[lang][key] ?? translations.en[key] ?? key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace(`{${k}}`, vars[k]);
      });
    }
    return str;
  };

  const toggle = () => setLang((l) => (l === "ar" ? "en" : "ar"));
  const isRTL = lang === "ar";

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t, isRTL }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
