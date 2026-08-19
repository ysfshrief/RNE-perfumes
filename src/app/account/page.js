"use client";

import { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import styles from "./account.module.css";

const MOCK_ORDERS = [];

const STATUS_COLORS = {
  New: "var(--olive)", Confirmed: "var(--amber-deep)", Preparing: "var(--amber-deep)",
  OutForDelivery: "#3d5a6b", Delivered: "var(--success)",
  Cancelled: "var(--danger)", Returned: "var(--danger)",
};

export default function AccountPage() {
  const { state, dispatch } = useShop();
  const { signOut } = useAuth();
  const { t } = useLang();
  const [tab, setTab] = useState("Orders");
  const cur = t("common.currency");

  const TABS = [
    { k: "Orders", label: t("account.orders") },
    { k: "Profile", label: t("account.profile") },
    { k: "Addresses", label: t("account.addresses") },
  ];

  if (!state.user) {
    return (
      <div className={`container ${styles.guest}`}>
        <h1>{t("account.signInTitle")}</h1>
        <p>{t("account.signInLead")}</p>
        <div className={styles.guestActions}>
          <Link href="/login" className="btn btn--solid">{t("auth.signIn")}</Link>
          <Link href="/register" className="btn btn--ghost">{t("auth.createAccount")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.head}>
        <div>
          <p className="eyebrow">{t("account.eyebrow")}</p>
          <h1 className={styles.title}>{t("account.hello", { name: state.user.name })}</h1>
        </div>
        <button className="btn btn--ghost" onClick={() => { signOut(); dispatch({ type: "LOGOUT" }); }}>
          {t("account.signOut")}
        </button>
      </div>

      <div className={styles.tabs}>
        {TABS.map((tb) => (
          <button
            key={tb.k}
            className={`${styles.tab} ${tab === tb.k ? styles.tabOn : ""}`}
            onClick={() => setTab(tb.k)}
          >
            {tb.label}
          </button>
        ))}
        <Link href="/wishlist" className={styles.tab}>{t("account.wishlist")}</Link>
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
                    ● {t(`status.${o.status}`)}
                  </span>
                </div>
                <div className={styles.orderItems}>
                  {o.items.map((it, i) => (
                    <span key={i}>{it.name} · {it.size} × {it.qty}</span>
                  ))}
                </div>
                <div className={styles.orderFoot}>
                  <span className={styles.orderTotal}>{o.total} {cur}</span>
                  <button className={styles.orderBtn}>{t("account.viewDetails")}</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Profile" && (
          <div className={styles.profile}>
            <Row label={t("auth.fullName")} value={state.user.name} />
            <Row label={t("auth.email")} value={state.user.email} />
            <Row label={t("auth.phone")} value={state.user.phone || t("account.notSet")} />
            <button className="btn btn--ghost">{t("account.editProfile")}</button>
          </div>
        )}

        {tab === "Addresses" && (
          <div className={styles.addresses}>
            {state.user.address ? (
              <div className={styles.address}>
                <strong>{t("account.defaultAddress")}</strong>
                <p>{state.user.address}, {state.user.city}, {state.user.governorate}</p>
              </div>
            ) : (
              <p className={styles.noneYet}>{t("account.noAddresses")}</p>
            )}
            <button className="btn btn--ghost">{t("account.addAddress")}</button>
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
