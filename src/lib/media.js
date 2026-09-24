// Media helpers shared by the storefront and the admin.

/**
 * Convert a Google Drive share link into a direct image URL.
 * `width` asks Drive for an appropriately sized rendition (hero images need
 * more pixels than a product thumbnail). Any other URL is returned unchanged.
 */
export function normalizeImageUrl(url, width = 1000) {
  if (!url || typeof url !== "string") return url;
  const u = url.trim();
  if (!u) return u;
  let id = null;
  let m = u.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) id = m[1];
  if (!id) { m = u.match(/[?&]id=([a-zA-Z0-9_-]+)/); if (m) id = m[1]; }
  if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;
  return u;
}

/** True when the value is something an <img> can load (vs. a colour placeholder). */
export function isImageUrl(val) {
  return typeof val === "string" && (/^https?:\/\//.test(val.trim()) || val.trim().startsWith("/"));
}

/**
 * All images of a product, in order, de-duplicated and without blanks.
 * Old products only have `image`; newer ones have `images[]`. Both work.
 */
export function productImages(product) {
  if (!product) return [];
  const list = Array.isArray(product.images) ? product.images : [];
  const out = [];
  const seen = new Set();
  for (const v of [...list, product.image]) {
    const s = typeof v === "string" ? v.trim() : "";
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}
