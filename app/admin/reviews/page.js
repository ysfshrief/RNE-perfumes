"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import styles from "../admin.module.css";
import r from "./reviews.module.css";

const SEED = [];

export default function AdminReviews() {
  const { t } = useLang();
  const [reviews, setReviews] = useState(SEED);
  const STATUS_STYLE = {
    pending: { bg: "#f6ecd8", c: "var(--amber-deep)", label: t("admin.pending") },
    approved: { bg: "#e4efe4", c: "var(--success)", label: t("admin.approved") },
    hidden: { bg: "#eceae4", c: "var(--olive)", label: t("admin.hidden") },
  };

  const setStatus = (id, status) => setReviews((list) => list.map((rv) => (rv.id === id ? { ...rv, status } : rv)));
  const remove = (id) => setReviews((list) => list.filter((rv) => rv.id !== id));

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t("admin.reviews")}</h1>
        <p className={styles.pageSub}>{t("admin.reviewsNote")}</p>
      </div>
      <div className={r.list}>
        {reviews.map((rv) => (
          <div key={rv.id} className={styles.card}>
            <div className={r.top}>
              <div>
                <strong className={`${r.product} keep-latin`}>{rv.product}</strong>
                <span className={`${r.meta} keep-latin`}>{rv.name} · {rv.date}</span>
              </div>
              <span className={styles.pill} style={{ background: STATUS_STYLE[rv.status].bg, color: STATUS_STYLE[rv.status].c }}>
                {STATUS_STYLE[rv.status].label}
              </span>
            </div>
            <div className="stars" style={{ margin: "0.4rem 0" }}>{"★".repeat(rv.rating)}{"☆".repeat(5 - rv.rating)}</div>
            <p className={r.text}>{rv.text}</p>
            <div className={r.actions}>
              {rv.status !== "approved" && (
                <button className={`${styles.btnSm} ${styles.btnSmSolid}`} onClick={() => setStatus(rv.id, "approved")}>{t("admin.approve")}</button>
              )}
              {rv.status === "approved" && <button className={styles.btnSm} onClick={() => setStatus(rv.id, "hidden")}>{t("admin.hide")}</button>}
              {rv.status === "hidden" && <button className={styles.btnSm} onClick={() => setStatus(rv.id, "approved")}>{t("admin.show")}</button>}
              <button className={`${styles.btnSm} ${styles.btnSmDanger}`} onClick={() => remove(rv.id)}>{t("admin.delete")}</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
