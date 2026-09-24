"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useConfig } from "@/context/ConfigContext";
import { useLang } from "@/context/LangContext";
import { normalizeImageUrl, isImageUrl } from "@/lib/media";
import styles from "./AdSlider.module.css";

const AUTOPLAY_MS = 5500;

/**
 * Promotional banner carousel. Every text, link, colour and image comes from
 * Admin → Homepage → Banner slides.
 *
 * RTL: in a right-to-left document a flex row lays slides out right→left, so
 * the track must move in the POSITIVE x direction. It used to always move
 * negative, which slid the track into empty space — Arabic visitors saw the
 * first slide and then blank frames.
 */
export default function AdSlider() {
  const { config } = useConfig();
  const { lang, isRTL } = useLang();
  const slides = (config.adSlides || []).filter((s) => s && s.enabled !== false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [brokenImg, setBrokenImg] = useState({});
  const startX = useRef(null);
  const count = slides.length;

  // Keep the index valid if the admin removes slides.
  useEffect(() => {
    if (active >= count && count > 0) setActive(0);
  }, [active, count]);

  const go = useCallback((i) => {
    if (!count) return;
    setActive(((i % count) + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [count, active, paused]);

  if (!count) return null;

  const pick = (ar, en) => (lang === "ar" ? ar || en : en || ar);

  const onStart = (e) => {
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const onEnd = (e) => {
    if (startX.current == null) return;
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const dx = endX - startX.current;
    startX.current = null;
    if (Math.abs(dx) < 45) return;
    // Swiping toward the reading direction's end reveals the next slide.
    const forward = isRTL ? dx > 0 : dx < 0;
    go(active + (forward ? 1 : -1));
  };
  const onKey = (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const toNext = (e.key === "ArrowRight") !== isRTL;
    go(active + (toNext ? 1 : -1));
  };

  const offset = (isRTL ? 1 : -1) * active * 100;

  return (
    <section className={styles.wrap} aria-roledescription="carousel" aria-label={lang === "ar" ? "العروض" : "Offers"}>
      <div className="container">
        <div
          className={styles.viewport}
          onTouchStart={onStart}
          onTouchEnd={onEnd}
          onMouseDown={onStart}
          onMouseUp={onEnd}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => { setPaused(false); startX.current = null; }}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onKeyDown={onKey}
        >
          <div className={styles.track} style={{ transform: `translate3d(${offset}%, 0, 0)` }}>
            {slides.map((s, i) => {
              const img = isImageUrl(s.image) && !brokenImg[s.id] ? normalizeImageUrl(s.image, 1600) : null;
              const fg = s.fg || "#f7f5f1";
              const badge = pick(s.title, s.titleEn);
              const heading = pick(s.subtitle, s.subtitleEn);
              const desc = pick(s.desc, s.descEn);
              const cta = pick(s.cta, s.ctaEn);
              return (
                <div
                  key={s.id}
                  className={`${styles.slide} ${img ? styles.slideImage : ""}`}
                  style={{ background: img ? "#16130F" : s.bg || "#16130F", color: fg }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} / ${count}`}
                  aria-hidden={i !== active}
                >
                  {img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img}
                      alt=""
                      className={styles.slideBg}
                      draggable={false}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      onError={() => setBrokenImg((b) => ({ ...b, [s.id]: true }))}
                    />
                  )}
                  <div className={`${styles.slideInner} ${img ? styles.slideInnerOverlay : ""}`}>
                    <div className={styles.text}>
                      {badge && <span className={styles.badge}>{badge}</span>}
                      {heading && <h2 className={styles.title} style={{ color: fg }}>{heading}</h2>}
                      {desc && <p className={styles.desc}>{desc}</p>}
                      {cta && (
                        <Link href={s.href || "/shop"} className={styles.cta} tabIndex={i === active ? 0 : -1}>
                          {cta}
                        </Link>
                      )}
                    </div>
                    {!img && (
                      <div className={styles.decor} aria-hidden="true">
                        <span style={{ background: fg }} />
                        <span style={{ background: fg }} />
                        <span style={{ background: fg }} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {count > 1 && (
            <>
              <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={() => go(active - 1)} aria-label={lang === "ar" ? "السابق" : "Previous"}>
                <Chevron />
              </button>
              <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => go(active + 1)} aria-label={lang === "ar" ? "التالي" : "Next"}>
                <Chevron />
              </button>
            </>
          )}
        </div>

        {count > 1 && (
          <div className={styles.dots}>
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`${styles.dot} ${i === active ? styles.dotOn : ""}`}
                onClick={() => go(i)}
                aria-label={`${lang === "ar" ? "شريحة" : "Slide"} ${i + 1}`}
                aria-current={i === active}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
