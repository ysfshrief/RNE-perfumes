"use client";

import { useConfig } from "@/context/ConfigContext";
import { useLang } from "@/context/LangContext";
import styles from "./LearnMore.module.css";

export default function LearnMore() {
  const { config } = useConfig();
  const { t } = useLang();
  const lm = config.learnMore;

  if (!lm?.enabled || !lm.url) return null;

  return (
    <a
      className={styles.learn}
      href={lm.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={styles.icon} aria-hidden="true">
        {lm.type === "youtube" ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 15l5.2-3L10 9v6zm12-3c0 2.2-.2 3.8-.5 4.7-.3 1-.9 1.6-1.9 1.9-.9.2-3.1.4-6.6.4s-5.7-.2-6.6-.4c-1-.3-1.6-.9-1.9-1.9C4.2 15.8 4 14.2 4 12s.2-3.8.5-4.7c.3-1 .9-1.6 1.9-1.9C7.3 5.2 9.5 5 13 5s5.7.2 6.6.4c1 .3 1.6.9 1.9 1.9.3.9.5 2.5.5 4.7z"/></svg>
        ) : lm.type === "drive" ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 3l6 10H8L2 13 8 3zm2 11h12l-3 5H7l3-5zm5.5-1L9.5 3H16l6 10h-6.5z"/></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>
        )}
      </span>
      {t("product.learnMore")}
    </a>
  );
}
