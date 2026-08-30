"use client";

import { useEffect, useRef, useState } from "react";

/**
 * FadingVideo
 * -----------
 * Cinematic media element that fades a <video> in over a poster image using
 * requestAnimationFrame — deliberately NOT a CSS `transition: opacity`.
 *
 * Why rAF: it lets us start/stop the fade precisely when the video actually
 * has frames, cancel it on unmount, and avoid running any animation work while
 * the element is off-screen.
 *
 * Behaviour:
 *  - Renders the poster image immediately (never blocks paint).
 *  - Only loads/plays the video when scrolled into view (IntersectionObserver).
 *  - Pauses the video when it leaves the viewport (performance).
 *  - Respects prefers-reduced-motion: no video autoplay, poster only.
 *  - Falls back to the poster if there is no video source or it fails.
 */
export default function FadingVideo({
  src,
  poster,
  alt = "",
  fit = "cover",           // "cover" | "contain"
  fadeMs = 900,
  className = "",
  style,
  loop = true,
}) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [failed, setFailed] = useState(false);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const useVideo = Boolean(src) && !failed && !reduceMotion;

  // Only activate media when the element is actually visible.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        const v = videoRef.current;
        if (!v) return; // may not be mounted yet — the effect below handles that
        if (entry.isIntersecting) {
          const p = v.play();
          if (p && typeof p.catch === "function") p.catch(() => {});
        } else {
          v.pause(); // stop decoding work off-screen
        }
      },
      { rootMargin: "200px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The <video> only mounts once `inView` flips true, which happens *after*
  // the observer callback has already run — so start playback here too,
  // otherwise the element would mount paused and never load.
  useEffect(() => {
    if (!inView || !useVideo) return;
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [inView, useVideo]);

  // rAF-driven fade-in, started only once the video can actually render frames.
  const startFade = () => {
    const v = videoRef.current;
    if (!v) return;
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    v.style.opacity = "0";
    const step = (now) => {
      const t = Math.min(1, (now - start) / fadeMs);
      // easeOutCubic — cinematic settle
      v.style.opacity = String(1 - Math.pow(1 - t, 3));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null; // loop stops when the fade is done
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const objectFit = fit === "contain" ? "contain" : "cover";

  return (
    <div ref={wrapRef} className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit }}
        />
      )}
      {useVideo && inView && (
        <video
          ref={videoRef}
          src={src}
          poster={poster || undefined}
          muted
          playsInline
          loop={loop}
          preload="metadata"
          aria-label={alt || undefined}
          onCanPlay={startFade}
          onError={() => setFailed(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit,
            opacity: 0, // driven by rAF above, never by a CSS transition
          }}
        />
      )}
    </div>
  );
}
