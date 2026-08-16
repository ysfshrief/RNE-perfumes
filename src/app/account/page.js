"use client";

import { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import styles from "./account.module.css";

// Mock past orders
const MOCK_ORDERS = [
  {
    id: "RNE-2481", date: "2026-08-10", status: "Delivered", total: 950,
    items: [{ name: "Noir Absolu", size: "50ml", qty: 1 }],
  },
  {
    id: "RNE-2510", date: "2026-08-14", status: "Out for Delivery", total: 1400,
    items: [{ name: "Rose de Nuit", size: "30ml", qty: 2 }],
  },
  {
    id: "RNE-2533", date: "2026-08-16", status: "Confirmed", total: 780,
    items: [{ name: "Ambre Royal", size: "30ml", qty: 1 }],
  },
];

const STATUS_COLORS = {
  New: "var(--olive)", Confirmed: "var(--amber-deep)", Preparing: "var(--amber-deep)",
  "Out for Delivery": "#3d5a6b", Delivered: "var(--success)",
  Cancelled: "var(--danger)", Returned: "var(--danger)",
};

const TABS = ["Orders", "Profile", "Addresses"];

export default function AccountPage() {
  const { state, dispatch } = useShop();
  const [tab, setTab] = useState("Orders");

  if (!state.user) {
    return (
      <div className={`container ${styles.guest}`}>
        <h1>Sign in to your account</h1>
        <p>Access your orders, addresses, and wishlist.</p>
        <div className={styles.guestActions}>
          <Link href="/login" className="btn btn--solid">Sign in</Link>
          <Link href="/register" className="btn btn--ghost">Create account</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.head}>
        <div>
          <p className="eyebrow">My Account</p>
          <h1 className={styles.title}>Hello, {state.user.name}</h1>
        </div>
        <button className="btn btn--ghost" onClick={() => dispatch({ type: "LOGOUT" })}>
          Sign out
        </button>
      </div>

      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabOn : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
        <Link href="/wishlist" className={styles.tab}>Wishlist</Link>
      </div>

      <div className={styles.panel}>
        {tab === "Orders" && (
          <div className={styles.orders}>
            {MOCK_ORDERS.map((o) => (
              <div key={o.id} className={styles.order}>
                <div className={styles.orderTop}>
                  <div>
                    <strong>{o.id}</strong>
                    <span className={styles.orderDate}>{o.date}</span>
                  </div>
                  <span className={styles.status} style={{ color: STATUS_COLORS[o.status] }}>
                    ● {o.status}
                  </span>
                </div>
                <div className={styles.orderItems}>
                  {o.items.map((it, i) => (
                    <span key={i}>{it.name} · {it.size} × {it.qty}</span>
                  ))}
                </div>
                <div className={styles.orderFoot}>
                  <span className={styles.orderTotal}>{o.total} EGP</span>
                  <button className={styles.orderBtn}>View details</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Profile" && (
          <div className={styles.profile}>
            <Row label="Full name" value={state.user.name} />
            <Row label="Email" value={state.user.email} />
            <Row label="Phone" value={state.user.phone || "Not set"} />
            <button className="btn btn--ghost">Edit profile</button>
          </div>
        )}

        {tab === "Addresses" && (
          <div className={styles.addresses}>
            {state.user.address ? (
              <div className={styles.address}>
                <strong>Default address</strong>
                <p>
                  {state.user.address}, {state.user.city}, {state.user.governorate}
                </p>
              </div>
            ) : (
              <p className={styles.noneYet}>No saved addresses yet.</p>
            )}
            <button className="btn btn--ghost">Add address</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  );
}
