"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/context/LangContext";
import { subscribeCollection } from "@/lib/store";
import styles from "../admin.module.css";

export default function AdminCustomers() {
  const { t } = useLang();
  const cur = t("common.currency");
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const u1 = subscribeCollection("customers", setCustomers);
    const u2 = subscribeCollection("orders", setOrders);
    return () => { u1(); u2(); };
  }, []);

  // De-duplicate customers by email, compute orders + spend from orders
  const map = {};
  customers.forEach((c) => { if (c.email) map[c.email] = { ...c }; });
  orders.forEach((o) => {
    const email = o.customer?.email;
    if (!email) return;
    if (!map[email]) map[email] = { name: o.customer?.name, email, governorate: o.customer?.governorate };
    map[email].orders = (map[email].orders || 0) + 1;
    map[email].spent = (map[email].spent || 0) + (o.total || 0);
  });
  const list = Object.values(map);

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t("admin.customers")}</h1>
        <p className={styles.pageSub}>{t("admin.registeredCustomers", { n: list.length })}</p>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t("contact.name")}</th>
              <th>{t("admin.colEmail")}</th>
              <th>{t("admin.colGov")}</th>
              <th>{t("admin.ordersStat")}</th>
              <th>{t("admin.colSpent")}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.email}>
                <td><strong className="keep-latin">{c.name}</strong></td>
                <td className="keep-latin">{c.email}</td>
                <td>{c.governorate || c.gov || "—"}</td>
                <td>{c.orders || 0}</td>
                <td>{(c.spent || 0).toLocaleString()} {cur}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <p style={{ padding: "2rem", textAlign: "center", color: "var(--olive)" }}>
            {t("admin.noCustomers")}
          </p>
        )}
      </div>
    </>
  );
}
