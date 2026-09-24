// Pure catalogue logic shared by the storefront (ProductContext) and the
// server (order pricing). Keeping one implementation guarantees the server
// charges exactly what the customer was shown.

import { products as baseProducts, testerCount } from "@/data/products";
import { productImages } from "@/lib/media";

/**
 * Bring any stored product (old or new format) to the current shape so the
 * rest of the app never has to special-case legacy data:
 *  - `images` is always an ordered array; `image` mirrors the first one
 *  - `season` is always an array, `gender` always set
 *  - the Test Package size label follows the configured tester count
 */
export function normalizeProduct(p) {
  if (!p) return p;
  const images = productImages(p);
  let sizes = Array.isArray(p.sizes) ? p.sizes : [];
  if (p.isDiscoverySet) {
    const n = testerCount(p);
    sizes = sizes.map((s, i) =>
      i === 0 && typeof s?.size === "string" && /^\s*\d+\s*[×x]/.test(s.size)
        ? { ...s, size: s.size.replace(/^\s*\d+\s*[×x]\s*/, `${n} × `) }
        : s
    );
  }
  return {
    ...p,
    gender: p.gender || "Unisex",
    season: Array.isArray(p.season) ? p.season : p.season ? [p.season] : [],
    images,
    image: images[0] || p.image || "",
    sizes,
  };
}


/** Apply an admin override to a catalogue product. */
export function mergeOverride(p, overrides = {}) {
  const o = overrides?.[p.id];
  if (!o) return normalizeProduct(p);
  // An override saved with blank/zero prices would make the product show as
  // "0 EGP". Fall back to the catalogue sizes rather than trusting it.
  const validSizes =
    Array.isArray(o.sizes) && o.sizes.some((s) => Number(s?.price) > 0)
      ? o.sizes.filter((s) => Number(s?.price) > 0)
      : p.sizes;
  return normalizeProduct({
    ...p,
    ...o,
    sizes: validSizes,
    images: Array.isArray(o.images) && o.images.some(Boolean) ? o.images : p.images,
  });
}

/** Every product (built-in + admin-created) with overrides applied. */
export function buildCatalog(overrides = {}) {
  const custom = Array.isArray(overrides?.__custom__) ? overrides.__custom__ : [];
  return [...baseProducts, ...custom].map((p) => mergeOverride(p, overrides));
}
