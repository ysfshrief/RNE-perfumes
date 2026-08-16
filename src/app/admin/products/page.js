"use client";

import { useState } from "react";
import { products as seed } from "@/data/products";
import styles from "../admin.module.css";
import p from "./products.module.css";

export default function AdminProducts() {
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

  return (
    <>
      <div className={p.head}>
        <div>
          <h1 className={styles.pageTitle}>Products</h1>
          <p className={styles.pageSub}>{items.length} products in catalog</p>
        </div>
        <button className={`${styles.btnSm} ${styles.btnSmSolid}`}>+ Add product</button>
      </div>

      <input
        className={p.search}
        placeholder="Search products…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>From</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it) => (
              <tr key={it.id}>
                <td>
                  <div className={p.prod}>
                    <span className={p.swatch} style={{ background: it.color }} />
                    <div>
                      <strong>{it.name}</strong>
                      {it.bestSeller && <span className={p.tagBest}>Best Seller</span>}
                    </div>
                  </div>
                </td>
                <td>{it.gender}</td>
                <td>{it.price} EGP</td>
                <td>
                  <span className={it.stock <= 10 ? p.lowStock : ""}>{it.stock} units</span>
                </td>
                <td>
                  <span
                    className={styles.pill}
                    style={{
                      background: it.hidden ? "#eceae4" : "#e4efe4",
                      color: it.hidden ? "var(--olive)" : "var(--success)",
                    }}
                  >
                    {it.hidden ? "Hidden" : "Visible"}
                  </span>
                </td>
                <td>
                  <div className={styles.rowActions}>
                    <button className={styles.btnSm}>Edit</button>
                    <button className={styles.btnSm} onClick={() => toggleHide(it.id)}>
                      {it.hidden ? "Show" : "Hide"}
                    </button>
                    <button className={`${styles.btnSm} ${styles.btnSmDanger}`} onClick={() => remove(it.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={p.note}>
        This is a preview — changes are local and reset on refresh. In production,
        edits save to the backend.
      </p>
    </>
  );
}
