"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import styles from "../admin.module.css";
import s from "./settings.module.css";

export default function AdminSettings() {
  const { t } = useLang();
  const [saved, setSaved] = useState(false);
  const [payments, setPayments] = useState([
    { id: "cod", label: t("pay.cod"), on: true },
    { id: "card", label: t("pay.card"), on: true },
    { id: "instapay", label: t("pay.instapay"), on: true },
    { id: "vodafone", label: t("pay.vodafone"), on: true },
    { id: "orange", label: t("pay.orange"), on: false },
    { id: "etisalat", label: t("pay.etisalat"), on: false },
  ]);

  const toggle = (id) => setPayments((list) => list.map((p) => (p.id === id ? { ...p, on: !p.on } : p)));

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t("admin.settings")}</h1>
        <p className={styles.pageSub}>{t("admin.settingsSub")}</p>
      </div>

      <div className={s.grid}>
        <div className={styles.card}>
          <h3 className={s.secTitle}>{t("admin.paymentMethods")}</h3>
          <p className={s.secNote}>{t("admin.paymentMethodsNote")}</p>
          <div className={s.toggles}>
            {payments.map((p) => (
              <label key={p.id} className={s.toggle}>
                <span>{p.label}</span>
                <button className={`${s.switch} ${p.on ? s.switchOn : ""}`} onClick={() => toggle(p.id)} role="switch" aria-checked={p.on}>
                  <span className={s.knob} />
                </button>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={s.secTitle}>{t("admin.paymentGateway")}</h3>
          <p className={s.secNote}>{t("admin.gatewayNote")}</p>
          <div className={s.field}>
            <label>{t("admin.gatewayProvider")}</label>
            <select defaultValue="">
              <option value="">{t("admin.notConfigured")}</option>
              <option>Paymob</option><option>Fawry</option><option>Kashier</option>
            </select>
          </div>
          <div className={s.field}>
            <label>{t("admin.apiKey")}</label>
            <input placeholder={t("admin.apiKeyPlaceholder")} type="password" />
          </div>
          <p className={s.hint}>{t("admin.gatewayHint")}</p>
        </div>

        <div className={styles.card}>
          <h3 className={s.secTitle}>{t("admin.marketing")}</h3>
          <div className={s.field}>
            <label>{t("admin.metaPixel")}</label>
            <input placeholder="123456789012345" />
          </div>
          <div className={s.field}>
            <label>{t("admin.whatsappNumber")}</label>
            <input placeholder="201000000000" defaultValue="201000000000" />
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={s.secTitle}>{t("admin.socialLinks")}</h3>
          <div className={s.field}><label>Instagram</label><input placeholder="https://instagram.com/…" /></div>
          <div className={s.field}><label>Facebook</label><input placeholder="https://facebook.com/…" /></div>
          <div className={s.field}><label>TikTok</label><input placeholder="https://tiktok.com/@…" /></div>
        </div>
      </div>

      <div className={s.saveBar}>
        <button className={`${styles.btnSm} ${styles.btnSmSolid}`} style={{ padding: "0.7rem 1.6rem" }}
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
          {saved ? t("admin.saved") : t("admin.saveSettings")}
        </button>
      </div>
    </>
  );
}
