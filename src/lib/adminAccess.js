// Admin access — one place, so the footer trigger, the admin layout and the
// sidebar sign-out all agree.
//
// Entry (owner's request, temporary): tap the RNE logo in the footer 3×,
// then enter the code (default "000").
//  • Remote mode (Neon): the code is checked by the SERVER (/api/admin/session,
//    env ADMIN_CODE) which sets an httpOnly cookie. Every admin write is
//    verified against that cookie, so the browser cannot fake it.
//  • Local demo mode: compared in the browser (NEXT_PUBLIC_ADMIN_DEMO_CODE),
//    since all data is local to that browser anyway.

import { isRemote } from "./backend";

const SESSION_KEY = "rne-admin-unlocked";

function localCode() {
  return process.env.NEXT_PUBLIC_ADMIN_DEMO_CODE || "000";
}

/** Try a code. Resolves true when admin access was granted. */
export async function unlockAdmin(code) {
  if (isRemote) {
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: String(code).trim() }),
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }
  if (String(code).trim() !== localCode()) return false;
  try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e) {}
  return true;
}

/** Is this browser currently signed in as admin? */
export async function checkAdmin() {
  if (isRemote) {
    try {
      const res = await fetch("/api/admin/session", { credentials: "same-origin", cache: "no-store" });
      const data = await res.json();
      return !!data.admin;
    } catch (e) {
      return false;
    }
  }
  try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch (e) { return false; }
}

export async function lockAdmin() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
  if (isRemote) {
    try { await fetch("/api/admin/session", { method: "DELETE", credentials: "same-origin" }); } catch (e) {}
  }
}

/** Only allow same-site relative redirects (blocks `//evil.com`, `https:`…). */
export function safeNext(raw, fallback = "/account") {
  const v = String(raw || "");
  return v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : fallback;
}
