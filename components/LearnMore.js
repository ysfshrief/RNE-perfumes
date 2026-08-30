"use client";

import { useLang } from "@/context/LangContext";
import { contact } from "@/data/brand";
import styles from "./LearnMore.module.css";

// "Contact us for details" — opens WhatsApp chat.
export default function LearnMore({ product }) {
  const { t, lang } = useLang();

  const msg =
    lang === "ar"
      ? `مرحبًا RNE Perfumes، أريد تفاصيل أكثر${product ? ` عن ${product.name}` : ""}.`
      : `Hi RNE Perfumes, I'd like more details${product ? ` about ${product.name}` : ""}.`;

  return (
    <a
      className={styles.learn}
      href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(msg)}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={styles.icon} aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.5-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.3 7.3 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3.2-.4a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.4-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1c0 1.2.9 2.4 1 2.6a9.5 9.5 0 0 0 3.7 3.3c1.4.6 1.9.6 2.6.5a2.4 2.4 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.4-.3z" />
        </svg>
      </span>
      {t("product.contactDetails")}
    </a>
  );
}
