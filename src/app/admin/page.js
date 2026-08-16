"use client";

import Link from "next/link";
import { products } from "@/data/products";
import styles from "./admin.module.css";
import over from "./overview.module.css";

const STATS = [
  { label: "Revenue (this month)", value: "18,430 EGP", delta: "+12%", up: true },
  { label: "Orders", value: "34", delta: "+6", up: true },
  { label: "New customers", value: "21", delta: "+9", up: true },
  { label: "Low stock items", value: "4", delta: "Action needed", up: false },
];

const RECENT = [
  { id: "RNE-2533", customer: "Dina Fouad", total: "780 EGP", status: "Confirmed", color: "var(--amber-deep)" },
  { id: "RNE-2510", customer: "Sara Adel", total: "1,400 EGP", status: "Out for Delivery", color: "#3d5a6b" },
  { id: "RNE-2508", customer: "Karim Hany", total: "950 EGP", status: "New", color: "var(--olive)" },
  { id: "RNE-2481", customer: "Omar Salah", total: "650 EGP", status: "Delivered", color: "var(--success)" },
];

export default function AdminOverview() {
  const lowStock = products.flatMap((p) =>
    p.sizes
      .filter((s) => s.stock > 0 && s.stock <= 5)
      .map((s) => ({ name: p.name, size: s.size, stock: s.stock }))
  );

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Overview</h1>
        <p className={styles.pageSub}>Welcome back — here&apos;s how RNE is doing today.</p>
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
            <h3>Recent orders</h3>
            <Link href="/admin/orders" className={over.seeAll}>View all →</Link>
          </div>
          <table className={over.miniTable}>
            <tbody>
              {RECENT.map((o) => (
                <tr key={o.id}>
                  <td><strong>{o.id}</strong></td>
                  <td>{o.customer}</td>
                  <td>{o.total}</td>
                  <td><span style={{ color: o.color, fontWeight: 600, fontSize: "0.82rem" }}>● {o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.card}>
          <div className={over.cardHead}>
            <h3>Low stock</h3>
            <Link href="/admin/products" className={over.seeAll}>Manage →</Link>
          </div>
          <div className={over.lowList}>
            {lowStock.map((l, i) => (
              <div key={i} className={over.lowItem}>
                <span>{l.name} · {l.size}</span>
                <span className={over.lowQty}>{l.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
