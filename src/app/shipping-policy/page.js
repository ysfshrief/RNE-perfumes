"use client";

import PageShell from "@/components/PageShell";
import { useLang } from "@/context/LangContext";
import { shippingPolicy } from "@/data/content";

export default function ShippingPolicyPage() {
  const { t, lang } = useLang();
  const items = shippingPolicy[lang] || shippingPolicy.en;
  return (
    <PageShell eyebrow={t("policy.policies")} title={t("shipping.title")}>
      {items.map((s, i) => (
        <div key={i}>
          <h2>{s.h}</h2>
          <p>{s.p}</p>
        </div>
      ))}
    </PageShell>
  );
}
