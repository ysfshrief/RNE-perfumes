"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import styles from "../auth.module.css";

export default function LoginPage() {
  const { dispatch } = useShop();
  const { signIn, signInWithGoogle } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn(form.email, form.password);
    setLoading(false);
    if (res.ok) {
      // keep the ShopContext user in sync for the storefront UI
      dispatch({ type: "LOGIN", payload: { name: form.email.split("@")[0], email: form.email } });
      router.push("/account");
    } else {
      setError(res.error || t("auth.loginFailed"));
    }
  };

  const googleSignIn = async () => {
    setError("");
    setLoading(true);
    const res = await signInWithGoogle();
    if (res.redirecting) return; // page will redirect to Google, keep loading
    setLoading(false);
    if (res.ok) {
      router.push("/account");
    } else {
      setError(res.error || t("auth.loginFailed"));
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <p className="eyebrow">{t("auth.welcomeBack")}</p>
        <h1 className={styles.title}>{t("auth.signIn")}</h1>
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.field}>
            <label>{t("auth.email")}</label>
            <input type="email" required value={form.email} onChange={set("email")} />
          </div>
          <div className={styles.field}>
            <label>{t("auth.password")}</label>
            <input type="password" required value={form.password} onChange={set("password")} />
          </div>
          {error && <p className={styles.errorMsg}>{error}</p>}
          <button className="btn btn--solid btn--full" type="submit" disabled={loading}>
            {loading ? "..." : t("auth.signIn")}
          </button>
        </form>

        <div className={styles.divider}><span>{t("auth.or")}</span></div>
        <button className={styles.googleBtn} onClick={googleSignIn} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.85 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.67-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.67 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
          {t("auth.google")}
        </button>
        <p className={styles.alt}>
          {t("auth.newHere")} <Link href="/register">{t("auth.createAccount")}</Link>
        </p>
        <p className={styles.note}>{t("auth.loginNote")}</p>
      </div>
    </div>
  );
}
