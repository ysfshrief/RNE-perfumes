"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { productImages } from "@/lib/media";
import ProductImage from "./ProductImage";
import styles from "./ProductGallery.module.css";

/**
 * Product gallery: main image + thumbnails, swipe on touch, arrow keys,
 * and a full-screen zoom view. Works with one image (legacy products) or many.
 */
export default function ProductGallery({ product, name, badges, lang }) {
  const images = productImages(product);
  const count = Math.max(images.length, 1);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const touch = useRef(null);
  const isRTL = lang === "ar";
  const L = (ar, en) => (isRTL ? ar : en);

  useEffect(() => { if (index >= count) setIndex(0); }, [count, index]);

  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count]);

  const onTouchStart = (e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx)) return; // ignore vertical scrolls
    const forward = isRTL ? dx > 0 : dx < 0;
    go(index + (forward ? 1 : -1));
  };
  const onKey = (e) => {
    if (count < 2) return;
    if (e.key === "ArrowRight") go(index + (isRTL ? -1 : 1));
    if (e.key === "ArrowLeft") go(index + (isRTL ? 1 : -1));
  };

  // Zoom view: Escape closes, arrows navigate, page doesn't scroll behind.
  useEffect(() => {
    if (!zoom) return;
    const onDoc = (e) => {
      if (e.key === "Escape") setZoom(false);
      else onKey(e);
    };
    document.addEventListener("keydown", onDoc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onDoc); document.body.style.overflow = prev; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, index, count]);

  const label = (i) => `${name} — ${L("صورة", "image")} ${i + 1} ${L("من", "of")} ${count}`;

  return (
    <div className={styles.gallery}>
      <div
        className={styles.main}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onKeyDown={onKey}
        role="region"
        aria-roledescription={L("معرض صور", "gallery")}
        aria-label={name}
      >
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className={`${styles.frame} ${i === index ? styles.frameOn : ""}`} aria-hidden={i !== index}>
            {/* Only the visible image and its neighbours are mounted. */}
            {Math.abs(i - index) <= 1 || (index === 0 && i === count - 1) || (index === count - 1 && i === 0) ? (
              <ProductImage product={product} index={i} width={1200} priority={i === 0} alt={label(i)} />
            ) : null}
          </div>
        ))}

        <button type="button" className={styles.zoomBtn} onClick={() => setZoom(true)} aria-label={L("تكبير الصورة", "Zoom image")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" /></svg>
        </button>

        {badges && <div className={styles.badges}>{badges}</div>}

        {count > 1 && (
          <>
            <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => go(index - 1)} aria-label={L("الصورة السابقة", "Previous image")}><Chevron /></button>
            <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => go(index + 1)} aria-label={L("الصورة التالية", "Next image")}><Chevron /></button>
            <span className={styles.counter} aria-live="polite">{index + 1} / {count}</span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className={styles.thumbs} role="tablist" aria-label={L("صور المنتج", "Product images")}>
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={label(i)}
              className={`${styles.thumb} ${i === index ? styles.thumbOn : ""}`}
              onClick={() => go(i)}
            >
              <ProductImage product={product} index={i} width={200} showLabel={false} alt="" />
            </button>
          ))}
        </div>
      )}

      {zoom && typeof document !== "undefined" && createPortal(
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={name} onClick={() => setZoom(false)}>
          <button type="button" className={styles.close} onClick={() => setZoom(false)} aria-label={L("إغلاق", "Close")} autoFocus>×</button>
          <div className={styles.lightImg} onClick={(e) => e.stopPropagation()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <ProductImage product={product} index={index} width={1800} fit="contain" alt={label(index)} priority />
          </div>
          {count > 1 && (
            <>
              <button type="button" className={`${styles.nav} ${styles.prev} ${styles.navLight}`} onClick={(e) => { e.stopPropagation(); go(index - 1); }} aria-label={L("الصورة السابقة", "Previous image")}><Chevron /></button>
              <button type="button" className={`${styles.nav} ${styles.next} ${styles.navLight}`} onClick={(e) => { e.stopPropagation(); go(index + 1); }} aria-label={L("الصورة التالية", "Next image")}><Chevron /></button>
              <span className={`${styles.counter} ${styles.counterLight}`}>{index + 1} / {count}</span>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
