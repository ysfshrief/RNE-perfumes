"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { products as baseProducts } from "@/data/products";
import { productAr } from "@/data/productLocale";
import { readDoc, writeDoc, subscribeDoc } from "@/lib/store";

// Lets the admin edit product fields (names, prices, stock, image Drive links,
// visibility). Persists to Firestore (settings/products) when Firebase is
// configured, otherwise to localStorage. Front-end + optional backend.

const ProductContext = createContext(null);
const STORE_KEY = "products"; // settings/products doc (or rne-products in LS)

// Convert a Google Drive share link to a direct-view image URL.
export function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") return url;
  const u = url.trim();
  if (!u) return u;
  let id = null;
  let m = u.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) id = m[1];
  if (!id) { m = u.match(/[?&]id=([a-zA-Z0-9_-]+)/); if (m) id = m[1]; }
  if (id) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
  }
  return u;
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
    if (!o) return p;
    return {
      ...p,
      ...o,
      sizes: o.sizes || p.sizes,
      images: o.images || p.images,
    };
  }, [overrides]);

  // Pinned products (e.g. the Test Package) always appear first.
  const sortPinned = (list) => {
    const pinned = list.filter((p) => p.isDiscoverySet || p.pinned);
    const rest = list.filter((p) => !(p.isDiscoverySet || p.pinned));
    return [...pinned, ...rest];
  };

  // Custom products added by the admin live under a reserved key `__custom__`
  // as an array, so they persist alongside the overrides for built-in products.
  const customProducts = Array.isArray(overrides.__custom__) ? overrides.__custom__ : [];

  const allBase = [...baseProducts, ...customProducts];
  const allProducts = sortPinned(allBase.map(mergeProduct));
  const visibleProducts = sortPinned(allProducts.filter((p) => !p.hidden));

  const updateProduct = useCallback((id, patch) => {
    // If it's a custom product, patch it inside the array
    if (Array.isArray(overrides.__custom__) && overrides.__custom__.some((p) => p.id === id)) {
      const nextCustom = overrides.__custom__.map((p) => (p.id === id ? { ...p, ...patch } : p));
      persist({ ...overrides, __custom__: nextCustom });
      return;
    }
    const next = { ...overrides, [id]: { ...(overrides[id] || {}), ...patch } };
    persist(next);
  }, [overrides, persist]);

  const addProduct = useCallback((product) => {
    const id = `custom_${Date.now()}`;
    // Build an ASCII-safe slug; if the name has no Latin chars (e.g. Arabic),
    // fall back to the id so URLs stay clean and encodable.
    let slug = (product.slug || product.name || "")
      .toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) slug = id;
    const newProduct = {
      id,
      slug,
      name: product.name || "New Product",
      inspiredBy: product.inspiredBy || null,
      tagline: product.tagline || "",
      description: product.description || "",
      gender: product.gender || "Unisex",
      season: product.season || ["Summer"],
      notes: { top: [], heart: [], base: [] },
      ingredients: "",
      sizes: product.sizes || [{ size: "50ml", price: 500, oldPrice: null, stock: 10 }],
      rating: 5,
      reviewCount: 0,
      bestSeller: false,
      image: product.image || "",
      images: product.image ? [product.image] : [],
      _custom: true,
    };
    const nextCustom = [...customProducts, newProduct];
    persist({ ...overrides, __custom__: nextCustom });
    return newProduct;
  }, [overrides, customProducts, persist]);

  const deleteProduct = useCallback((id) => {
    if (Array.isArray(overrides.__custom__)) {
      const nextCustom = overrides.__custom__.filter((p) => p.id !== id);
      const next = { ...overrides, __custom__: nextCustom };
      delete next[id];
      persist(next);
    }
  }, [overrides, persist]);

  const resetProduct = useCallback((id) => {
    const next = { ...overrides };
    delete next[id];
    persist(next);
  }, [overrides, persist]);

  const resetAll = useCallback(() => {
    persist({});
  }, [persist]);

  return (
    <ProductContext.Provider
      value={{ ready, overrides, allProducts, visibleProducts, mergeProduct, updateProduct, addProduct, deleteProduct, resetProduct, resetAll, baseProducts, productAr }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
