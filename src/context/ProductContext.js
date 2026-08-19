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

  const allProducts = sortPinned(baseProducts.map(mergeProduct));
  const visibleProducts = sortPinned(allProducts.filter((p) => !p.hidden));

  const updateProduct = useCallback((id, patch) => {
    const next = { ...overrides, [id]: { ...(overrides[id] || {}), ...patch } };
    persist(next);
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
      value={{ ready, overrides, allProducts, visibleProducts, mergeProduct, updateProduct, resetProduct, resetAll, baseProducts, productAr }}
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
