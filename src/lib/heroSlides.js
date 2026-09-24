import { normalizeImageUrl } from "@/lib/media";

/**
 * Resolve the hero slideshow from site config.
 *
 * Backward compatible: older configs only have `hero.image` (one still).
 * Newer configs have `hero.images: [{ id, url, alt, enabled }]`, ordered by
 * the admin. Disabled or empty entries are skipped. If nothing usable is
 * configured we fall back to the legacy single image.
 */
export function resolveHeroSlides(hero = {}) {
  const list = Array.isArray(hero.images) ? hero.images : [];
  const active = list
    .filter((s) => s && s.enabled !== false && String(s.url || "").trim())
    .map((s, i) => ({
      id: s.id || `hero-${i}`,
      url: normalizeImageUrl(String(s.url).trim(), 1920),
      alt: s.alt || "",
    }));
  if (active.length) return active;
  if (hero.image) return [{ id: "hero-legacy", url: normalizeImageUrl(hero.image, 1920), alt: "" }];
  return [];
}

/** Seconds each slide stays on screen — clamped to a calm, readable range. */
export function heroInterval(hero = {}) {
  const n = Number(hero.interval);
  return Number.isFinite(n) ? Math.min(20, Math.max(4, n)) : 7;
}
