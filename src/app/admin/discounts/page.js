"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { useConfig } from "@/context/ConfigContext";
import styles from "../admin.module.css";
import d from "./discounts.module.css";

export default function AdminDiscounts() {
  const { t } = useLang();
  const { config, save } = useConfig();
  const cur = t("common.currency");
  const coupons = config.coupons || [];
  const [form, setForm] = useState({ code: "", type: "percent", value: "", expiresAt: "", minOrder: "", usageLimit: "" });

  const persist = (next) => save({ ...config, coupons: next });

  const typeLabel = (ty) => (ty === "percent" ? t("admin.percentage") : t("admin.fixed"));
  const toggle = (code) => persist(coupons.map((c) => (c.code === code ? { ...c, active: !c.active } : c)));
  const remove = (code) => persist(coupons.filter((c) => c.code !== code));
  const add = () => {
    const code = form.code.trim().toUpperCase();
    if (!code || !form.value) return;
    // Codes are unique — updating an existing one rather than silently
    // creating a duplicate the validator would never reach.
    const rest = coupons.filter((c) => String(c.code).toUpperCase() !== code);
    persist([
      {
        code,
        type: form.type,
        value: form.value,
        expiresAt: form.expiresAt || null,
        minOrder: form.minOrder || null,
        usageLimit: form.usageLimit || null,
        active: true,
        uses: 0,
      },
      ...rest,
    ]);
    setForm({ code: "", type: "percent", value: "", expiresAt: "", minOrder: "", usageLimit: "" });
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
          <div className={d.field}>
            <label>{t("admin.couponExpiry")}</label>
            <input type="date" value={form.expiresAt} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))} />
          </div>
          <div className={d.field}>
            <label>{t("admin.couponMinOrder")} ({cur})</label>
            <input type="number" min="0" value={form.minOrder} placeholder="0" onChange={(e) => setForm((f) => ({ ...f, minOrder: e.target.value }))} />
          </div>
          <div className={d.field}>
            <label>{t("admin.couponUsageLimit")}</label>
            <input type="number" min="0" value={form.usageLimit} placeholder="∞" onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))} />
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
                <th>{t("admin.couponLimits")}</th>
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
                  <td className={d.limits}>
                    {c.expiresAt && <span>⏳ {c.expiresAt}</span>}
                    {c.minOrder ? <span>≥ {c.minOrder} {cur}</span> : null}
                    {c.usageLimit ? <span>≤ {c.usageLimit}</span> : null}
                    {!c.expiresAt && !c.minOrder && !c.usageLimit && <span>—</span>}
                  </td>
                  <td>{c.uses || 0}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                  <td>
                    <span className={styles.pill} style={{ background: c.active ? "rgba(106,146,104,0.2)" : "rgba(255,255,255,0.07)", color: c.active ? "var(--success)" : "var(--olive)" }}>
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
