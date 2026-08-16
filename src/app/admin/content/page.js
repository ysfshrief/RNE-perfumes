"use client";

import { useState } from "react";
import styles from "../admin.module.css";
import c from "./content.module.css";

const SECTIONS = [
  { key: "hero", title: "Homepage hero", fields: [
    { label: "Headline", value: "Scent, engineered into signature." },
    { label: "Subtext", value: "Premium compositions built note by note." },
  ]},
  { key: "about", title: "About Us", fields: [
    { label: "Story", value: "RNE Perfumes creates premium eau de parfum compositions…", textarea: true },
  ]},
  { key: "banners", title: "Promotional banner", fields: [
    { label: "Banner text", value: "Free delivery on orders over 1,500 EGP" },
  ]},
];

export default function AdminContent() {
  const [saved, setSaved] = useState(false);

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Website content</h1>
        <p className={styles.pageSub}>Edit homepage sections, banners, and page copy — no code needed.</p>
      </div>

      <div className={c.grid}>
        {SECTIONS.map((s) => (
          <div key={s.key} className={styles.card}>
            <h3 className={c.secTitle}>{s.title}</h3>
            {s.fields.map((f, i) => (
              <div key={i} className={c.field}>
                <label>{f.label}</label>
                {f.textarea ? (
                  <textarea defaultValue={f.value} rows={3} />
                ) : (
                  <input defaultValue={f.value} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className={c.saveBar}>
        <button
          className={`${styles.btnSm} ${styles.btnSmSolid}`}
          style={{ padding: "0.7rem 1.6rem" }}
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
        >
          {saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>
    </>
  );
}
