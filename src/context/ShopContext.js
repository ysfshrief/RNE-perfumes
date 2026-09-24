"use client";

import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { productImages } from "@/lib/media";
import { pName } from "@/data/productLocale";

const ShopContext = createContext(null);

const initialState = { cart: [], wishlist: [], user: null };

/**
 * Cart line key. Test Packages with different scent selections are
 * different products for the customer, so the selection is part of the key —
 * otherwise a second, different package silently merged into the first and
 * its scents were lost.
 */
function lineKey(product, size, scents) {
  const base = `${product.id}-${size.size}`;
  if (!scents?.length) return base;
  return `${base}-${scents.map((s) => s.id).sort().join(".")}`;
}

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE": {
      const p = action.payload || {};
      return {
        ...state,
        cart: Array.isArray(p.cart) ? p.cart.filter((i) => i && i.key && Number(i.qty) > 0) : [],
        wishlist: Array.isArray(p.wishlist) ? p.wishlist : [],
        user: p.user || null,
      };
    }
    case "ADD_TO_CART": {
      const { product, size, qty, selectedScents } = action.payload;
      const stock = Number(size.stock) || 0;
      if (stock <= 0) return state;
      const scents = Array.isArray(selectedScents) && selectedScents.length ? selectedScents : null;
      const key = lineKey(product, size, scents);
      const existing = state.cart.find((i) => i.key === key);
      let cart;
      if (existing) {
        const nextQty = Math.min(existing.qty + qty, stock);
        cart = state.cart.map((i) => (i.key === key ? { ...i, qty: nextQty, stock } : i));
      } else {
        cart = [
          ...state.cart,
          {
            key,
            id: product.id,
            slug: product.slug,
            name: product.name,
            nameAr: pName(product, "ar"),
            size: size.size,
            price: size.price,
            stock,
            qty: Math.min(qty, stock),
            image: productImages(product)[0] || null,
            selectedScents: scents,
          },
        ];
      }
      return { ...state, cart };
    }
    case "SET_QTY": {
      const cart = state.cart.map((i) =>
        i.key === action.payload.key
          ? { ...i, qty: Math.max(1, Math.min(action.payload.qty, i.stock)) }
          : i
      );
      return { ...state, cart };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((i) => i.key !== action.payload.key) };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "TOGGLE_WISHLIST": {
      const id = action.payload;
      const wishlist = state.wishlist.includes(id)
        ? state.wishlist.filter((x) => x !== id)
        : [...state.wishlist, id];
      return { ...state, wishlist };
    }
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
}

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rne-shop");
      if (saved) dispatch({ type: "HYDRATE", payload: JSON.parse(saved) });
    } catch (e) {}
    setHydrated(true);
  }, []);

  // Persist on change — only after hydration has been applied, so the empty
  // initial state can never overwrite a saved cart.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("rne-shop", JSON.stringify(state));
    } catch (e) {}
  }, [state, hydrated]);

  // Keep several tabs in sync (add in one tab → badge updates in the other).
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== "rne-shop" || !e.newValue) return;
      try { dispatch({ type: "HYDRATE", payload: JSON.parse(e.newValue) }); } catch (err) {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const cartCount = state.cart.reduce((n, i) => n + i.qty, 0);
  const cartTotal = state.cart.reduce((n, i) => n + i.qty * i.price, 0);

  return (
    <ShopContext.Provider value={{ state, dispatch, cartCount, cartTotal, hydrated }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
