"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { useProducts } from "@/context/ProductContext";
import { isWarm, isFresh, isDay, isNight, familyKeys } from "@/data/productMeta";
import { pName } from "@/data/productLocale";
import { getMinPrice } from "@/data/products";
import ProductCard from "./ProductCard";
import { ArrowUpRight } from "./icons";
import styles from "./Discovery.module.css";

/**
 * "Find your fragrance" — a short guided consultation.
 * Every axis maps onto data the products already carry (notes, season,
 * gender), and results are real products from ProductContext. Nothing here is
 * a mock: if no product matches, we say so rather than inventing results.
 */
export default function Discovery() {
  const { t, lang } = useLang();
  const { visibleProducts } = useProducts();
  const [answers, setAnswers] = useState({ character: null, time: null, who: null });

  // All copy comes from the content/translation system so the admin can edit it.
  const QUESTIONS = [
    {
      key: "character",
      label: t("find.character"),
      options: [
        { value: "fresh", label: t("find.fresh") },
        { value: "warm", label: t("find.warm") },
      ],
    },
    {
      key: "time",
      label: t("find.when"),
      options: [
        { value: "day", label: t("find.day") },
        { value: "night", label: t("find.night") },
      ],
    },
    {
      key: "who",
      label: t("find.for"),
      options: [
        { value: "Men", label: t("find.men") },
        { value: "Women", label: t("find.women") },
        { value: "Unisex", label: t("find.unisex") },
      ],
    },
  ];

  const answered = Object.values(answers).filter(Boolean).length;

  const results = useMemo(() => {
    if (answered === 0) return [];
    const pool = visibleProducts.filter((p) => !p.isDiscoverySet);

    // Score each product against the answered axes — a soft match keeps the
    // consultation useful even when nothing satisfies every single answer.
    const scored = pool.map((p) => {
      let score = 0;
      if (answers.character === "fresh" && isFresh(p)) score += 2;
      if (answers.character === "warm" && isWarm(p)) score += 2;
      if (answers.time === "day" && isDay(p)) score += 1.5;
      if (answers.time === "night" && isNight(p)) score += 1.5;
      if (answers.who) {
        if (p.gender === answers.who) score += 2;
        else if (p.gender === "Unisex" || answers.who === "Unisex") score += 0.75;
      }
      if (p.bestSeller) score += 0.25;
      return { p, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score || getMinPrice(a.p) - getMinPrice(b.p))
      .slice(0, 3)
      .map((s) => s.p);
  }, [answers, answered, visibleProducts]);

  const reset = () => setAnswers({ character: null, time: null, who: null });

  return (
    <section className={`section ${styles.wrap}`} aria-labelledby="discovery-title">
      <div className="container">
        <div className={`glass ${styles.panel}`}>
          <div className={styles.head}>
            <p className="eyebrow">{t("find.eyebrow")}</p>
            <h2 id="discovery-title" className={`editorial editorial--section ${styles.title}`}>
              {t("find.title")}
            </h2>
            <p className={styles.lead}>{t("find.lead")}</p>
          </div>

          <div className={styles.questions}>
            {QUESTIONS.map((q) => (
              <fieldset key={q.key} className={styles.question}>
                <legend className={styles.qLabel}>{q.label}</legend>
                <div className={styles.options}>
                  {q.options.map((o) => {
                    const active = answers[q.key] === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        className={`${styles.option} ${active ? styles.optionOn : ""}`}
                        aria-pressed={active}
                        onClick={() =>
                          setAnswers((a) => ({ ...a, [q.key]: active ? null : o.value }))
                        }
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          {answered > 0 && (
            <div className={styles.resultsHead}>
              <span className={styles.resultsCount}>
                {results.length > 0
                  ? t("find.matches", { n: results.length })
                  : t("find.noMatch")}
              </span>
              <button type="button" className={styles.reset} onClick={reset}>
                {t("find.reset")}
              </button>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className={styles.results}>
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {answered > 0 && results.length === 0 && (
          <p className={styles.empty}>
            {t("find.tryOther")}
            <Link href="/shop" className={styles.emptyLink}>
              {t("find.browseAll")} <ArrowUpRight size={14} />
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
