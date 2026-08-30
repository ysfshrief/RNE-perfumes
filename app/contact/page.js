"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { useLang } from "@/context/LangContext";
import { socials, contact } from "@/data/brand";
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
            <p className="keep-latin">{contact.email}</p>
          </div>
          <div className={styles.infoItem}>
            <h3>{t("contact.hours")}</h3>
            <p>{t("contact.hoursText")}</p>
          </div>

          {/* Social shortcuts — open the actual pages */}
          <div className={styles.socialItem}>
            <h3>{t("contact.followUs")}</h3>
            <div className={styles.socialRow}>
              {socials.map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label={s.label}>
                  {s.id === "facebook" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>
                  )}
                  {s.id === "instagram" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                  )}
                  {s.id === "whatsapp" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.5 14.1c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.5-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2.1.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.1.1.3 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.5.1.3.6 1 1.3 1.6.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.7.8c.2.1.4.2.5.3.1.2.1.7-.1 1.3z"/></svg>
                  )}
                  <span>{s.label}</span>
                </a>
              ))}
            </div>
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
