"use client";

import { useLang } from "@/context/LangContext";
import styles from "./WhatsApp.module.css";

// Placeholder number — configurable from Admin Dashboard in production.
const PHONE = "201000000000";

export default function WhatsApp() {
  const { t } = useLang();
  return (
    <a
      className={styles.wa}
      href={`https://wa.me/${PHONE}?text=${encodeURIComponent(t("whatsapp.msg"))}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.5-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.3 7.3 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3.2-.4a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.4-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1c0 1.2.9 2.4 1 2.6a9.5 9.5 0 0 0 3.7 3.3c1.4.6 1.9.6 2.6.5a2.4 2.4 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.4-.3z" />
      </svg>
    </a>
  );
}
