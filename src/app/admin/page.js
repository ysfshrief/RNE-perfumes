"use client";

import Link from "next/link";
import { products } from "@/data/products";
import { useLang } from "@/context/LangContext";
import styles from "./admin.module.css";
import over from "./overview.module.css";

export default function AdminOverview() {
  const { t } = useLang();
  const cur = t("common.currency");

  const STATS = [
    { label: t("admin.revenue"), value: `18,430 ${cur}`, delta: "+12%", up: true },
    { label: t("admin.ordersStat"), value: "34", delta: "+6", up: true },
    { label: t("admin.newCustomers"), value: "21", delta: "+9", up: true },
    { label: t("admin.lowStockItems"), value: "4", delta: t("admin.actionNeeded"), up: false },
  ];

  const RECENT = [
    { id: "RNE-2533", customer: "Dina Fouad", total: `780 ${cur}`, status: "Confirmed", color: "var(--amber-deep)" },
    { id: "RNE-2510", customer: "Sara Adel", total: `1,400 ${cur}`, status: "OutForDelivery", color: "#3d5a6b" },
    { id: "RNE-2508", customer: "Karim Hany", total: `950 ${cur}`, status: "New", color: "var(--olive)" },
    { id: "RNE-2481", customer: "Omar Salah", total: `650 ${cur}`, status: "Delivered", color: "var(--success)" },
  ];

  const lowStock = products.flatMap((p) =>
    p.sizes.filter((s) => s.stock > 0 && s.stock <= 5).map((s) => ({ name: p.name, size: s.size, stock: s.stock }))
  );

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t("admin.overview")}</h1>
        <p className={styles.pageSub}>{t("admin.welcomeBack")}</p>
      </div>

      <div className={over.stats}>
        {STATS.map((s) => (
          <div key={s.label} className={over.stat}>
            <span className={over.statLabel}>{s.label}</span>
            <span className={over.statValue}>{s.value}</span>
            <span className={`${over.statDelta} ${s.up ? over.up : over.down}`}>{s.delta}</span>
          </div>
        ))}
      </div>

      <div className={over.grid}>
        <div className={styles.card}>
          <div className={over.cardHead}>
            <h3>{t("admin.recentOrders")}</h3>
            <Link href="/admin/orders" className={over.seeAll}>{t("admin.viewAll")}</Link>
          </div>
          <table className={over.miniTable}>
            <tbody>
              {RECENT.map((o) => (
                <tr key={o.id}>
                  <td><strong className="keep-latin">{o.id}</strong></td>
                  <td>{o.customer}</td>
                  <td>{o.total}</td>
                  <td><span style={{ color: o.color, fontWeight: 600, fontSize: "0.82rem" }}>● {t(`status.${o.status}`)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.card}>
          <div className={over.cardHead}>
            <h3>{t("admin.lowStock")}</h3>
            <Link href="/admin/products" className={over.seeAll}>{t("admin.manage")}</Link>
          </div>
          <div className={over.lowList}>
            {lowStock.map((l, i) => (
              <div key={i} className={over.lowItem}>
                <span className="keep-latin">{l.name} · {l.size}</span>
                <span className={over.lowQty}>{t("admin.left", { n: l.stock })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
