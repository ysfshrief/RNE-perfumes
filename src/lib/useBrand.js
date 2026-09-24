"use client";

import { useConfig } from "@/context/ConfigContext";
import { contact as defaultContact, socials as defaultSocials, SOCIAL_PLATFORMS } from "@/data/brand";

/**
 * Contact details + social links. Defaults come from data/brand.js; the
 * admin can override them in Settings → Contact & social (config.contact /
 * config.socials) without touching code.
 */
export function useBrand() {
  const { config } = useConfig();
  const c = config.contact || {};
  const contact = {
    whatsapp: String(c.whatsapp || defaultContact.whatsapp).replace(/\D/g, ""),
    email: c.email || defaultContact.email,
  };
  const saved = config.socials && typeof config.socials === "object" ? config.socials : null;
  const socials = saved
    ? SOCIAL_PLATFORMS.filter((p) => String(saved[p.id] || "").trim()).map((p) => ({ ...p, url: saved[p.id].trim() }))
    : defaultSocials;
  return { contact, socials };
}
