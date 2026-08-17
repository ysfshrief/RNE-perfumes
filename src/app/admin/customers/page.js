"use client";

import { useLang } from "@/context/LangContext";
import styles from "../admin.module.css";

const CUSTOMERS = [
  { name: "Dina Fouad", email: "dina.f@email.com", gov: "Cairo", orders: 3, spent: 2510 },
  { name: "Sara Adel", email: "sara.adel@email.com", gov: "Giza", orders: 5, spent: 4180 },
  { name: "Karim Hany", email: "karim.h@email.com", gov: "Alexandria", orders: 2, spent: 1600 },
  { name: "Omar Salah", email: "omar.s@email.com", gov: "Beheira", orders: 1, spent: 650 },
  { name: "Nada Mostafa", email: "nada.m@email.com", gov: "Dakahlia", orders: 4, spent: 3320 },
];

export default function AdminCustomers() {
  const { t } = useLang();
  const cur = t("common.currency");
  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t("admin.customers")}</h1>
        <p className={styles.pageSub}>{t("admin.registeredCustomers", { n: CUSTOMERS.length })}</p>
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.map((c) => (
              <tr key={c.email}>
                <td><strong className="keep-latin">{c.name}</strong></td>
                <td className="keep-latin">{c.email}</td>
                <td>{c.gov}</td>
                <td>{c.orders}</td>
                <td>{c.spent.toLocaleString()} {cur}</td>
                <td><button className={styles.btnSm}>{t("admin.view")}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
