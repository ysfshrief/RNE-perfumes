"use client";

import { useState } from "react";
import styles from "../admin.module.css";
import d from "./discounts.module.css";

const SEED = [
  { code: "RNE10", type: "Percentage", value: "10%", active: true, uses: 42 },
  { code: "SAVE50", type: "Fixed", value: "50 EGP", active: true, uses: 18 },
  { code: "WINTER25", type: "Percentage", value: "25%", active: false, uses: 0 },
];

export default function AdminDiscounts() {
  const [coupons, setCoupons] = useState(SEED);
  const [form, setForm] = useState({ code: "", type: "Percentage", value: "" });

  const toggle = (code) =>
    setCoupons((list) => list.map((c) => (c.code === code ? { ...c, active: !c.active } : c)));
  const remove = (code) => setCoupons((list) => list.filter((c) => c.code !== code));
  const add = () => {
    if (!form.code || !form.value) return;
    setCoupons((list) => [
      { code: form.code.toUpperCase(), type: form.type, value: form.value, active: true, uses: 0 },
      ...list,
    ]);
    setForm({ code: "", type: "Percentage", value: "" });
  };

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Discounts & coupons</h1>
        <p className={styles.pageSub}>Create percentage or fixed-amount discount codes.</p>
      </div>

      <div className={d.layout}>
        <div className={styles.card}>
          <h3 className={d.formTitle}>New coupon</h3>
          <div className={d.field}>
            <label>Code</label>
            <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="e.g. SUMMER20" />
          </div>
          <div className={d.field}>
            <label>Type</label>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              <option>Percentage</option>
              <option>Fixed</option>
            </select>
          </div>
          <div className={d.field}>
            <label>Value {form.type === "Percentage" ? "(%)" : "(EGP)"}</label>
            <input value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} placeholder={form.type === "Percentage" ? "20%" : "100 EGP"} />
          </div>
          <button className={`${styles.btnSm} ${styles.btnSmSolid}`} style={{ width: "100%", marginTop: "0.5rem", padding: "0.6rem" }} onClick={add}>
            Create coupon
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Uses</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.code}>
                  <td><strong>{c.code}</strong></td>
                  <td>{c.type}</td>
                  <td>{c.value}</td>
                  <td>{c.uses}</td>
                  <td>
                    <span className={styles.pill} style={{ background: c.active ? "#e4efe4" : "#eceae4", color: c.active ? "var(--success)" : "var(--olive)" }}>
                      {c.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button className={styles.btnSm} onClick={() => toggle(c.code)}>{c.active ? "Disable" : "Enable"}</button>
                      <button className={`${styles.btnSm} ${styles.btnSmDanger}`} onClick={() => remove(c.code)}>Delete</button>
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
