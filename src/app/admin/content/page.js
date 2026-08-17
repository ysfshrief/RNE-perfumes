"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import styles from "../admin.module.css";
import c from "./content.module.css";

export default function AdminContent() {
  const { t } = useLang();
  const [saved, setSaved] = useState(false);

  const SECTIONS = [
    { key: "hero", title: t("home.heroEyebrow"), fields: [
      { label: t("home.mostLoved"), value: t("home.standardTitle") },
    ]},
    { key: "about", title: t("about.title"), fields: [
      { label: t("about.h2a"), value: t("about.p1"), textarea: true },
    ]},
    { key: "banners", title: t("footer.offers"), fields: [
      { label: t("admin.content"), value: "Free delivery on orders over 1,500 EGP" },
    ]},
  ];

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t("admin.contentTitle")}</h1>
        <p className={styles.pageSub}>{t("admin.contentSub")}</p>
      </div>

      <div className={c.grid}>
        {SECTIONS.map((s) => (
          <div key={s.key} className={styles.card}>
            <h3 className={c.secTitle}>{s.title}</h3>
            {s.fields.map((f, i) => (
              <div key={i} className={c.field}>
                <label>{f.label}</label>
                {f.textarea ? <textarea defaultValue={f.value} rows={3} /> : <input defaultValue={f.value} />}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className={c.saveBar}>
        <button className={`${styles.btnSm} ${styles.btnSmSolid}`} style={{ padding: "0.7rem 1.6rem" }}
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
          {saved ? t("admin.saved") : t("admin.saveChanges")}
        </button>
      </div>
    </>
  );
}
