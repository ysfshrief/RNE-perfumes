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
// Always updates the local cache + fires a same-tab event so the UI reflects
// instantly, then syncs to Firestore in the background when enabled. This keeps
// the admin (and this browser) responsive even if Firestore is slow/unreachable.
export async function writeDoc(key, value) {
  // 1) Local-first: update cache and notify listeners immediately.
  lsSet(key, value);

  // 2) Sync to Firestore in the background (when enabled).
  if (isFirebaseEnabled && db) {
    try {
      const { doc, setDoc } = await loadFirestore();
      await setDoc(doc(db, "settings", key), value, { merge: false });
      return true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Firestore write failed (kept local copy):", e?.message);
      return false;
    }
  }
  return true;
}

// Subscribe to live updates. Returns an unsubscribe function.
export function subscribeDoc(key, fallback, callback) {
  // Always seed from local cache first so the UI has data instantly.
  callback(lsGet(key, fallback));

  // Always listen for local changes (same-tab + cross-tab) so writes reflect
  // immediately regardless of Firestore connectivity.
  let localCleanup = () => {};
  if (typeof window !== "undefined") {
    const handler = (e) => {
      if (e.type === "storage" && e.key && e.key !== LS_PREFIX + key) return;
      if (e.type === "rne-store-change" && e.detail?.key !== key) return;
      callback(lsGet(key, fallback));
    };
    window.addEventListener("storage", handler);
    window.addEventListener("rne-store-change", handler);
    localCleanup = () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("rne-store-change", handler);
    };
  }

  // When Firebase is enabled, ALSO subscribe to Firestore for cross-device sync.
  if (isFirebaseEnabled && db) {
    let unsub = () => {};
    let cancelled = false;
    loadFirestore().then(({ doc, onSnapshot }) => {
      if (cancelled) return;
      unsub = onSnapshot(
        doc(db, "settings", key),
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            // keep local cache in sync (without re-firing our own event loop)
            try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(data)); } catch (e) {}
            callback(data);
          }
        },
        (err) => {
          // eslint-disable-next-line no-console
          console.warn("Firestore subscribe error (using local):", err?.message);
        }
      );
    });
    return () => { cancelled = true; unsub(); localCleanup(); };
  }

  return localCleanup;
}
