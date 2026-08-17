"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useConfig } from "@/context/ConfigContext";
import { useLang } from "@/context/LangContext";
import styles from "./AdSlider.module.css";

export default function AdSlider() {
  const { config } = useConfig();
  const { lang } = useLang();
  const slides = config.adSlides || [];
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);
  const startX = useRef(null);
  const timer = useRef(null);

  const go = useCallback((i) => {
    if (!slides.length) return;
    const next = (i + slides.length) % slides.length;
    setActive(next);
  }, [slides.length]);

  // Autoplay
  useEffect(() => {
    if (slides.length <= 1) return;
    clearInterval(timer.current);
    timer.current = setInterval(() => setActive((a) => (a + 1) % slides.length), 5000);
    return () => clearInterval(timer.current);
  }, [slides.length, active]);

  if (!slides.length) return null;

  const onStart = (e) => {
    startX.current = (e.touches ? e.touches[0].clientX : e.clientX);
  };
  const onEnd = (e) => {
    if (startX.current == null) return;
    const endX = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX);
    const dx = endX - startX.current;
    // RTL flips swipe direction
    const dir = lang === "ar" ? -1 : 1;
    if (Math.abs(dx) > 45) go(active + (dx < 0 ? 1 : -1) * dir);
    startX.current = null;
  };

  return (
    <section className={styles.wrap}>
      <div className="container">
        <div
          className={styles.viewport}
          onTouchStart={onStart}
          onTouchEnd={onEnd}
          onMouseDown={onStart}
          onMouseUp={onEnd}
        >
          <div
            className={styles.track}
            ref={trackRef}
            style={{ transform: `translateX(${lang === "ar" ? "" : "-"}${active * 100}%)` }}
          >
            {slides.map((s) => (
              <div className={styles.slide} key={s.id} style={{ background: s.bg, color: s.fg }}>
                <div className={styles.slideInner}>
                  <div className={styles.text}>
                    <span className={styles.badge}>{lang === "ar" ? s.title : s.titleEn}</span>
                    <h2 className={styles.title} style={{ color: s.fg }}>
                      {lang === "ar" ? s.subtitle : s.subtitleEn}
                    </h2>
                    {(s.cta || s.ctaEn) && (
                      <Link href={s.href || "/shop"} className={styles.cta}>
                        {lang === "ar" ? s.cta : s.ctaEn}
                      </Link>
                    )}
                  </div>
                  <div className={styles.decor} aria-hidden="true">
                    <span style={{ background: s.fg }} />
                    <span style={{ background: s.fg }} />
                    <span style={{ background: s.fg }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          {slides.length > 1 && (
            <>
              <button className={`${styles.arrow} ${styles.prev}`} onClick={() => go(active - 1)} aria-label="Previous">‹</button>
              <button className={`${styles.arrow} ${styles.next}`} onClick={() => go(active + 1)} aria-label="Next">›</button>
            </>
          )}
        </div>

        {/* Dots */}
        {slides.length > 1 && (
          <div className={styles.dots}>
            {slides.map((s, i) => (
              <button
                key={s.id}
                className={`${styles.dot} ${i === active ? styles.dotOn : ""}`}
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
