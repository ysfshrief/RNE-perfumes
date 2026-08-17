"use client";

import PageShell from "@/components/PageShell";
import { useLang } from "@/context/LangContext";
import { returnPolicy } from "@/data/content";

export default function ReturnPolicyPage() {
  const { t, lang } = useLang();
  const items = returnPolicy[lang] || returnPolicy.en;
  return (
    <PageShell eyebrow={t("policy.policies")} title={t("return.title")}>
      {items.map((s, i) => (
        <div key={i}>
          <h2>{s.h}</h2>
          <p>{s.p}</p>
        </div>
      ))}
    </PageShell>
  );
}
