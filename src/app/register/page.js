"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import styles from "../auth.module.css";

const GOVERNORATES = [
  "Cairo", "Giza", "Alexandria", "Beheira", "Dakahlia", "Sharqia",
  "Qalyubia", "Gharbia", "Monufia", "Aswan", "Luxor", "Other",
];

export default function RegisterPage() {
  const { dispatch } = useShop();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", phone: "", governorate: "", city: "", address: "", email: "", password: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN", payload: { name: form.name, email: form.email, ...form } });
    router.push("/account");
  };

  return (
    <div className={styles.wrap}>
      <div className={`${styles.card} ${styles.cardWide}`}>
        <p className="eyebrow">Join RNE</p>
        <h1 className={styles.title}>Create your account</h1>
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Full name</label>
              <input required value={form.name} onChange={set("name")} />
            </div>
            <div className={styles.field}>
              <label>Phone number</label>
              <input type="tel" required value={form.phone} onChange={set("phone")} />
            </div>
            <div className={styles.field}>
              <label>Governorate</label>
              <select required value={form.governorate} onChange={set("governorate")}>
                <option value="">Select…</option>
                {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>City / Markaz</label>
              <input required value={form.city} onChange={set("city")} />
            </div>
            <div className={`${styles.field} ${styles.full}`}>
              <label>Detailed address</label>
              <input required value={form.address} onChange={set("address")} />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input type="email" required value={form.email} onChange={set("email")} />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input type="password" required value={form.password} onChange={set("password")} />
            </div>
          </div>
          <button className="btn btn--solid btn--full" type="submit">Create account</button>
        </form>
        <p className={styles.alt}>
          Already registered? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
