"use client";

import { useState } from "react";
import styles from "../admin.module.css";
import r from "./reviews.module.css";

const SEED = [
  { id: 1, product: "Rose de Nuit", name: "Nada M.", rating: 5, text: "The rose is so natural, not soapy at all. Obsessed.", status: "pending", date: "2026-08-15" },
  { id: 2, product: "Noir Absolu", name: "Karim H.", rating: 5, text: "Lasts all day, projects beautifully. My signature scent now.", status: "approved", date: "2026-07-12" },
  { id: 3, product: "Citrus Marin", name: "Anonymous", rating: 2, text: "Didn't last long on me. Buy tester first.", status: "pending", date: "2026-08-16" },
  { id: 4, product: "Ambre Royal", name: "Dina F.", rating: 5, text: "Warm and luxurious. Worth every pound.", status: "approved", date: "2026-07-05" },
];

const STATUS_STYLE = {
  pending: { bg: "#f6ecd8", c: "var(--amber-deep)", label: "Pending" },
  approved: { bg: "#e4efe4", c: "var(--success)", label: "Approved" },
  hidden: { bg: "#eceae4", c: "var(--olive)", label: "Hidden" },
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState(SEED);

  const setStatus = (id, status) =>
    setReviews((list) => list.map((rv) => (rv.id === id ? { ...rv, status } : rv)));
  const remove = (id) => setReviews((list) => list.filter((rv) => rv.id !== id));

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Reviews</h1>
        <p className={styles.pageSub}>
          Only approved reviews appear on the storefront.
        </p>
      </div>

      <div className={r.list}>
        {reviews.map((rv) => (
          <div key={rv.id} className={styles.card}>
            <div className={r.top}>
              <div>
                <strong className={r.product}>{rv.product}</strong>
                <span className={r.meta}>{rv.name} · {rv.date}</span>
              </div>
              <span className={styles.pill} style={{ background: STATUS_STYLE[rv.status].bg, color: STATUS_STYLE[rv.status].c }}>
                {STATUS_STYLE[rv.status].label}
              </span>
            </div>
            <div className="stars" style={{ margin: "0.4rem 0" }}>{"★".repeat(rv.rating)}{"☆".repeat(5 - rv.rating)}</div>
            <p className={r.text}>{rv.text}</p>
            <div className={r.actions}>
              {rv.status !== "approved" && (
                <button className={`${styles.btnSm} ${styles.btnSmSolid}`} onClick={() => setStatus(rv.id, "approved")}>
                  Approve
                </button>
              )}
              {rv.status === "approved" && (
                <button className={styles.btnSm} onClick={() => setStatus(rv.id, "hidden")}>Hide</button>
              )}
              {rv.status === "hidden" && (
                <button className={styles.btnSm} onClick={() => setStatus(rv.id, "approved")}>Show</button>
              )}
              <button className={`${styles.btnSm} ${styles.btnSmDanger}`} onClick={() => remove(rv.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
