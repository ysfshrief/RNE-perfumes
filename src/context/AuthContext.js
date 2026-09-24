"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { isRemote } from "@/lib/backend";

// Customer accounts.
// - Remote mode: email + password accounts stored in Neon, session in an
//   httpOnly cookie set by /api/auth/* (the browser never sees a token).
// - Local/demo mode: a mock account kept in this browser.
// Admin access is separate (footer gate → /api/admin/session).

const AuthContext = createContext(null);

// Google sign-in needs an OAuth provider; it was part of Firebase and is not
// available on the new backend (the button is hidden).
export const googleSignInAvailable = false;

// Human-friendly error messages (UI picks the language).
export const AUTH_ERRORS = {
  "auth/invalid-credential": { ar: "الإيميل أو كلمة المرور غير صحيحة", en: "Wrong email or password" },
  "auth/email-already-in-use": { ar: "الإيميل مسجّل بالفعل — سجّل الدخول", en: "Email already registered — sign in" },
  "auth/weak-password": { ar: "كلمة المرور قصيرة (٦ أحرف على الأقل)", en: "Password too short (min 6)" },
  "auth/invalid-email": { ar: "صيغة الإيميل غير صحيحة", en: "Invalid email format" },
  "auth/network-request-failed": { ar: "مشكلة في الاتصال بالإنترنت", en: "Network error" },
  "auth/unavailable": { ar: "الخدمة غير متاحة حاليًا، حاول بعد قليل", en: "Service unavailable, try again shortly" },
};

async function call(path, body) {
  try {
    const res = await fetch(path, {
      method: body ? "POST" : "GET",
      credentials: "same-origin",
      cache: "no-store",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, code: data.error || (res.status >= 500 ? "auth/unavailable" : "auth/invalid-credential") };
    return { ok: true, ...data };
  } catch (e) {
    return { ok: false, code: "auth/network-request-failed" };
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isRemote) {
      try {
        const saved = localStorage.getItem("rne-user");
        if (saved) setUser(JSON.parse(saved));
      } catch (e) {}
      setReady(true);
      return;
    }
    let alive = true;
    call("/api/auth/me").then((r) => {
      if (!alive) return;
      setUser(r.ok ? r.user || null : null);
      setReady(true);
    });
    return () => { alive = false; };
  }, []);

  const localLogin = (u) => {
    setUser(u);
    try { localStorage.setItem("rne-user", JSON.stringify(u)); } catch (e) {}
    return { ok: true };
  };

  const signIn = useCallback(async (email, password) => {
    email = (email || "").trim();
    if (!isRemote) return localLogin({ uid: "local", email, name: email.split("@")[0] });
    const r = await call("/api/auth/login", { email, password });
    if (r.ok) setUser(r.user);
    return r.ok ? { ok: true } : { ok: false, code: r.code, error: r.code };
  }, []);

  const register = useCallback(async (email, password, name) => {
    email = (email || "").trim();
    if (!isRemote) return localLogin({ uid: "local", email, name: name || email.split("@")[0] });
    const r = await call("/api/auth/register", { email, password, name });
    if (r.ok) setUser(r.user);
    return r.ok ? { ok: true } : { ok: false, code: r.code, error: r.code };
  }, []);

  const signInWithGoogle = useCallback(async () => ({ ok: false, code: "auth/unavailable", error: "auth/unavailable" }), []);

  const signOut = useCallback(async () => {
    setUser(null);
    try { localStorage.removeItem("rne-user"); } catch (e) {}
    if (isRemote) await call("/api/auth/logout", {});
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin: false, ready, signIn, register, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
