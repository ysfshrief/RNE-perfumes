"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { useProducts } from "@/context/ProductContext";
import { isWarm, isFresh, isDay, isNight } from "@/data/productMeta";
import { getMinPrice, localNum } from "@/data/products";
import ProductCard from "./ProductCard";
import { ArrowUpRight } from "./icons";
import styles from "./Discovery.module.css";

const EMPTY = { character: null, time: null, who: null };
const STORAGE_KEY = "rne-find";

/**
 * Scores products against the answers. The weights are the store's original
 * recommendation logic; the one change is a bug fix: choosing "Men" or
 * "Women" no longer recommends fragrances made for the other gender (they
 * used to slip in on the strength of the other two answers).
 */
export function recommend(products, answers, limit = 3) {
  const pool = products.filter((p) => {
    if (p.isDiscoverySet) return false;
    if (answers.who === "Men" && p.gender === "Women") return false;
    if (answers.who === "Women" && p.gender === "Men") return false;
    return true;
  });
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
    .slice(0, limit)
    .map((s) => s.p);
}

/**
 * "Find your fragrance" — a three-step guided consultation:
 *   Character → Time → Who → Result.
 * The customer always sees which step they're on, what each choice means,
 * and can go back, edit any answer from the result, or start over. The
 * state survives leaving the page (e.g. opening a recommended product and
 * pressing Back).
 */
export default function Discovery() {
  const { t, lang } = useLang();
  const { visibleProducts } = useProducts();
  const [answers, setAnswers] = useState(EMPTY);
  const [step, setStep] = useState(0); // 0..2 questions, 3 = result
  const headingRef = useRef(null);
  const advanceTimer = useRef(null);
  const interacted = useRef(false);

  // Restore a previous session's progress.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
      if (saved && saved.answers) {
        const a = { ...EMPTY, ...saved.answers };
        // Never land on a step whose previous questions are unanswered.
        const firstOpen = ["character", "time", "who"].findIndex((k) => !a[k]);
        const wanted = Math.min(3, Math.max(0, Number(saved.step) || 0));
        setAnswers(a);
        setStep(firstOpen === -1 ? wanted : Math.min(wanted, firstOpen));
      }
    } catch (e) {}
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step })); } catch (e) {}
  }, [answers, step]);
  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  // Move focus to the new question so keyboard / screen-reader users follow.
  useEffect(() => {
    if (interacted.current) headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const QUESTIONS = [
    {
      key: "character",
      short: t("find.character"),
      title: t("find.q1"),
      help: t("find.q1Help"),
      options: [
        { value: "fresh", label: t("find.fresh"), desc: t("find.freshDesc"), icon: "❋" },
        { value: "warm", label: t("find.warm"), desc: t("find.warmDesc"), icon: "✺" },
      ],
    },
    {
      key: "time",
      short: t("find.when"),
      title: t("find.q2"),
      help: t("find.q2Help"),
      options: [
        { value: "day", label: t("find.day"), desc: t("find.dayDesc"), icon: "☀" },
        { value: "night", label: t("find.night"), desc: t("find.nightDesc"), icon: "☾" },
      ],
    },
    {
      key: "who",
      short: t("find.for"),
      title: t("find.q3"),
      help: t("find.q3Help"),
      options: [
        { value: "Men", label: t("find.men"), desc: t("find.menDesc"), icon: "♂" },
        { value: "Women", label: t("find.women"), desc: t("find.womenDesc"), icon: "♀" },
        { value: "Unisex", label: t("find.unisex"), desc: t("find.unisexDesc"), icon: "⚭" },
      ],
    },
  ];

  const done = answers.character && answers.time && answers.who;
  const results = useMemo(() => (done ? recommend(visibleProducts, answers) : []), [done, visibleProducts, answers]);
  const n = (x) => localNum(x, lang);

  const choose = (key, value, idx) => {
    interacted.current = true;
    setAnswers((a) => ({ ...a, [key]: value }));
    clearTimeout(advanceTimer.current);
    // A short pause so the customer sees their choice register, then move on.
    advanceTimer.current = setTimeout(() => setStep(idx + 1), 260);
  };
  const goTo = (i) => {
    interacted.current = true;
    clearTimeout(advanceTimer.current);
    setStep(i);
  };
  const restart = () => {
    interacted.current = true;
    clearTimeout(advanceTimer.current);
    setAnswers(EMPTY);
    setStep(0);
  };

  const labelFor = (q) => q.options.find((o) => o.value === answers[q.key])?.label;
  const shopHref = () => {
    const p = new URLSearchParams();
    if (answers.who && answers.who !== "Unisex") p.set("gender", `${answers.who},Unisex`);
    if (answers.who === "Unisex") p.set("gender", "Unisex");
    if (answers.character) p.set("family", answers.character === "fresh" ? "fresh" : "warm,woody");
    return `/shop?${p.toString()}`;
  };

  const q = QUESTIONS[step];

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

          {/* Stepper: where am I, what did I pick, jump back to any answered step */}
          <ol className={styles.stepper}>
            {QUESTIONS.map((qq, i) => {
              const state = i === step ? "current" : answers[qq.key] ? "done" : "todo";
              const reachable = i <= step || answers[qq.key] || (i > 0 && answers[QUESTIONS[i - 1].key]);
              return (
                <li key={qq.key} className={`${styles.stepItem} ${styles[state]}`}>
                  <button
                    type="button"
                    className={styles.stepBtn}
                    onClick={() => reachable && goTo(i)}
                    disabled={!reachable}
                    aria-current={i === step ? "step" : undefined}
                  >
                    <span className={styles.stepNum}>{state === "done" ? "✓" : n(i + 1)}</span>
                    <span className={styles.stepText}>
                      <span className={styles.stepLabel}>{qq.short}</span>
                      {answers[qq.key] && <span className={styles.stepValue}>{labelFor(qq)}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
            <li className={`${styles.stepItem} ${step === 3 ? styles.current : styles.todo}`}>
              <button type="button" className={styles.stepBtn} onClick={() => done && goTo(3)} disabled={!done} aria-current={step === 3 ? "step" : undefined}>
                <span className={styles.stepNum}>★</span>
                <span className={styles.stepText}><span className={styles.stepLabel}>{t("find.result")}</span></span>
              </button>
            </li>
          </ol>
          <div className={styles.progress} aria-hidden="true">
            <span style={{ width: `${(Math.min(step, 3) / 3) * 100}%` }} />
          </div>

          {q ? (
            <fieldset className={styles.question} key={q.key}>
              <legend className="sr-only">{q.title}</legend>
              <p className={styles.stepOf}>{t("find.stepOf", { n: n(step + 1), total: n(3) })}</p>
              <h3 className={styles.qTitle} ref={headingRef} tabIndex={-1}>{q.title}</h3>
              <p className={styles.qHelp}>{q.help}</p>
              <div className={styles.options} role="radiogroup" aria-label={q.title}>
                {q.options.map((o) => {
                  const active = answers[q.key] === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={`${styles.option} ${active ? styles.optionOn : ""}`}
                      onClick={() => choose(q.key, o.value, step)}
                    >
                      <span className={styles.optionIcon} aria-hidden="true">{o.icon}</span>
                      <span className={styles.optionText}>
                        <span className={styles.optionLabel}>{o.label}</span>
                        <span className={styles.optionDesc}>{o.desc}</span>
                      </span>
                      <span className={styles.optionCheck} aria-hidden="true">{active ? "✓" : ""}</span>
                    </button>
                  );
                })}
              </div>
              <div className={styles.nav}>
                {step > 0 ? (
                  <button type="button" className={styles.back} onClick={() => goTo(step - 1)}>
                    <span aria-hidden="true" className={styles.backArrow}>←</span> {t("find.back")}
                  </button>
                ) : <span />}
                {answers[q.key] ? (
                  <button type="button" className="btn btn--solid" onClick={() => goTo(step + 1)}>
                    {step === 2 ? t("find.seeResults") : t("common.next")}
                  </button>
                ) : (
                  <span className={styles.autoNext}>{t("find.autoNext")}</span>
                )}
              </div>
            </fieldset>
          ) : (
            <div className={styles.resultHead}>
              <h3 className={styles.qTitle} ref={headingRef} tabIndex={-1}>{t("find.resultTitle")}</h3>
              <p className={styles.qHelp}>{t("find.resultLead")}</p>
              <ul className={styles.summary}>
                {QUESTIONS.map((qq, i) => (
                  <li key={qq.key}>
                    <button type="button" className={styles.summaryChip} onClick={() => goTo(i)} aria-label={`${qq.short}: ${labelFor(qq)} — ${t("find.edit")}`}>
                      <span className={styles.summaryKey}>{qq.short}</span>
                      <span>{labelFor(qq)}</span>
                      <span className={styles.summaryEdit} aria-hidden="true">✎</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className={styles.nav}>
                <button type="button" className={styles.back} onClick={restart}>↺ {t("find.restart")}</button>
                {results.length > 0 && (
                  <Link href={shopHref()} className="link-pill">
                    <span>{t("find.shopMatches")}</span>
                    <ArrowUpRight size={16} className="link-pill__arrow" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {step === 3 && results.length > 0 && (
          <div className={styles.results}>
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {step === 3 && done && results.length === 0 && (
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
