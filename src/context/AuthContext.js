"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { isFirebaseEnabled, auth } from "@/lib/firebase";

// Firebase Authentication — rewritten for reliability.
// - Email/Password sign in + register
// - Google sign-in: tries popup, falls back to redirect on COOP/popup issues
// - Detects the `admin` custom claim
// - Falls back to a local mock when Firebase isn't configured

const AuthContext = createContext(null);

// Human-friendly error messages (Arabic + English handled in the UI layer via codes)
export const AUTH_ERRORS = {
  "auth/invalid-credential": { ar: "الإيميل أو كلمة المرور غير صحيحة", en: "Wrong email or password" },
  "auth/wrong-password": { ar: "كلمة المرور غير صحيحة", en: "Wrong password" },
  "auth/user-not-found": { ar: "لا يوجد حساب بهذا الإيميل", en: "No account with this email" },
  "auth/email-already-in-use": { ar: "الإيميل مسجّل بالفعل — سجّل الدخول", en: "Email already registered — sign in" },
  "auth/weak-password": { ar: "كلمة المرور قصيرة (٦ أحرف على الأقل)", en: "Password too short (min 6)" },
  "auth/invalid-email": { ar: "صيغة الإيميل غير صحيحة", en: "Invalid email format" },
  "auth/network-request-failed": { ar: "مشكلة في الاتصال بالإنترنت", en: "Network error" },
  "auth/too-many-requests": { ar: "محاولات كثيرة — انتظر قليلاً", en: "Too many attempts — wait a bit" },
  "auth/popup-closed-by-user": { ar: "تم إغلاق نافذة جوجل", en: "Google window closed" },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isFirebaseEnabled || !auth) {
      try {
        const saved = localStorage.getItem("rne-user");
        if (saved) setUser(JSON.parse(saved));
      } catch (e) {}
      setReady(true);
      return;
    }

    let unsub = () => {};

    // Safety net: if Firebase never answers (offline, blocked network, bad
    // config) `ready` would stay false forever and every gated page would
    // render blank. Resolve after a short wait so the UI can proceed.
    const readyTimer = setTimeout(() => setReady(true), 4000);

    (async () => {
      const {
        onAuthStateChanged,
        getRedirectResult,
        setPersistence,
        browserLocalPersistence,
      } = await import("firebase/auth");

      // Keep the user logged in across sessions
      try { await setPersistence(auth, browserLocalPersistence); } catch (e) {}

      // Complete any pending Google redirect sign-in
      try { await getRedirectResult(auth); } catch (e) {}

      unsub = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          let admin = false;
          try {
            const tokenResult = await fbUser.getIdTokenResult();
            admin = tokenResult.claims.admin === true;
          } catch (e) {}
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName || fbUser.email?.split("@")[0] || "",
          });
          setIsAdmin(admin);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        clearTimeout(readyTimer);
        setReady(true);
      });
    })();
    return () => { clearTimeout(readyTimer); unsub(); };
  }, []);

  // ---- Email / Password sign in ----
  const signIn = useCallback(async (email, password) => {
    email = (email || "").trim();
    if (!isFirebaseEnabled || !auth) {
      const mockUser = { uid: "local", email, name: email.split("@")[0] };
      setUser(mockUser);
      try { localStorage.setItem("rne-user", JSON.stringify(mockUser)); } catch (e) {}
      return { ok: true };
    }
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      await signInWithEmailAndPassword(auth, email, password);
      return { ok: true };
    } catch (e) {
      return { ok: false, code: e.code, error: e.code };
    }
  }, []);

  // ---- Register ----
  const register = useCallback(async (email, password, name) => {
    email = (email || "").trim();
    if (!isFirebaseEnabled || !auth) {
      const mockUser = { uid: "local", email, name: name || email.split("@")[0] };
      setUser(mockUser);
      try { localStorage.setItem("rne-user", JSON.stringify(mockUser)); } catch (e) {}
      return { ok: true };
    }
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) { try { await updateProfile(cred.user, { displayName: name }); } catch (e) {} }
      return { ok: true };
    } catch (e) {
      return { ok: false, code: e.code, error: e.code };
    }
  }, []);

  // ---- Google sign-in (popup → redirect fallback) ----
  const signInWithGoogle = useCallback(async () => {
    if (!isFirebaseEnabled || !auth) {
      const mockUser = { uid: "local", email: "google@user.com", name: "Google User" };
      setUser(mockUser);
      try { localStorage.setItem("rne-user", JSON.stringify(mockUser)); } catch (e) {}
      return { ok: true };
    }
    const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } = await import("firebase/auth");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    // Try popup first
    try {
      await signInWithPopup(auth, provider);
      return { ok: true };
    } catch (popupErr) {
      // COOP / popup-blocked / closed → use redirect (most reliable)
      const fallbackCodes = [
        "auth/popup-blocked",
        "auth/cancelled-popup-request",
        "auth/popup-closed-by-user",
        "auth/internal-error",
      ];
      if (fallbackCodes.includes(popupErr.code) || (popupErr.message || "").includes("Cross-Origin")) {
        try {
          await signInWithRedirect(auth, provider);
          return { ok: true, redirecting: true };
        } catch (redirErr) {
          return { ok: false, code: redirErr.code, error: redirErr.code };
        }
      }
      return { ok: false, code: popupErr.code, error: popupErr.code };
    }
  }, []);

  // ---- Sign out ----
  const signOut = useCallback(async () => {
    if (!isFirebaseEnabled || !auth) {
      setUser(null);
      try { localStorage.removeItem("rne-user"); } catch (e) {}
      return;
    }
    const { signOut: fbSignOut } = await import("firebase/auth");
    try { await fbSignOut(auth); } catch (e) {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, ready, signIn, register, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
