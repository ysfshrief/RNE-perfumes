"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { products as baseProducts } from "@/data/products";
import { productAr } from "@/data/productLocale";

// Lets the admin edit product fields (names, prices, stock, image Drive links,
// visibility) with changes persisted to localStorage. Front-end prototype —
// in production this is the backend catalog.

const ProductContext = createContext(null);
const KEY = "rne-product-overrides";

// Convert a Google Drive share link to a direct-view image URL.
// Accepts:
//   https://drive.google.com/file/d/FILEID/view?usp=sharing
//   https://drive.google.com/open?id=FILEID
//   https://drive.google.com/uc?id=FILEID
// Returns a thumbnail URL that renders inline. Non-Drive URLs pass through.
export function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") return url;
  const u = url.trim();
  if (!u) return u;
  // already a direct image or non-drive URL
  let id = null;
  let m = u.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) id = m[1];
  if (!id) { m = u.match(/[?&]id=([a-zA-Z0-9_-]+)/); if (m) id = m[1]; }
  if (id) {
    // thumbnail endpoint renders reliably inline as an <img>
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
  }
  return u;
}

export function ProductProvider({ children }) {
  const [overrides, setOverrides] = useState({}); // { [id]: { field: value, images:[...] } }
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setOverrides(JSON.parse(saved));
    } catch (e) {}
    setReady(true);
  }, []);

  const persist = (next) => {
    setOverrides(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {}
  };

  // Merge base product with its override
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

  // The effective product list (respecting hidden flag for storefront use)
  const allProducts = baseProducts.map(mergeProduct);
  const visibleProducts = allProducts.filter((p) => !p.hidden);

  const updateProduct = useCallback((id, patch) => {
    setOverrides((prev) => {
      const next = { ...prev, [id]: { ...(prev[id] || {}), ...patch } };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }, []);

  const resetProduct = useCallback((id) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[id];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    persist({});
  }, []);

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
