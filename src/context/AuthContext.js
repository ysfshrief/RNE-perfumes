"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { isFirebaseEnabled, auth } from "@/lib/firebase";

// Wires Firebase Authentication. Tracks the signed-in user and whether they
// hold the `admin` custom claim (set via scripts/setAdmin.mjs). When Firebase
// isn't configured, it falls back to a local mock so the prototype still works.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // { uid, email, name }
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  // Subscribe to Firebase auth state
  useEffect(() => {
    if (!isFirebaseEnabled || !auth) {
      // Fallback: restore mock user from localStorage
      try {
        const saved = localStorage.getItem("rne-user");
        if (saved) setUser(JSON.parse(saved));
      } catch (e) {}
      setReady(true);
      return;
    }

    let unsub = () => {};
    (async () => {
      const { onAuthStateChanged, getRedirectResult } = await import("firebase/auth");
      // Complete any pending Google redirect sign-in
      try { await getRedirectResult(auth); } catch (e) {}
      unsub = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          // Read the custom claims to detect admin
          const tokenResult = await fbUser.getIdTokenResult();
          const admin = tokenResult.claims.admin === true;
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
        setReady(true);
      });
    })();
    return () => unsub();
  }, []);

  // Sign in with email/password
  const signIn = useCallback(async (email, password) => {
    if (!isFirebaseEnabled || !auth) {
      // mock
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
      return { ok: false, error: e.code || e.message };
    }
  }, []);

  // Register with email/password
  const register = useCallback(async (email, password, name) => {
    if (!isFirebaseEnabled || !auth) {
      const mockUser = { uid: "local", email, name: name || email.split("@")[0] };
      setUser(mockUser);
      try { localStorage.setItem("rne-user", JSON.stringify(mockUser)); } catch (e) {}
      return { ok: true };
    }
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.code || e.message };
    }
  }, []);

  // Sign in with Google (popup, with redirect fallback for COOP-restricted browsers)
  const signInWithGoogle = useCallback(async () => {
    if (!isFirebaseEnabled || !auth) {
      const mockUser = { uid: "local", email: "google@user.com", name: "Google User" };
      setUser(mockUser);
      try { localStorage.setItem("rne-user", JSON.stringify(mockUser)); } catch (e) {}
      return { ok: true };
    }
    try {
      const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      try {
        await signInWithPopup(auth, provider);
        return { ok: true };
      } catch (popupErr) {
        // Popup blocked or closed by browser security (COOP) → fall back to redirect
        if (
          popupErr.code === "auth/popup-blocked" ||
          popupErr.code === "auth/cancelled-popup-request" ||
          popupErr.code === "auth/popup-closed-by-user" ||
          (popupErr.message && popupErr.message.includes("Cross-Origin"))
        ) {
          await signInWithRedirect(auth, provider);
          return { ok: true, redirecting: true };
        }
        throw popupErr;
      }
    } catch (e) {
      return { ok: false, error: e.code || e.message };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!isFirebaseEnabled || !auth) {
      setUser(null);
      try { localStorage.removeItem("rne-user"); } catch (e) {}
      return;
    }
    const { signOut: fbSignOut } = await import("firebase/auth");
    await fbSignOut(auth);
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
