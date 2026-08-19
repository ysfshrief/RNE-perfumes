"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import styles from "../auth.module.css";

const GOV_KEYS = [
  "Cairo", "Giza", "Alexandria", "Beheira", "Dakahlia", "Sharqia",
  "Qalyubia", "Gharbia", "Monufia", "Aswan", "Luxor", "Other",
];
const GOV_AR = {
  Cairo: "القاهرة", Giza: "الجيزة", Alexandria: "الإسكندرية", Beheira: "البحيرة",
  Dakahlia: "الدقهلية", Sharqia: "الشرقية", Qalyubia: "القليوبية", Gharbia: "الغربية",
  Monufia: "المنوفية", Aswan: "أسوان", Luxor: "الأقصر", Other: "أخرى",
};

export default function RegisterPage() {
  const { dispatch } = useShop();
  const { register } = useAuth();
  const { t, lang } = useLang();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", phone: "", governorate: "", city: "", address: "", email: "", password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await register(form.email, form.password, form.name);
    setLoading(false);
    if (res.ok) {
      dispatch({ type: "LOGIN", payload: { name: form.name, email: form.email, ...form } });
      router.push("/account");
    } else {
      setError(res.error || t("auth.registerFailed"));
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={`${styles.card} ${styles.cardWide}`}>
        <p className="eyebrow">{t("auth.joinRne")}</p>
        <h1 className={styles.title}>{t("auth.createTitle")}</h1>
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>{t("auth.fullName")}</label>
              <input required value={form.name} onChange={set("name")} />
            </div>
            <div className={styles.field}>
              <label>{t("auth.phone")}</label>
              <input type="tel" required value={form.phone} onChange={set("phone")} />
            </div>
            <div className={styles.field}>
              <label>{t("auth.governorate")}</label>
              <select required value={form.governorate} onChange={set("governorate")}>
                <option value="">{t("checkout.select")}</option>
                {GOV_KEYS.map((g) => <option key={g} value={g}>{lang === "ar" ? GOV_AR[g] : g}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>{t("auth.city")}</label>
              <input required value={form.city} onChange={set("city")} />
            </div>
            <div className={`${styles.field} ${styles.full}`}>
              <label>{t("auth.address")}</label>
              <input required value={form.address} onChange={set("address")} />
            </div>
            <div className={styles.field}>
              <label>{t("auth.email")}</label>
              <input type="email" required value={form.email} onChange={set("email")} />
            </div>
            <div className={styles.field}>
              <label>{t("auth.password")}</label>
              <input type="password" required value={form.password} onChange={set("password")} />
            </div>
          </div>
          {error && <p className={styles.errorMsg}>{error}</p>}
          <button className="btn btn--solid btn--full" type="submit" disabled={loading}>{loading ? "..." : t("auth.createAccount")}</button>
        </form>
        <p className={styles.alt}>
          {t("auth.alreadyReg")} <Link href="/login">{t("auth.signIn")}</Link>
        </p>
      </div>
    </div>
  );
}
