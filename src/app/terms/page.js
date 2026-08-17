"use client";

import PageShell from "@/components/PageShell";
import { useLang } from "@/context/LangContext";
import { terms } from "@/data/content";

export default function TermsPage() {
  const { t, lang } = useLang();
  const items = terms[lang] || terms.en;
  return (
    <PageShell eyebrow={t("policy.legal")} title={t("terms.title")}>
      {items.map((s, i) => (
        <div key={i}>
          {s.h && <h2>{s.h}</h2>}
          <p>{s.p}</p>
        </div>
      ))}
    </PageShell>
  );
}
