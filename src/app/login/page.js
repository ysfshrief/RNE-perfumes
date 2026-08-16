"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import styles from "../auth.module.css";

export default function LoginPage() {
  const { dispatch } = useShop();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    // Prototype auth — no real backend. Modular by design (blueprint §9).
    dispatch({ type: "LOGIN", payload: { name: form.email.split("@")[0], email: form.email } });
    router.push("/account");
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <p className="eyebrow">Welcome back</p>
        <h1 className={styles.title}>Sign in</h1>
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" required value={form.email} onChange={set("email")} />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input type="password" required value={form.password} onChange={set("password")} />
          </div>
          <button className="btn btn--solid btn--full" type="submit">Sign in</button>
        </form>
        <p className={styles.alt}>
          New to RNE? <Link href="/register">Create an account</Link>
        </p>
        <p className={styles.note}>Preview: any email and password will sign you in.</p>
      </div>
    </div>
  );
}
