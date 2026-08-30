"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";

export default function NotFound() {
  const { t } = useLang();
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "1.2rem",
        padding: "4rem var(--gutter)",
      }}
    >
      <p className="eyebrow">{t("notfound.eyebrow")}</p>
      <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}>{t("notfound.title")}</h1>
      <p style={{ color: "var(--olive)", maxWidth: "42ch" }}>{t("notfound.text")}</p>
      <Link href="/" className="btn btn--solid">{t("notfound.back")}</Link>
    </div>
  );
}
