"use client";

import styles from "../admin.module.css";

const CUSTOMERS = [
  { name: "Dina Fouad", email: "dina.f@email.com", gov: "Cairo", orders: 3, spent: "2,510 EGP" },
  { name: "Sara Adel", email: "sara.adel@email.com", gov: "Giza", orders: 5, spent: "4,180 EGP" },
  { name: "Karim Hany", email: "karim.h@email.com", gov: "Alexandria", orders: 2, spent: "1,600 EGP" },
  { name: "Omar Salah", email: "omar.s@email.com", gov: "Beheira", orders: 1, spent: "650 EGP" },
  { name: "Nada Mostafa", email: "nada.m@email.com", gov: "Dakahlia", orders: 4, spent: "3,320 EGP" },
];

export default function AdminCustomers() {
  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Customers</h1>
        <p className={styles.pageSub}>{CUSTOMERS.length} registered customers</p>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Governorate</th>
              <th>Orders</th>
              <th>Total spent</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.map((c) => (
              <tr key={c.email}>
                <td><strong>{c.name}</strong></td>
                <td>{c.email}</td>
                <td>{c.gov}</td>
                <td>{c.orders}</td>
                <td>{c.spent}</td>
                <td><button className={styles.btnSm}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
