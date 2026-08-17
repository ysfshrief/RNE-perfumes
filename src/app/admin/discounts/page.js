"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import styles from "../admin.module.css";
import d from "./discounts.module.css";

const SEED = [
  { code: "RNE10", type: "percent", value: "10%", active: true, uses: 42 },
  { code: "SAVE50", type: "fixed", value: "50", active: true, uses: 18 },
  { code: "WINTER25", type: "percent", value: "25%", active: false, uses: 0 },
];

export default function AdminDiscounts() {
  const { t } = useLang();
  const cur = t("common.currency");
  const [coupons, setCoupons] = useState(SEED);
  const [form, setForm] = useState({ code: "", type: "percent", value: "" });

  const typeLabel = (ty) => (ty === "percent" ? t("admin.percentage") : t("admin.fixed"));
  const toggle = (code) => setCoupons((list) => list.map((c) => (c.code === code ? { ...c, active: !c.active } : c)));
  const remove = (code) => setCoupons((list) => list.filter((c) => c.code !== code));
  const add = () => {
    if (!form.code || !form.value) return;
    setCoupons((list) => [{ code: form.code.toUpperCase(), type: form.type, value: form.value, active: true, uses: 0 }, ...list]);
    setForm({ code: "", type: "percent", value: "" });
  };

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t("admin.discountsTitle")}</h1>
        <p className={styles.pageSub}>{t("admin.discountsSub")}</p>
      </div>

      <div className={d.layout}>
        <div className={styles.card}>
          <h3 className={d.formTitle}>{t("admin.newCoupon")}</h3>
          <div className={d.field}>
            <label>{t("admin.code")}</label>
            <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="SUMMER20" />
          </div>
          <div className={d.field}>
            <label>{t("admin.type")}</label>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              <option value="percent">{t("admin.percentage")}</option>
              <option value="fixed">{t("admin.fixed")}</option>
            </select>
          </div>
          <div className={d.field}>
            <label>{t("admin.value")} {form.type === "percent" ? "(%)" : `(${cur})`}</label>
            <input value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} />
          </div>
          <button className={`${styles.btnSm} ${styles.btnSmSolid}`} style={{ width: "100%", marginTop: "0.5rem", padding: "0.6rem" }} onClick={add}>
            {t("admin.createCoupon")}
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("admin.code")}</th>
                <th>{t("admin.type")}</th>
                <th>{t("admin.value")}</th>
                <th>{t("admin.uses")}</th>
                <th>{t("admin.colStatus")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.code}>
                  <td><strong className="keep-latin">{c.code}</strong></td>
                  <td>{typeLabel(c.type)}</td>
                  <td>{c.type === "fixed" ? `${c.value} ${cur}` : c.value}</td>
                  <td>{c.uses}</td>
                  <td>
                    <span className={styles.pill} style={{ background: c.active ? "#e4efe4" : "#eceae4", color: c.active ? "var(--success)" : "var(--olive)" }}>
                      {c.active ? t("admin.active") : t("admin.inactive")}
                    </span>
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button className={styles.btnSm} onClick={() => toggle(c.code)}>{c.active ? t("admin.disable") : t("admin.enable")}</button>
                      <button className={`${styles.btnSm} ${styles.btnSmDanger}`} onClick={() => remove(c.code)}>{t("admin.delete")}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
