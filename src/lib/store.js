// Unified data store used by every page and the admin.
//
// Two modes, same API:
//   • Remote (NEXT_PUBLIC_BACKEND=neon): data lives in Neon Postgres behind
//     the site's own /api routes. Reads are cached locally for an instant
//     first paint, then refreshed from the server (on load, on window focus
//     and on a gentle poll), so every visitor sees the admin's changes.
//   • Local (no backend configured): everything is kept in this browser's
//     localStorage — a demo mode for development.
//
// Documents: content | config | products        Collections: orders | customers

import { isRemote } from "./backend";

const LS_PREFIX = "rne-";
const POLL_MS = 30_000;

// ---- localStorage helpers ----
function lsGet(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function lsPut(key, value) {
  try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(value)); } catch (e) {}
}
function lsSet(key, value) {
  if (typeof window === "undefined") return;
  lsPut(key, value);
  // notify same-tab listeners
  window.dispatchEvent(new CustomEvent("rne-store-change", { detail: { key } }));
}

/** Tell the UI (admin toasts) that a server write failed. */
function syncError(what, status) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("rne-sync-error", { detail: { what, status } }));
}

async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(path, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch (e) {}
  if (!res.ok) throw Object.assign(new Error(data?.error || `HTTP ${res.status}`), { status: res.status, data });
  return data;
}

/** Calls fn now, on window focus / tab show, and every POLL_MS while visible. */
function keepFresh(fn) {
  if (typeof window === "undefined") return () => {};
  fn();
  const onFocus = () => document.visibilityState !== "hidden" && fn();
  window.addEventListener("focus", onFocus);
  document.addEventListener("visibilitychange", onFocus);
  const id = setInterval(() => document.visibilityState !== "hidden" && fn(), POLL_MS);
  return () => {
    clearInterval(id);
    window.removeEventListener("focus", onFocus);
    document.removeEventListener("visibilitychange", onFocus);
  };
}

function listenLocal(lsKey, onChange) {
  if (typeof window === "undefined") return () => {};
  const handler = (e) => {
    if (e.type === "storage" && e.key && e.key !== LS_PREFIX + lsKey) return;
    if (e.type === "rne-store-change" && e.detail?.key !== lsKey) return;
    onChange();
  };
  window.addEventListener("storage", handler);
  window.addEventListener("rne-store-change", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("rne-store-change", handler);
  };
}

// ============================================================
// Documents
// ============================================================

export async function readDoc(key, fallback) {
  if (isRemote) {
    try {
      const { data } = await api(`/api/store/doc/${key}`);
      return data ?? fallback;
    } catch (e) {
      return lsGet(key, fallback);
    }
  }
  return lsGet(key, fallback);
}

// Local-first: the UI updates instantly, then the server is written in the
// background. A version stamp (_v) stops a slower, older server copy from
// overwriting a newer local edit when the next refresh arrives.
export async function writeDoc(key, value) {
  const stamped = { ...value, _v: Date.now() };
  lsSet(key, stamped);
  if (isRemote) {
    try {
      await api(`/api/store/doc/${key}`, { method: "PUT", body: stamped });
    } catch (e) {
      console.warn(`Save ${key} failed:`, e.message);
      syncError(key, e.status);
      return false;
    }
  }
  return true;
}

export function subscribeDoc(key, fallback, callback) {
  callback(lsGet(key, fallback));
  const stopLocal = listenLocal(key, () => callback(lsGet(key, fallback)));
  if (!isRemote) return stopLocal;

  let cancelled = false;
  let last = null;
  const stopPoll = keepFresh(async () => {
    try {
      const { data } = await api(`/api/store/doc/${key}`);
      if (cancelled || !data) return;
      const localV = Number(lsGet(key, {})?._v || 0);
      const remoteV = Number(data._v || 0);
      if (localV && remoteV < localV) return; // our newer edit is still syncing
      const str = JSON.stringify(data);
      if (str === last) return;
      last = str;
      lsPut(key, data);
      callback(data);
    } catch (e) {
      /* offline or server down — keep showing the cached copy */
    }
  });
  return () => { cancelled = true; stopPoll(); stopLocal(); };
}

// ============================================================
// Collections (orders, customers)
// ============================================================

// Local-mode add (the demo checkout). In remote mode orders go through
// createOrder() so the server can price them.
export async function addToCollection(collectionName, item) {
  const id = item.id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const record = { id, createdAt: new Date().toISOString(), ...item };
  const current = lsGet(`col:${collectionName}`, []);
  lsSet(`col:${collectionName}`, [record, ...current.filter((r) => r.id !== id)]);
  return record;
}

/**
 * Place an order. Remote: the server validates stock, prices and coupon and
 * returns the stored order (or throws with `.data.error`, e.g. outOfStock).
 */
export async function createOrder(order) {
  if (!isRemote) return addToCollection("orders", order);
  const { order: saved } = await api("/api/orders", { method: "POST", body: order });
  const current = lsGet("col:orders", []);
  lsSet("col:orders", [saved, ...current.filter((r) => r.id !== saved.id)]);
  return saved;
}

export async function validateCouponRemote(code, subtotal) {
  return api("/api/coupon", { method: "POST", body: { code, subtotal } });
}

export async function updateInCollection(collectionName, id, patch) {
  const current = lsGet(`col:${collectionName}`, []);
  lsSet(`col:${collectionName}`, current.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  if (isRemote) {
    try {
      await api(`/api/store/col/${collectionName}/${encodeURIComponent(id)}`, { method: "PATCH", body: patch });
    } catch (e) {
      console.warn(`Update ${collectionName} failed:`, e.message);
      syncError(collectionName, e.status);
    }
  }
}

export async function deleteFromCollection(collectionName, id) {
  const current = lsGet(`col:${collectionName}`, []);
  lsSet(`col:${collectionName}`, current.filter((it) => it.id !== id));
  if (isRemote) {
    try {
      await api(`/api/store/col/${collectionName}/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (e) {
      syncError(collectionName, e.status);
    }
  }
}

// `opts.where = ["userId", uid]` → only that customer's orders.
export function subscribeCollection(collectionName, callback, opts = {}) {
  const lsKey = `col:${collectionName}`;
  callback(lsGet(lsKey, []));
  const stopLocal = listenLocal(lsKey, () => callback(lsGet(lsKey, [])));
  if (!isRemote) return stopLocal;

  const mine = Array.isArray(opts.where) && collectionName === "orders";
  let cancelled = false;
  let last = null;
  const stopPoll = keepFresh(async () => {
    try {
      const { items } = await api(mine ? "/api/orders/mine" : `/api/store/col/${collectionName}`);
      if (cancelled) return;
      const str = JSON.stringify(items);
      if (str === last) return;
      last = str;
      if (!mine) lsPut(lsKey, items);
      callback(items);
    } catch (e) {
      /* not an admin / offline — keep local view */
    }
  });
  return () => { cancelled = true; stopPoll(); stopLocal(); };
}
