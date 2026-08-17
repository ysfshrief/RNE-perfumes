"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { useLang } from "@/context/LangContext";
import styles from "./contact.module.css";

export default function ContactPage() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <PageShell eyebrow={t("contact.eyebrow")} title={t("contact.title")} lead={t("contact.lead")}>
      <div className={styles.layout}>
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <h3>{t("contact.whatsapp")}</h3>
            <p>{t("contact.whatsappText")}</p>
          </div>
          <div className={styles.infoItem}>
            <h3>{t("contact.emailLabel")}</h3>
            <p>hello@rneperfumes.com</p>
          </div>
          <div className={styles.infoItem}>
            <h3>{t("contact.hours")}</h3>
            <p>{t("contact.hoursText")}</p>
          </div>
        </div>

        <div className={styles.formWrap}>
          {sent ? (
            <div className={styles.sent}>
              <div className={styles.sentMark}>✓</div>
              <h3>{t("contact.sent")}</h3>
              <p>{t("contact.sentText")}</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className={styles.form}>
              <div className={styles.field}>
                <label>{t("contact.name")}</label>
                <input required value={form.name} onChange={set("name")} />
              </div>
              <div className={styles.field}>
                <label>{t("contact.emailLabel")}</label>
                <input type="email" required value={form.email} onChange={set("email")} />
              </div>
              <div className={styles.field}>
                <label>{t("contact.message")}</label>
                <textarea rows={5} required value={form.message} onChange={set("message")} />
              </div>
              <button className="btn btn--solid btn--full" type="submit">{t("contact.send")}</button>
            </form>
          )}
        </div>
      </div>
    </PageShell>
  );
}
