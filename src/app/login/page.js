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
  const { signIn } = useAuth();
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
        <p className={styles.alt}>
          {t("auth.newHere")} <Link href="/register">{t("auth.createAccount")}</Link>
        </p>
        <p className={styles.note}>{t("auth.loginNote")}</p>
      </div>
    </div>
  );
}
