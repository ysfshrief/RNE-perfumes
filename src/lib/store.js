// Unified data store. When Firebase is configured it reads/writes Firestore
// documents; otherwise it falls back to localStorage. Every getter returns a
// plain object, and subscribe() streams live updates (Firestore onSnapshot, or
// a storage-event listener in fallback mode).
//
// Collection layout in Firestore:
//   settings/content   -> { en: {...}, ar: {...} }   (text overrides)
//   settings/config    -> { learnMore, adSlides, wheel }
//   settings/products  -> { [productId]: {...override} }
//
// Using single documents keeps reads cheap and the whole prototype within the
// Firestore free tier.

import { isFirebaseEnabled, db } from "./firebase";

let fs = null; // lazily-loaded firestore functions
async function loadFirestore() {
  if (fs) return fs;
  fs = await import("firebase/firestore");
  return fs;
}

const LS_PREFIX = "rne-";

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
function lsSet(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
    // notify same-tab listeners
    window.dispatchEvent(new CustomEvent("rne-store-change", { detail: { key } }));
  } catch (e) {}
}

// ---- Public API ----

// Read a settings document once. `key` is one of: content | config | products
export async function readDoc(key, fallback) {
  if (isFirebaseEnabled && db) {
    try {
      const { doc, getDoc } = await loadFirestore();
      const snap = await getDoc(doc(db, "settings", key));
      return snap.exists() ? snap.data() : fallback;
    } catch (e) {
      return lsGet(key, fallback);
    }
  }
  return lsGet(key, fallback);
}

// Write (replace) a settings document.
export async function writeDoc(key, value) {
  if (isFirebaseEnabled && db) {
    try {
      const { doc, setDoc } = await loadFirestore();
      await setDoc(doc(db, "settings", key), value, { merge: false });
      return true;
    } catch (e) {
      lsSet(key, value); // keep a local copy so the admin still sees changes
      return false;
    }
  }
  lsSet(key, value);
  return true;
}

// Subscribe to live updates. Returns an unsubscribe function.
export function subscribeDoc(key, fallback, callback) {
  if (isFirebaseEnabled && db) {
    let unsub = () => {};
    let cancelled = false;
    loadFirestore().then(({ doc, onSnapshot }) => {
      if (cancelled) return;
      unsub = onSnapshot(
        doc(db, "settings", key),
        (snap) => callback(snap.exists() ? snap.data() : fallback),
        () => callback(lsGet(key, fallback))
      );
    });
    return () => { cancelled = true; unsub(); };
  }

  // Fallback: seed once, then listen for local changes (same-tab + cross-tab)
  callback(lsGet(key, fallback));
  if (typeof window === "undefined") return () => {};
  const handler = (e) => {
    if (e.type === "storage" && e.key && e.key !== LS_PREFIX + key) return;
    if (e.type === "rne-store-change" && e.detail?.key !== key) return;
    callback(lsGet(key, fallback));
  };
  window.addEventListener("storage", handler);
  window.addEventListener("rne-store-change", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("rne-store-change", handler);
  };
}
