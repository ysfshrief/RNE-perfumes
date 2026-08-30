"use client";

import Link from "next/link";
import PageShell from "@/components/PageShell";
import { useLang } from "@/context/LangContext";

export default function AboutPage() {
  const { t } = useLang();
  return (
    <PageShell eyebrow={t("about.eyebrow")} title={t("about.title")} lead={t("about.lead")}>
      <p>{t("about.p1")}</p>
      <h2>{t("about.h2a")}</h2>
      <p>{t("about.p2")}</p>
      <h2>{t("about.h2b")}</h2>
      <p>{t("about.p3")}</p>
    </PageShell>
  );
}
