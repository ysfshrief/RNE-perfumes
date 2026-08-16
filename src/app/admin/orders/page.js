"use client";

import { Fragment, useState } from "react";
import styles from "../admin.module.css";
import o from "./orders.module.css";

const FLOW = ["New", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];
const EXTRA = ["Cancelled", "Returned"];

const STATUS_STYLE = {
  New: { bg: "#eceae4", c: "var(--olive)" },
  Confirmed: { bg: "#f6ecd8", c: "var(--amber-deep)" },
  Preparing: { bg: "#f6ecd8", c: "var(--amber-deep)" },
  "Out for Delivery": { bg: "#e0e8ee", c: "#3d5a6b" },
  Delivered: { bg: "#e4efe4", c: "var(--success)" },
  Cancelled: { bg: "#f7e7e4", c: "var(--danger)" },
  Returned: { bg: "#f7e7e4", c: "var(--danger)" },
};

const SEED = [
  { id: "RNE-2533", customer: "Dina Fouad", phone: "0100 111 2222", gov: "Cairo", date: "2026-08-16", total: 780, status: "Confirmed", items: [{ n: "Ambre Royal", s: "30ml", q: 1 }] },
  { id: "RNE-2510", customer: "Sara Adel", phone: "0101 333 4444", gov: "Giza", date: "2026-08-14", total: 1400, status: "Out for Delivery", items: [{ n: "Rose de Nuit", s: "30ml", q: 2 }] },
  { id: "RNE-2508", customer: "Karim Hany", phone: "0102 555 6666", gov: "Alexandria", date: "2026-08-14", total: 950, status: "New", items: [{ n: "Noir Absolu", s: "50ml", q: 1 }] },
  { id: "RNE-2481", customer: "Omar Salah", phone: "0106 777 8888", gov: "Beheira", date: "2026-08-10", total: 650, status: "Delivered", items: [{ n: "Noir Absolu", s: "30ml", q: 1 }] },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState(SEED);
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const setStatus = (id, status) =>
    setOrders((list) => list.map((ord) => (ord.id === id ? { ...ord, status } : ord)));

  const shown = filter === "All" ? orders : orders.filter((ord) => ord.status === filter);

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Orders</h1>
        <p className={styles.pageSub}>
          Stock is deducted only when an order is moved to <strong>Confirmed</strong>.
        </p>
      </div>

      <div className={o.filters}>
        {["All", ...FLOW, ...EXTRA].map((f) => (
          <button
            key={f}
            className={`${o.filterBtn} ${filter === f ? o.filterOn : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Governorate</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((ord) => (
              <Fragment key={ord.id}>
                <tr>
                  <td><strong>{ord.id}</strong></td>
                  <td>{ord.customer}</td>
                  <td>{ord.gov}</td>
                  <td>{ord.date}</td>
                  <td>{ord.total} EGP</td>
                  <td>
                    <span className={styles.pill} style={{ background: STATUS_STYLE[ord.status].bg, color: STATUS_STYLE[ord.status].c }}>
                      {ord.status}
                    </span>
                  </td>
                  <td>
                    <button className={styles.btnSm} onClick={() => setExpanded(expanded === ord.id ? null : ord.id)}>
                      {expanded === ord.id ? "Close" : "Manage"}
                    </button>
                  </td>
                </tr>
                {expanded === ord.id && (
                  <tr>
                    <td colSpan={7} className={o.expandCell}>
                      <div className={o.expand}>
                        <div>
                          <h4>Contact</h4>
                          <p>{ord.customer} · {ord.phone}</p>
                          <h4>Items</h4>
                          {ord.items.map((it, i) => (
                            <p key={i}>{it.n} · {it.s} × {it.q}</p>
                          ))}
                        </div>
                        <div>
                          <h4>Update status</h4>
                          <div className={o.statusBtns}>
                            {[...FLOW, ...EXTRA].map((s) => (
                              <button
                                key={s}
                                className={`${o.statusBtn} ${ord.status === s ? o.statusBtnOn : ""}`}
                                onClick={() => setStatus(ord.id, s)}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                          {ord.status === "New" && (
                            <p className={o.hint}>
                              Moving to Confirmed will deduct stock for these items.
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
