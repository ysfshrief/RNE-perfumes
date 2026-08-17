"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import LogoRNE from "./LogoRNE";
import { useLang } from "@/context/LangContext";
import styles from "./FooterAdminTrigger.module.css";

export default function FooterAdminTrigger() {
  const router = useRouter();
  const { t } = useLang();
  const [taps, setTaps] = useState(0);
  const [prompt, setPrompt] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const resetTimer = useRef(null);

  useEffect(() => {
    if (taps === 0) return;
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setTaps(0), 1500);
    return () => clearTimeout(resetTimer.current);
  }, [taps]);

  const handleTap = () => {
    const next = taps + 1;
    if (next >= 3) {
      setTaps(0);
      setPrompt(true);
      setCode("");
      setError(false);
    } else {
      setTaps(next);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (code === "000") {
      setPrompt(false);
      router.push("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <>
      <LogoRNE light onClick={handleTap} className={styles.trigger} />

      {prompt && (
        <div className={styles.overlay} onClick={() => setPrompt(false)}>
          <form className={styles.box} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
            <h3>{t("adminGate.title")}</h3>
            <p>{t("adminGate.prompt")}</p>
            <input
              autoFocus
              type="password"
              inputMode="numeric"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(false); }}
              placeholder="•••"
              className={error ? styles.inputError : ""}
            />
            {error && <span className={styles.err}>{t("adminGate.incorrect")}</span>}
            <div className={styles.actions}>
              <button type="button" className={styles.cancel} onClick={() => setPrompt(false)}>{t("adminGate.cancel")}</button>
              <button type="submit" className={styles.enter}>{t("adminGate.enter")}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
