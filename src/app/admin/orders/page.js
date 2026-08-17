"use client";

import { Fragment, useState } from "react";
import { useLang } from "@/context/LangContext";
import styles from "../admin.module.css";
import o from "./orders.module.css";

const FLOW = ["New", "Confirmed", "Preparing", "OutForDelivery", "Delivered"];
const EXTRA = ["Cancelled", "Returned"];

const STATUS_STYLE = {
  New: { bg: "#eceae4", c: "var(--olive)" },
  Confirmed: { bg: "#f6ecd8", c: "var(--amber-deep)" },
  Preparing: { bg: "#f6ecd8", c: "var(--amber-deep)" },
  OutForDelivery: { bg: "#e0e8ee", c: "#3d5a6b" },
  Delivered: { bg: "#e4efe4", c: "var(--success)" },
  Cancelled: { bg: "#f7e7e4", c: "var(--danger)" },
  Returned: { bg: "#f7e7e4", c: "var(--danger)" },
};

const SEED = [
  { id: "RNE-2533", customer: "Dina Fouad", phone: "0100 111 2222", gov: "Cairo", date: "2026-08-16", total: 780, status: "Confirmed", items: [{ n: "Ambre Royal", s: "30ml", q: 1 }] },
  { id: "RNE-2510", customer: "Sara Adel", phone: "0101 333 4444", gov: "Giza", date: "2026-08-14", total: 1400, status: "OutForDelivery", items: [{ n: "Rose de Nuit", s: "30ml", q: 2 }] },
  { id: "RNE-2508", customer: "Karim Hany", phone: "0102 555 6666", gov: "Alexandria", date: "2026-08-14", total: 950, status: "New", items: [{ n: "Noir Absolu", s: "50ml", q: 1 }] },
  { id: "RNE-2481", customer: "Omar Salah", phone: "0106 777 8888", gov: "Beheira", date: "2026-08-10", total: 650, status: "Delivered", items: [{ n: "Noir Absolu", s: "30ml", q: 1 }] },
];

export default function AdminOrders() {
  const { t } = useLang();
  const cur = t("common.currency");
  const [orders, setOrders] = useState(SEED);
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const setStatus = (id, status) =>
    setOrders((list) => list.map((ord) => (ord.id === id ? { ...ord, status } : ord)));
  const shown = filter === "All" ? orders : orders.filter((ord) => ord.status === filter);

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t("admin.orders")}</h1>
        <p className={styles.pageSub}>{t("admin.stockRule")}</p>
      </div>

      <div className={o.filters}>
        {["All", ...FLOW, ...EXTRA].map((f) => (
          <button
            key={f}
            className={`${o.filterBtn} ${filter === f ? o.filterOn : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "All" ? t("admin.all") : t(`status.${f}`)}
          </button>
        ))}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t("admin.colOrder")}</th>
              <th>{t("admin.colCustomer")}</th>
              <th>{t("admin.colGov")}</th>
              <th>{t("admin.colDate")}</th>
              <th>{t("admin.colTotal")}</th>
              <th>{t("admin.colStatus")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((ord) => (
              <Fragment key={ord.id}>
                <tr>
                  <td><strong className="keep-latin">{ord.id}</strong></td>
                  <td>{ord.customer}</td>
                  <td>{ord.gov}</td>
                  <td>{ord.date}</td>
                  <td>{ord.total} {cur}</td>
                  <td>
                    <span className={styles.pill} style={{ background: STATUS_STYLE[ord.status].bg, color: STATUS_STYLE[ord.status].c }}>
                      {t(`status.${ord.status}`)}
                    </span>
                  </td>
                  <td>
                    <button className={styles.btnSm} onClick={() => setExpanded(expanded === ord.id ? null : ord.id)}>
                      {expanded === ord.id ? t("admin.close") : t("admin.manageBtn")}
                    </button>
                  </td>
                </tr>
                {expanded === ord.id && (
                  <tr>
                    <td colSpan={7} className={o.expandCell}>
                      <div className={o.expand}>
                        <div>
                          <h4>{t("admin.contact")}</h4>
                          <p>{ord.customer} · {ord.phone}</p>
                          <h4>{t("admin.items")}</h4>
                          {ord.items.map((it, i) => (
                            <p key={i} className="keep-latin">{it.n} · {it.s} × {it.q}</p>
                          ))}
                        </div>
                        <div>
                          <h4>{t("admin.updateStatus")}</h4>
                          <div className={o.statusBtns}>
                            {[...FLOW, ...EXTRA].map((s) => (
                              <button
                                key={s}
                                className={`${o.statusBtn} ${ord.status === s ? o.statusBtnOn : ""}`}
                                onClick={() => setStatus(ord.id, s)}
                              >
                                {t(`status.${s}`)}
                              </button>
                            ))}
                          </div>
                          {ord.status === "New" && <p className={o.hint}>{t("admin.confirmHint")}</p>}
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
