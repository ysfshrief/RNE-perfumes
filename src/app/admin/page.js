"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { useProducts } from "@/context/ProductContext";
import { subscribeCollection } from "@/lib/store";
import { egp } from "@/lib/pricing";
import { pName } from "@/data/productLocale";
import styles from "./admin.module.css";
import over from "./overview.module.css";

// Orders that represent money actually earned. Cancelled/returned orders are
// excluded from revenue so the figure can be trusted.
const REVENUE_STATUSES = ["New", "Confirmed", "Preparing", "OutForDelivery", "Delivered"];

export default function AdminOverview() {
  const { t, lang } = useLang();
  const cur = t("common.currency");
  const { allProducts } = useProducts();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [range, setRange] = useState("all"); // all | 30d | 7d | today

  useEffect(() => {
    const u1 = subscribeCollection("orders", setOrders);
    const u2 = subscribeCollection("customers", setCustomers);
    return () => { u1(); u2(); };
  }, []);

  const since = useMemo(() => {
    const now = new Date();
    if (range === "today") { const d = new Date(now); d.setHours(0,0,0,0); return d.getTime(); }
    if (range === "7d") return now.getTime() - 7 * 864e5;
    if (range === "30d") return now.getTime() - 30 * 864e5;
    return 0;
  }, [range]);

  // The date range genuinely filters every figure derived from it.
  const scoped = useMemo(
    () => orders.filter((o) => !since || new Date(o.createdAt || 0).getTime() >= since),
    [orders, since]
  );

  const stats = useMemo(() => {
    const revenueOrders = scoped.filter((o) => REVENUE_STATUSES.includes(o.status));
    // Use the total stored on the order — the price at the time of purchase —
    // never the current catalogue price.
    const revenue = revenueOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const emails = new Set(
      scoped.map((o) => o.customer?.email).filter(Boolean)
    );
    const pending = scoped.filter((o) => o.status === "New").length;
    return {
      revenue: egp(revenue),
      orders: scoped.length,
      pending,
      customers: since ? emails.size : new Set([
        ...customers.map((c) => c.email).filter(Boolean),
        ...emails,
      ]).size,
    };
  }, [scoped, customers, since]);

  const lowStock = useMemo(
    () =>
      allProducts.flatMap((p) =>
        (p.sizes || [])
          .filter((s) => s.stock > 0 && s.stock <= 5)
          .map((s) => ({ id: `${p.id}-${s.size}`, name: pName(p, lang), size: s.size, stock: s.stock }))
      ),
    [allProducts, lang]
  );

  const recent = scoped.slice(0, 6);

  const RANGES = [
    { key: "all", label: t("admin.rangeAll") },
    { key: "30d", label: t("admin.range30") },
    { key: "7d", label: t("admin.range7") },
    { key: "today", label: t("admin.rangeToday") },
  ];

  const STATS = [
    { label: t("admin.revenue"), value: `${stats.revenue.toLocaleString()} ${cur}` },
    { label: t("admin.ordersStat"), value: String(stats.orders) },
    { label: t("admin.pendingOrders"), value: String(stats.pending) },
    { label: t("admin.customers"), value: String(stats.customers) },
    { label: t("admin.lowStockItems"), value: String(lowStock.length) },
  ];

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t("admin.overview")}</h1>
        <p className={styles.pageSub}>{t("admin.welcomeBack")}</p>
      </div>

      <div className={over.ranges}>
        {RANGES.map((r) => (
          <button
            key={r.key}
            className={`${over.range} ${range === r.key ? over.rangeOn : ""}`}
            onClick={() => setRange(r.key)}
            aria-pressed={range === r.key}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className={over.stats}>
        {STATS.map((s) => (
          <div key={s.label} className={over.stat}>
            <span className={over.statLabel}>{s.label}</span>
            <span className={over.statValue}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className={over.grid}>
        <div className={styles.card}>
          <div className={over.cardHead}>
            <h3>{t("admin.recentOrders")}</h3>
            <Link href="/admin/orders" className={over.seeAll}>{t("admin.viewAll")}</Link>
          </div>
          {recent.length === 0 ? (
            <p className={over.emptyNote}>{t("admin.noOrders")}</p>
          ) : (
            <table className={over.miniTable}>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id}>
                    <td><strong className="keep-latin">{String(o.id).slice(0, 8)}</strong></td>
                    <td>{o.customer?.name || "—"}</td>
                    <td>{egp(o.total)} {cur}</td>
                    <td><span className={over.statusDot}>● {t(`status.${o.status}`)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.card}>
          <div className={over.cardHead}>
            <h3>{t("admin.lowStock")}</h3>
            <Link href="/admin/products" className={over.seeAll}>{t("admin.manage")}</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className={over.emptyNote}>{t("admin.noLowStock")}</p>
          ) : (
            <div className={over.lowList}>
              {lowStock.map((l) => (
                <div key={l.id} className={over.lowItem}>
                  <span>{l.name} · <span className="keep-latin">{l.size}</span></span>
                  <span className={over.lowQty}>{t("admin.left", { n: l.stock })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
