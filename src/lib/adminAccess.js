// Admin access policy — one place, so the footer trigger, the admin layout
// and the login redirect all agree.
//
//  • Firebase configured  → the ONLY way in is a signed-in user whose ID token
//    carries the `admin: true` custom claim (set with scripts/setAdmin.mjs).
//    Firestore rules enforce the same claim server-side, so the client guard
//    is UX, and the rules are the real protection.
//  • Firebase NOT configured (local/demo mode) → every edit lives only in this
//    browser's localStorage, so a lightweight code gate is enough. The code
//    comes from NEXT_PUBLIC_ADMIN_DEMO_CODE and falls back to the documented
//    "000" so existing demo setups keep working.

import { isFirebaseEnabled } from "./firebase";

const SESSION_KEY = "rne-admin-unlocked";

export const adminRequiresAuth = isFirebaseEnabled;

export function demoCode() {
  return process.env.NEXT_PUBLIC_ADMIN_DEMO_CODE || "000";
}

export function isDemoUnlocked() {
  if (typeof window === "undefined") return false;
  try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch (e) { return false; }
}

export function unlockDemo(code) {
  if (String(code).trim() !== demoCode()) return false;
  try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e) {}
  return true;
}

export function lockDemo() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
}

/** Only allow same-site relative redirects (blocks `//evil.com`, `https:`…). */
export function safeNext(raw, fallback = "/account") {
  const v = String(raw || "");
  return v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : fallback;
}
