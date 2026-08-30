"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { useLang } from "@/context/LangContext";
import { faqs } from "@/data/content";
import styles from "./faq.module.css";

export default function FAQPage() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(0);
  const items = faqs[lang] || faqs.en;

  return (
    <PageShell eyebrow={t("faq.eyebrow")} title={t("faq.title")}>
      <div className={styles.list}>
        {items.map((f, i) => (
          <div key={i} className={`${styles.item} ${open === i ? styles.itemOpen : ""}`}>
            <button className={styles.q} onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              <span>{f.q}</span>
              <span className={styles.icon}>{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <p className={styles.a}>{f.a}</p>}
          </div>
        ))}
      </div>
    </PageShell>
  );
}
