"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { useLang } from "@/context/LangContext";
import styles from "../auth.module.css";

export default function LoginPage() {
  const { dispatch } = useShop();
  const { t } = useLang();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN", payload: { name: form.email.split("@")[0], email: form.email } });
    router.push("/account");
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
          <button className="btn btn--solid btn--full" type="submit">{t("auth.signIn")}</button>
        </form>
        <p className={styles.alt}>
          {t("auth.newHere")} <Link href="/register">{t("auth.createAccount")}</Link>
        </p>
        <p className={styles.note}>{t("auth.loginNote")}</p>
      </div>
    </div>
  );
}
