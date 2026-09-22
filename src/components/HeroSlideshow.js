"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";

/**
 * Cinematic hero background: slow crossfade between admin-managed images with
 * a gentle Ken Burns drift on the visible frame.
 *
 * Performance / robustness:
 *  - The first image loads eagerly (it is the LCP element); every other image
 *    is only requested right before it is shown.
 *  - A slide is only switched to once its image has actually loaded, so a
 *    visitor never sees a half-loaded or broken frame. Broken links are
 *    dropped from the rotation silently.
 *  - Rotation pauses while the tab is hidden or the hero is off-screen, and is
 *    disabled entirely for prefers-reduced-motion.
 *  - Only opacity/transform animate (GPU-composited, no layout work).
 */
export default function HeroSlideshow({ slides, interval = 7, label = "", dotsLabel = "Slide" }) {
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(() => new Set());   // indexes whose image is ready
  const [failed, setFailed] = useState(() => new Set());   // indexes whose image errored
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef(null);
  const count = slides.length;

  // Reset if the admin changes the list.
  const key = slides.map((s) => s.url).join("|");
  useEffect(() => {
    setActive(0);
    setLoaded(new Set());
    setFailed(new Set());
  }, [key]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Pause when off-screen or the tab is hidden.
  useEffect(() => {
    const el = rootRef.current;
    let onScreen = true;
    let tabVisible = typeof document === "undefined" ? true : document.visibilityState !== "hidden";
    const update = () => setVisible(onScreen && tabVisible);
    let io;
    if (el && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; update(); }, { threshold: 0.05 });
      io.observe(el);
    }
    const onVis = () => { tabVisible = document.visibilityState !== "hidden"; update(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { io?.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  const markLoaded = useCallback((i) => setLoaded((s) => (s.has(i) ? s : new Set(s).add(i))), []);
  const markFailed = useCallback((i) => setFailed((s) => (s.has(i) ? s : new Set(s).add(i))), []);

  // Next usable index after `from` (skips failed slides).
  const nextIndex = useCallback((from) => {
    for (let step = 1; step <= count; step++) {
      const i = (from + step) % count;
      if (!failed.has(i)) return i;
    }
    return from;
  }, [count, failed]);

  const upcoming = count > 1 ? nextIndex(active) : active;

  // If the active slide itself failed, move on immediately.
  useEffect(() => {
    if (failed.has(active) && failed.size < count) setActive(nextIndex(active));
  }, [failed, active, count, nextIndex]);

  // Advance only when the next image is ready — never onto a blank frame.
  useEffect(() => {
    if (count < 2 || reduced || !visible) return;
    const id = setTimeout(() => {
      if (loaded.has(upcoming) && upcoming !== active) setActive(upcoming);
    }, interval * 1000);
    return () => clearTimeout(id);
  }, [active, upcoming, loaded, count, interval, reduced, visible]);

  if (!count || failed.size >= count) {
    // Nothing usable: a quiet brand gradient instead of a broken image.
    return <div className={styles.fallbackBg} aria-hidden="true" />;
  }

  // Mount the active frame, the next one (preload) and anything already
  // loaded (cached, so it costs nothing and keeps the crossfade smooth).
  const shouldMount = (i) => i === active || i === upcoming || loaded.has(i) || i === 0;

  return (
    <div
      ref={rootRef}
      className={styles.slides}
      role={count > 1 ? "region" : undefined}
      aria-roledescription={count > 1 ? "carousel" : undefined}
      aria-label={label || undefined}
    >
      {slides.map((s, i) =>
        shouldMount(i) && !failed.has(i) ? (
          <div
            key={s.id}
            className={`${styles.slide} ${i === active ? styles.slideOn : ""} ${i % 2 ? styles.kbAlt : ""}`}
            style={{ "--kb-dur": `${interval + 2.4}s` }}
            aria-hidden={i !== active}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.url}
              alt={i === active ? s.alt : ""}
              className={styles.slideImg}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              decoding="async"
              draggable={false}
              onLoad={() => markLoaded(i)}
              onError={() => markFailed(i)}
            />
          </div>
        ) : null,
      )}

      {count - failed.size > 1 && (
        <div className={styles.dots}>
          {slides.map((s, i) =>
            failed.has(i) ? null : (
              <button
                key={s.id}
                type="button"
                className={`${styles.dot} ${i === active ? styles.dotOn : ""}`}
                aria-label={`${dotsLabel} ${i + 1}`}
                aria-current={i === active}
                onClick={() => loaded.has(i) || i === active ? setActive(i) : null}
              >
                <span className={styles.dotFill} style={i === active && !reduced ? { animationDuration: `${interval}s` } : undefined} />
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
