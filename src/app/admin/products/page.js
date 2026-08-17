"use client";

import { useState } from "react";
import { products as seed } from "@/data/products";
import { useLang } from "@/context/LangContext";
import styles from "../admin.module.css";
import p from "./products.module.css";

export default function AdminProducts() {
  const { t } = useLang();
  const cur = t("common.currency");
  const [items, setItems] = useState(
    seed.map((x) => ({
      id: x.id, name: x.name, gender: x.gender, hidden: false,
      price: Math.min(...x.sizes.map((s) => s.price)),
      stock: x.sizes.reduce((n, s) => n + s.stock, 0),
      bestSeller: x.bestSeller, color: x.images[0],
    }))
  );
  const [q, setQ] = useState("");

  const toggleHide = (id) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, hidden: !it.hidden } : it)));
  const remove = (id) => setItems((list) => list.filter((it) => it.id !== id));
  const filtered = items.filter((it) => it.name.toLowerCase().includes(q.toLowerCase()));
  const catLabel = { Men: t("g.Men"), Women: t("g.Women") };

  return (
    <>
      <div className={p.head}>
        <div>
          <h1 className={styles.pageTitle}>{t("admin.products")}</h1>
          <p className={styles.pageSub}>{t("admin.inCatalog", { n: items.length })}</p>
        </div>
        <button className={`${styles.btnSm} ${styles.btnSmSolid}`}>{t("admin.addProduct")}</button>
      </div>

      <input
        className={p.search}
        placeholder={t("admin.searchProducts")}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t("admin.colProduct")}</th>
              <th>{t("admin.colCategory")}</th>
              <th>{t("admin.colFrom")}</th>
              <th>{t("admin.colStock")}</th>
              <th>{t("admin.colStatus")}</th>
              <th>{t("admin.colActions")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it) => (
              <tr key={it.id}>
                <td>
                  <div className={p.prod}>
                    <span className={p.swatch} style={{ background: it.color }} />
                    <div>
                      <strong className="keep-latin">{it.name}</strong>
                      {it.bestSeller && <span className={p.tagBest}>{t("badge.best")}</span>}
                    </div>
                  </div>
                </td>
                <td>{catLabel[it.gender] || it.gender}</td>
                <td>{it.price} {cur}</td>
                <td><span className={it.stock <= 10 ? p.lowStock : ""}>{t("admin.units", { n: it.stock })}</span></td>
                <td>
                  <span className={styles.pill} style={{ background: it.hidden ? "#eceae4" : "#e4efe4", color: it.hidden ? "var(--olive)" : "var(--success)" }}>
                    {it.hidden ? t("admin.hidden") : t("admin.visible")}
                  </span>
                </td>
                <td>
                  <div className={styles.rowActions}>
                    <button className={styles.btnSm}>{t("admin.edit")}</button>
                    <button className={styles.btnSm} onClick={() => toggleHide(it.id)}>
                      {it.hidden ? t("admin.show") : t("admin.hide")}
                    </button>
                    <button className={`${styles.btnSm} ${styles.btnSmDanger}`} onClick={() => remove(it.id)}>
                      {t("admin.delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={p.note}>{t("admin.previewNote")}</p>
    </>
  );
}
