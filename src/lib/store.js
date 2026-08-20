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

// ============================================================
// Collection helpers — for lists like orders, customers, discounts.
// Each collection is stored as an array under a localStorage key, and (when
// Firebase is enabled) as a Firestore collection with the same name.
// ============================================================

// Add an item to a collection (generates an id + timestamp).
export async function addToCollection(collectionName, item) {
  const id = item.id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const record = { id, createdAt: new Date().toISOString(), ...item };

  // Local-first
  const current = lsGet(`col:${collectionName}`, []);
  const next = [record, ...current];
  lsSet(`col:${collectionName}`, next);

  // Firestore sync
  if (isFirebaseEnabled && db) {
    try {
      const { doc, setDoc } = await loadFirestore();
      await setDoc(doc(db, collectionName, id), record);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`Firestore add to ${collectionName} failed (kept local):`, e?.message);
    }
  }
  return record;
}

// Update an item in a collection by id.
export async function updateInCollection(collectionName, id, patch) {
  const current = lsGet(`col:${collectionName}`, []);
  const next = current.map((it) => (it.id === id ? { ...it, ...patch } : it));
  lsSet(`col:${collectionName}`, next);

  if (isFirebaseEnabled && db) {
    try {
      const { doc, setDoc } = await loadFirestore();
      await setDoc(doc(db, collectionName, id), patch, { merge: true });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`Firestore update ${collectionName} failed:`, e?.message);
    }
  }
}

// Delete an item from a collection by id.
export async function deleteFromCollection(collectionName, id) {
  const current = lsGet(`col:${collectionName}`, []);
  lsSet(`col:${collectionName}`, current.filter((it) => it.id !== id));

  if (isFirebaseEnabled && db) {
    try {
      const { doc, deleteDoc } = await loadFirestore();
      await deleteDoc(doc(db, collectionName, id));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`Firestore delete ${collectionName} failed:`, e?.message);
    }
  }
}

// Subscribe to a whole collection (live). Returns unsubscribe.
export function subscribeCollection(collectionName, callback) {
  // seed from local
  const seeded = lsGet(`col:${collectionName}`, []);
  callback(seeded);

  let localCleanup = () => {};
  if (typeof window !== "undefined") {
    const handler = (e) => {
      if (e.type === "storage" && e.key && e.key !== `${LS_PREFIX}col:${collectionName}`) return;
      if (e.type === "rne-store-change" && e.detail?.key !== `col:${collectionName}`) return;
      callback(lsGet(`col:${collectionName}`, []));
    };
    window.addEventListener("storage", handler);
    window.addEventListener("rne-store-change", handler);
    localCleanup = () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("rne-store-change", handler);
    };
  }

  if (isFirebaseEnabled && db) {
    let unsub = () => {};
    let cancelled = false;
    loadFirestore().then(({ collection, onSnapshot, query, orderBy }) => {
      if (cancelled) return;
      const handleSnap = (snap) => {
        const items = snap.docs.map((d) => d.data());
        // Never let an empty Firestore result wipe existing local data.
        // (Empty can mean: offline cache, pending server fetch, or a genuinely
        // empty collection — we can't tell reliably, so we keep local data.)
        if (items.length === 0) {
          const local = lsGet(`col:${collectionName}`, []);
          if (local.length > 0) return; // keep what we have
        }
        try { localStorage.setItem(`${LS_PREFIX}col:${collectionName}`, JSON.stringify(items)); } catch (e) {}
        callback(items);
      };
      try {
        const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
        unsub = onSnapshot(q, handleSnap, (err) => {
          // eslint-disable-next-line no-console
          console.warn(`Firestore subscribe ${collectionName} error:`, err?.message);
        });
      } catch (e) {
        unsub = onSnapshot(collection(db, collectionName), handleSnap);
      }
    });
    return () => { cancelled = true; unsub(); localCleanup(); };
  }

  return localCleanup;
}
