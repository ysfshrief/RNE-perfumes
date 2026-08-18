// Firebase client initialization.
// Reads config from NEXT_PUBLIC_* env vars. If they're missing, `isFirebaseEnabled`
// is false and the app falls back to localStorage + default data — so the site
// runs fine on Vercel even before Firebase is connected.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MSG_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase is considered "enabled" only when the essential keys are present.
export const isFirebaseEnabled = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app = null;
let db = null;
let auth = null;

if (isFirebaseEnabled) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (e) {
    // If init fails for any reason, keep the app running in fallback mode.
    // eslint-disable-next-line no-console
    console.warn("Firebase init failed, using local fallback:", e?.message);
  }
}

export { app, db, auth };
