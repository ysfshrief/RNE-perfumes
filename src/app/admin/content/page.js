"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/context/LangContext";
import { getContentSections, SECTION_LABELS } from "@/data/contentSections";
import adminStyles from "../admin.module.css";
import styles from "./content.module.css";

export default function AdminContent() {
  const { lang, getText, getDefaultText, setOverride, overrides, resetOverrides } = useLang();
  const [editLang, setEditLang] = useState("ar"); // which language we're editing
  const [query, setQuery] = useState("");
  const [openSection, setOpenSection] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const sections = useMemo(() => getContentSections(), []);
  const uiLang = lang; // dashboard UI language

  const sectionLabel = (prefix) =>
    SECTION_LABELS[prefix]?.[uiLang] || SECTION_LABELS[prefix]?.en || prefix;

  // count how many overrides exist per language
  const overrideCount = (overrides?.[editLang] && Object.keys(overrides[editLang]).length) || 0;

  // Filter keys by search query (matches key, default text, or current text)
  const q = query.trim().toLowerCase();
  const filteredSections = sections
    .map((sec) => {
      if (!q) return sec;
      const keys = sec.keys.filter((k) => {
        const cur = getText(k, editLang).toLowerCase();
        const def = getDefaultText(k, editLang).toLowerCase();
        return k.toLowerCase().includes(q) || cur.includes(q) || def.includes(q) || sectionLabel(sec.prefix).toLowerCase().includes(q);
      });
      return { ...sec, keys };
    })
    .filter((sec) => sec.keys.length > 0);

  const handleChange = (key, value) => {
    setOverride(key, value, editLang);
    setSavedFlash(true);
    clearTimeout(window.__rneSaveT);
    window.__rneSaveT = setTimeout(() => setSavedFlash(false), 1200);
  };

  const isEdited = (key) =>
    overrides?.[editLang] && Object.prototype.hasOwnProperty.call(overrides[editLang], key);

  return (
    <>
      <div className={styles.head}>
        <div>
          <h1 className={adminStyles.pageTitle}>{uiLang === "ar" ? "محتوى الموقع" : "Website Content"}</h1>
          <p className={adminStyles.pageSub}>
            {uiLang === "ar"
              ? "عدّل أي نص في الموقع — بالعربي والإنجليزي. التغييرات تُحفظ فورًا."
              : "Edit any text on the site — in Arabic and English. Changes save instantly."}
          </p>
        </div>
        {savedFlash && <span className={styles.savedFlash}>{uiLang === "ar" ? "تم الحفظ ✓" : "Saved ✓"}</span>}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.langTabs}>
          <button
            className={`${styles.langTab} ${editLang === "ar" ? styles.langTabOn : ""}`}
            onClick={() => setEditLang("ar")}
          >
            🇪🇬 العربية
          </button>
          <button
            className={`${styles.langTab} ${editLang === "en" ? styles.langTabOn : ""}`}
            onClick={() => setEditLang("en")}
          >
            🇬🇧 English
          </button>
        </div>

        <input
          className={styles.search}
          placeholder={uiLang === "ar" ? "ابحث عن نص أو قسم…" : "Search text or section…"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {overrideCount > 0 && (
        <div className={styles.overrideBar}>
          <span>
            {uiLang === "ar"
              ? `${overrideCount} نص مُعدّل في ${editLang === "ar" ? "العربية" : "الإنجليزية"}`
              : `${overrideCount} edited text${overrideCount > 1 ? "s" : ""} in ${editLang === "ar" ? "Arabic" : "English"}`}
          </span>
          <button
            className={styles.resetBtn}
            onClick={() => {
              if (confirm(uiLang === "ar" ? "استرجاع كل النصوص للأصل؟" : "Reset all texts to default?")) {
                resetOverrides();
              }
            }}
          >
            {uiLang === "ar" ? "استرجاع الكل" : "Reset all"}
          </button>
        </div>
      )}

      {/* Sections */}
      <div className={styles.sections}>
        {filteredSections.length === 0 && (
          <p className={styles.empty}>{uiLang === "ar" ? "لا نتائج." : "No results."}</p>
        )}
        {filteredSections.map((sec) => {
          const isOpen = q ? true : openSection === sec.prefix;
          const editedInSection = sec.keys.filter((k) => isEdited(k)).length;
          return (
            <div key={sec.prefix} className={styles.section}>
              <button
                className={styles.sectionHead}
                onClick={() => setOpenSection(isOpen && !q ? null : sec.prefix)}
              >
                <span className={styles.sectionName}>
                  {sectionLabel(sec.prefix)}
                  <span className={styles.sectionCount}>{sec.keys.length}</span>
                  {editedInSection > 0 && <span className={styles.editedDot} title="edited" />}
                </span>
                <span className={styles.chevron}>{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && (
                <div className={styles.fields}>
                  {sec.keys.map((key) => {
                    const val = getText(key, editLang);
                    const def = getDefaultText(key, editLang);
                    const long = (val || def).length > 60;
                    return (
                      <div key={key} className={styles.field}>
                        <label className={styles.fieldLabel}>
                          <span className={styles.keyName}>{key}</span>
                          {isEdited(key) && (
                            <button
                              className={styles.revert}
                              onClick={() => handleChange(key, def)}
                              title={uiLang === "ar" ? "استرجاع" : "Revert"}
                            >
                              ↺ {uiLang === "ar" ? "استرجاع" : "revert"}
                            </button>
                          )}
                        </label>
                        {long ? (
                          <textarea
                            className={`${styles.input} ${isEdited(key) ? styles.inputEdited : ""}`}
                            value={val}
                            dir={editLang === "ar" ? "rtl" : "ltr"}
                            rows={3}
                            onChange={(e) => handleChange(key, e.target.value)}
                          />
                        ) : (
                          <input
                            className={`${styles.input} ${isEdited(key) ? styles.inputEdited : ""}`}
                            value={val}
                            dir={editLang === "ar" ? "rtl" : "ltr"}
                            onChange={(e) => handleChange(key, e.target.value)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
