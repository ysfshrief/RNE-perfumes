"use client";

import { useState, useRef, useEffect } from "react";
import { useConfig } from "@/context/ConfigContext";
import { useLang } from "@/context/LangContext";
import styles from "./SpinWheel.module.css";

export default function SpinWheel() {
  const { config } = useConfig();
  const { t, lang } = useLang();
  const wheel = config.wheel;

  const [open, setOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const canvasRef = useRef(null);

  const segments = wheel?.segments || [];
  const label = (s) => (lang === "ar" ? s.label : s.labelEn);

  // Check if already played this session
  useEffect(() => {
    try {
      if (localStorage.getItem("rne-wheel-played")) setAlreadyPlayed(true);
    } catch (e) {}
  }, []);

  // Draw the wheel
  useEffect(() => {
    if (!open || !canvasRef.current || !segments.length) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 6;
    const n = segments.length;
    const arc = (2 * Math.PI) / n;

    ctx.clearRect(0, 0, size, size);
    segments.forEach((seg, i) => {
      const start = i * arc - Math.PI / 2;
      const end = start + arc;
      // slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = seg.color || "#b8863b";
      ctx.fill();
      ctx.strokeStyle = "rgba(247,245,241,0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#f7f5f1";
      ctx.font = "600 15px 'Tajawal', system-ui, sans-serif";
      ctx.fillText(label(seg), radius - 16, 6);
      ctx.restore();
    });

    // center hub
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, 2 * Math.PI);
    ctx.fillStyle = "#0a0a0a";
    ctx.fill();
    ctx.strokeStyle = "#b8863b";
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [open, segments, lang]);

  if (!wheel?.enabled || !segments.length) return null;

  const weightedPick = () => {
    const total = segments.reduce((sum, s) => sum + (s.weight || 1), 0);
    let r = Math.random() * total;
    for (let i = 0; i < segments.length; i++) {
      r -= segments[i].weight || 1;
      if (r <= 0) return i;
    }
    return segments.length - 1;
  };

  const spin = () => {
    if (spinning || alreadyPlayed) return;
    setSpinning(true);
    setResult(null);

    const winnerIdx = weightedPick();
    const n = segments.length;
    const arc = 360 / n;
    // Pointer is at top (12 o'clock). Land the winner's middle at top.
    const targetAngle = 360 * 6 + (360 - (winnerIdx * arc + arc / 2));
    const finalRotation = rotation + targetAngle;
    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(segments[winnerIdx]);
      setAlreadyPlayed(true);
      try { localStorage.setItem("rne-wheel-played", "1"); } catch (e) {}
    }, 4200);
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label={lang === "ar" ? wheel.title : wheel.titleEn}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
        <span className={styles.triggerText}>{lang === "ar" ? "اربح خصم" : "Win"}</span>
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => !spinning && setOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.close} onClick={() => !spinning && setOpen(false)} aria-label="Close">×</button>

            <h3 className={styles.title}>{lang === "ar" ? wheel.title : wheel.titleEn}</h3>
            <p className={styles.subtitle}>{lang === "ar" ? wheel.subtitle : wheel.subtitleEn}</p>

            <div className={styles.wheelBox}>
              <div className={styles.pointer} aria-hidden="true" />
              <div
                className={styles.wheelSpin}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? "transform 4.2s cubic-bezier(0.17,0.67,0.12,0.99)" : "none",
                }}
              >
                <canvas ref={canvasRef} width={300} height={300} className={styles.canvas} />
              </div>
            </div>

            {result ? (
              <div className={styles.result}>
                {result.code ? (
                  <>
                    <p className={styles.resultWon}>{lang === "ar" ? "مبروك! ربحت" : "You won"}</p>
                    <p className={styles.resultPrize}>{label(result)}</p>
                    <div className={styles.codeBox}>
                      <span className={styles.codeLabel}>{lang === "ar" ? "كود الخصم" : "Your code"}</span>
                      <span className={styles.code}>{result.code}</span>
                    </div>
                    <p className={styles.resultHint}>
                      {lang === "ar" ? "استخدم الكود عند الدفع" : "Use this code at checkout"}
                    </p>
                  </>
                ) : (
                  <p className={styles.resultPrize}>{label(result)} 🍀</p>
                )}
              </div>
            ) : (
              <button className={styles.spinBtn} onClick={spin} disabled={spinning || alreadyPlayed}>
                {alreadyPlayed
                  ? (lang === "ar" ? "لعبت بالفعل" : "Already played")
                  : spinning
                  ? (lang === "ar" ? "بيلف..." : "Spinning...")
                  : (lang === "ar" ? "لُف العجلة" : "Spin the wheel")}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
