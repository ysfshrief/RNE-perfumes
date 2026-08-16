"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import styles from "./contact.module.css";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <PageShell
      eyebrow="Get in Touch"
      title="Contact us"
      lead="Questions about a fragrance, an order, or a recommendation? We're here to help."
    >
      <div className={styles.layout}>
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <h3>WhatsApp</h3>
            <p>Fastest way to reach us — tap the green button on any page.</p>
          </div>
          <div className={styles.infoItem}>
            <h3>Email</h3>
            <p>hello@rneperfumes.com</p>
          </div>
          <div className={styles.infoItem}>
            <h3>Hours</h3>
            <p>Saturday–Thursday, 10am–8pm</p>
          </div>
        </div>

        <div className={styles.formWrap}>
          {sent ? (
            <div className={styles.sent}>
              <div className={styles.sentMark}>✓</div>
              <h3>Message sent</h3>
              <p>Thanks — we&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={submit} className={styles.form}>
              <div className={styles.field}>
                <label>Name</label>
                <input required value={form.name} onChange={set("name")} />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input type="email" required value={form.email} onChange={set("email")} />
              </div>
              <div className={styles.field}>
                <label>Message</label>
                <textarea rows={5} required value={form.message} onChange={set("message")} />
              </div>
              <button className="btn btn--solid btn--full" type="submit">Send message</button>
            </form>
          )}
        </div>
      </div>
    </PageShell>
  );
}
