// Signed, httpOnly cookie sessions + password hashing (Node crypto only).
import { createHmac, randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "rne_admin";
export const USER_COOKIE = "rne_user";
const ADMIN_TTL = 60 * 60 * 12;       // 12 hours
const USER_TTL = 60 * 60 * 24 * 30;   // 30 days

// AUTH_SECRET should be set in production. Falling back to a hash of the
// database URL keeps the site working (that URL is itself a server secret)
// without letting anyone forge cookies.
function secret() {
  const s = process.env.AUTH_SECRET || process.env.DATABASE_URL || "";
  if (!s) throw Object.assign(new Error("AUTH_SECRET / DATABASE_URL not set"), { status: 503 });
  return createHash("sha256").update(`rne:${s}`).digest();
}

const b64 = (buf) => Buffer.from(buf).toString("base64url");

export function sign(payload, ttlSeconds) {
  const body = b64(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds }));
  const sig = b64(createHmac("sha256", secret()).update(body).digest());
  return `${body}.${sig}`;
}

export function verify(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expected = b64(createHmac("sha256", secret()).update(body).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!data.exp || data.exp < Date.now() / 1000) return null;
    return data;
  } catch (e) {
    return null;
  }
}

const cookieOpts = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge,
});

// ── Admin ──────────────────────────────────────────────────
export function adminCode() {
  // TEMPORARY per the owner: the footer gate code. Change ADMIN_CODE in the
  // hosting environment to anything stronger at any time.
  return String(process.env.ADMIN_CODE || "000");
}

export function checkAdminCode(code) {
  const a = Buffer.from(String(code ?? ""));
  const b = Buffer.from(adminCode());
  return a.length === b.length && timingSafeEqual(a, b);
}

export function setAdminSession(res) {
  res.cookies.set(ADMIN_COOKIE, sign({ role: "admin" }, ADMIN_TTL), cookieOpts(ADMIN_TTL));
}
export function clearAdminSession(res) {
  res.cookies.set(ADMIN_COOKIE, "", cookieOpts(0));
}
export function isAdminRequest() {
  const v = verify(cookies().get(ADMIN_COOKIE)?.value);
  return v?.role === "admin";
}

// ── Customers ──────────────────────────────────────────────
export function setUserSession(res, user) {
  res.cookies.set(USER_COOKIE, sign({ uid: user.id, email: user.email, name: user.name }, USER_TTL), cookieOpts(USER_TTL));
}
export function clearUserSession(res) {
  res.cookies.set(USER_COOKIE, "", cookieOpts(0));
}
export function currentUser() {
  const v = verify(cookies().get(USER_COOKIE)?.value);
  return v?.uid ? { uid: v.uid, email: v.email, name: v.name } : null;
}

// ── Passwords (scrypt) ────────────────────────────────────
export function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(String(password), salt, 64);
  return `scrypt$${b64(salt)}$${b64(hash)}`;
}
export function verifyPassword(password, stored) {
  const [alg, salt, hash] = String(stored || "").split("$");
  if (alg !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const actual = scryptSync(String(password), Buffer.from(salt, "base64url"), expected.length);
  return timingSafeEqual(actual, expected);
}
