"use client";

import { createContext, useContext, useEffect, useReducer } from "react";

const ShopContext = createContext(null);

const initialState = { cart: [], wishlist: [], user: null };

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload };
    case "ADD_TO_CART": {
      const { product, size, qty } = action.payload;
      const key = `${product.id}-${size.size}`;
      const existing = state.cart.find((i) => i.key === key);
      let cart;
      if (existing) {
        const nextQty = Math.min(existing.qty + qty, size.stock);
        cart = state.cart.map((i) => (i.key === key ? { ...i, qty: nextQty } : i));
      } else {
        cart = [
          ...state.cart,
          {
            key,
            id: product.id,
            slug: product.slug,
            name: product.name,
            size: size.size,
            price: size.price,
            stock: size.stock,
            qty: Math.min(qty, size.stock),
            color: product.images[0],
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

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rne-shop");
      if (saved) dispatch({ type: "HYDRATE", payload: JSON.parse(saved) });
    } catch (e) {}
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem("rne-shop", JSON.stringify(state));
    } catch (e) {}
  }, [state]);

  const cartCount = state.cart.reduce((n, i) => n + i.qty, 0);
  const cartTotal = state.cart.reduce((n, i) => n + i.qty * i.price, 0);

  return (
    <ShopContext.Provider value={{ state, dispatch, cartCount, cartTotal }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
