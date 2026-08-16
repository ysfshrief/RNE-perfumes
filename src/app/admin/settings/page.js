"use client";

import { useState } from "react";
import styles from "../admin.module.css";
import s from "./settings.module.css";

const PAYMENTS = [
  { id: "cod", label: "Cash on Delivery", on: true },
  { id: "card", label: "Visa / Mastercard", on: true },
  { id: "instapay", label: "InstaPay", on: true },
  { id: "vodafone", label: "Vodafone Cash", on: true },
  { id: "orange", label: "Orange Cash", on: false },
  { id: "etisalat", label: "Etisalat Cash", on: false },
];

export default function AdminSettings() {
  const [payments, setPayments] = useState(PAYMENTS);
  const [saved, setSaved] = useState(false);

  const toggle = (id) =>
    setPayments((list) => list.map((p) => (p.id === id ? { ...p, on: !p.on } : p)));

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Settings</h1>
        <p className={styles.pageSub}>Payment methods, integrations, and store configuration.</p>
      </div>

      <div className={s.grid}>
        <div className={styles.card}>
          <h3 className={s.secTitle}>Payment methods</h3>
          <p className={s.secNote}>Enable the methods customers can use at checkout.</p>
          <div className={s.toggles}>
            {payments.map((p) => (
              <label key={p.id} className={s.toggle}>
                <span>{p.label}</span>
                <button
                  className={`${s.switch} ${p.on ? s.switchOn : ""}`}
                  onClick={() => toggle(p.id)}
                  role="switch"
                  aria-checked={p.on}
                >
                  <span className={s.knob} />
                </button>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={s.secTitle}>Payment gateway</h3>
          <p className={s.secNote}>Connect your gateway once details are confirmed.</p>
          <div className={s.field}>
            <label>Gateway provider</label>
            <select defaultValue="">
              <option value="">Not configured</option>
              <option>Paymob</option>
              <option>Fawry</option>
              <option>Kashier</option>
              <option>Other</option>
            </select>
          </div>
          <div className={s.field}>
            <label>API key</label>
            <input placeholder="Enter when available" type="password" />
          </div>
          <p className={s.hint}>Leave blank until your gateway is set up.</p>
        </div>

        <div className={styles.card}>
          <h3 className={s.secTitle}>Marketing integrations</h3>
          <div className={s.field}>
            <label>Meta Pixel ID</label>
            <input placeholder="e.g. 123456789012345" />
          </div>
          <div className={s.field}>
            <label>WhatsApp number</label>
            <input placeholder="201000000000" defaultValue="201000000000" />
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={s.secTitle}>Social links</h3>
          <div className={s.field}>
            <label>Instagram</label>
            <input placeholder="https://instagram.com/…" />
          </div>
          <div className={s.field}>
            <label>Facebook</label>
            <input placeholder="https://facebook.com/…" />
          </div>
          <div className={s.field}>
            <label>TikTok</label>
            <input placeholder="https://tiktok.com/@…" />
          </div>
        </div>
      </div>

      <div className={s.saveBar}>
        <button
          className={`${styles.btnSm} ${styles.btnSmSolid}`}
          style={{ padding: "0.7rem 1.6rem" }}
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
        >
          {saved ? "Saved ✓" : "Save settings"}
        </button>
      </div>
    </>
  );
}
