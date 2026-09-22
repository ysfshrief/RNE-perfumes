"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { products as baseProducts, testerCount } from "@/data/products";
import { productAr } from "@/data/productLocale";
import { productImages } from "@/lib/media";
import { writeDoc, subscribeDoc } from "@/lib/store";

// Lets the admin edit product fields (names, prices, stock, images,
// visibility, gender, season, fragrance family…). Persists to Firestore
// (settings/products) when Firebase is configured, otherwise to localStorage.
//
// Storage shape (unchanged, backward compatible):
//   { [builtInProductId]: { ...override }, __custom__: [ ...adminCreatedProducts ] }

const ProductContext = createContext(null);
const STORE_KEY = "products"; // settings/products doc (or rne-products in LS)

// Kept as a re-export so existing imports keep working.
export { normalizeImageUrl } from "@/lib/media";

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

export function ProductProvider({ children }) {
  const [overrides, setOverrides] = useState({}); // { [id]: {...override} }
  const [ready, setReady] = useState(false);

  // Live subscription (Firestore onSnapshot or local fallback)
  useEffect(() => {
    const unsub = subscribeDoc(STORE_KEY, {}, (data) => {
      setOverrides(data || {});
      setReady(true);
    });
    return unsub;
  }, []);

  const persist = useCallback((next) => {
    setOverrides(next);
    writeDoc(STORE_KEY, next);
  }, []);

  const mergeProduct = useCallback((p) => {
    const o = overrides[p.id];
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
  }, [overrides]);

  // Custom products added by the admin live under a reserved key `__custom__`.
  const customProducts = useMemo(
    () => (Array.isArray(overrides.__custom__) ? overrides.__custom__ : []),
    [overrides]
  );

  // Pinned products (e.g. the Test Package) always appear first.
  const allProducts = useMemo(() => {
    const list = [...baseProducts, ...customProducts].map(mergeProduct);
    const pinned = list.filter((p) => p.isDiscoverySet || p.pinned);
    const rest = list.filter((p) => !(p.isDiscoverySet || p.pinned));
    return [...pinned, ...rest];
  }, [customProducts, mergeProduct]);

  const visibleProducts = useMemo(() => allProducts.filter((p) => !p.hidden), [allProducts]);

  const updateProduct = useCallback((id, patch) => {
    if (customProducts.some((p) => p.id === id)) {
      const nextCustom = customProducts.map((p) => (p.id === id ? { ...p, ...patch } : p));
      persist({ ...overrides, __custom__: nextCustom });
      return;
    }
    const next = { ...overrides, [id]: { ...(overrides[id] || {}), ...patch } };
    persist(next);
  }, [overrides, customProducts, persist]);

  const makeSlug = (raw, fallback) => {
    // ASCII-safe slug; Arabic-only names fall back to the id so URLs stay clean.
    const slug = String(raw || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return slug || fallback;
  };

  const uniqueSlug = useCallback((slug, id) => {
    const taken = new Set([...baseProducts, ...customProducts].filter((p) => p.id !== id).map((p) => p.slug));
    if (!taken.has(slug)) return slug;
    let i = 2;
    while (taken.has(`${slug}-${i}`)) i++;
    return `${slug}-${i}`;
  }, [customProducts]);

  const buildProduct = (product, id) => {
    const images = productImages(product);
    return {
      id,
      slug: uniqueSlug(makeSlug(product.slug || product.name, id), id),
      name: product.name || "New Product",
      nameAr: product.nameAr || "",
      inspiredBy: product.inspiredBy || null,
      tagline: product.tagline || "",
      taglineAr: product.taglineAr || "",
      description: product.description || "",
      descriptionAr: product.descriptionAr || "",
      gender: product.gender || "Unisex",
      season: Array.isArray(product.season) && product.season.length ? product.season : ["Summer"],
      families: Array.isArray(product.families) ? product.families : [],
      notes: product.notes || { top: [], heart: [], base: [] },
      ingredients: product.ingredients || "",
      sizes: product.sizes || [{ size: "50ml", price: 500, oldPrice: null, stock: 10 }],
      rating: product.rating ?? 5,
      reviewCount: product.reviewCount ?? 0,
      bestSeller: !!product.bestSeller,
      image: images[0] || "",
      images,
      ...(product._demo ? { _demo: true } : {}),
      _custom: true,
    };
  };

  const addProduct = useCallback((product) => {
    const newProduct = buildProduct(product, `custom_${Date.now()}`);
    persist({ ...overrides, __custom__: [...customProducts, newProduct] });
    return newProduct;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrides, customProducts, persist, uniqueSlug]);

  // Bulk insert. Adding products one-by-one in a loop would read the same
  // stale `overrides` each time and clobber previous inserts, so seeding must
  // go through a single persist.
  const addProducts = useCallback((list) => {
    const stamp = Date.now();
    const made = list.map((product, i) => ({ ...product, ...buildProduct(product, `custom_${stamp}_${i}`) }));
    persist({ ...overrides, __custom__: [...customProducts, ...made] });
    return made;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrides, customProducts, persist, uniqueSlug]);

  const deleteProducts = useCallback((ids) => {
    const set = new Set(ids);
    const next = { ...overrides, __custom__: customProducts.filter((p) => !set.has(p.id)) };
    ids.forEach((id) => delete next[id]);
    persist(next);
  }, [overrides, customProducts, persist]);

  const deleteProduct = useCallback((id) => deleteProducts([id]), [deleteProducts]);

  const resetProduct = useCallback((id) => {
    const next = { ...overrides };
    delete next[id];
    persist(next);
  }, [overrides, persist]);

  const resetAll = useCallback(() => {
    persist({});
  }, [persist]);

  const value = useMemo(
    () => ({ ready, overrides, allProducts, visibleProducts, mergeProduct, updateProduct, addProduct, addProducts, deleteProduct, deleteProducts, resetProduct, resetAll, baseProducts, productAr }),
    [ready, overrides, allProducts, visibleProducts, mergeProduct, updateProduct, addProduct, addProducts, deleteProduct, deleteProducts, resetProduct, resetAll]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
