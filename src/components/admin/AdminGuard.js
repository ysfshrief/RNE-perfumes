"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { checkAdmin, unlockAdmin } from "@/lib/adminAccess";
import { isRemote } from "@/lib/backend";
import styles from "./AdminGuard.module.css";

/**
 * Wraps every /admin route. Nothing inside the dashboard renders (and no
 * admin-only data is requested) until access is confirmed.
 */
export default function AdminGuard({ children }) {
  const { lang } = useLang();
  const T = (a, e) => (lang === "ar" ? a : e);
  const [ok, setOk] = useState(null); // null = checking
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    checkAdmin().then((v) => alive && setOk(v));
    return () => { alive = false; };
  }, []);

  if (ok === null) {
    return (
      <div className={styles.wrap} aria-busy="true">
        <div className={styles.spinner} aria-hidden="true" />
        <p className={styles.muted}>{T("جارِ التحقق من الصلاحيات…", "Checking access…")}</p>
      </div>
    );
  }
  if (ok) return children;

  return (
    <div className={styles.wrap}>
      <form
        className={styles.box}
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const granted = await unlockAdmin(code);
          setBusy(false);
          if (granted) setOk(true);
          else setErr(true);
        }}
      >
        <span className={styles.lock} aria-hidden="true">🔒</span>
        <h1>{T("دخول الإدارة", "Admin access")}</h1>
        <p>{T("اكتب كود الدخول.", "Enter the access code.")}</p>
        <label className="sr-only" htmlFor="admin-code">{T("الكود", "Code")}</label>
        <input
          id="admin-code"
          type="password"
          inputMode="numeric"
          autoFocus
          dir="ltr"
          value={code}
          aria-invalid={err}
          onChange={(e) => { setCode(e.target.value); setErr(false); }}
          className={styles.input}
        />
        {err && <p role="alert" className={styles.err}>{T("الكود غير صحيح", "Incorrect code")}</p>}
        <button type="submit" className="btn btn--solid btn--full" disabled={busy}>
          {busy ? "…" : T("دخول", "Enter")}
        </button>
        {!isRemote && (
          <p className={styles.muted}>
            {T(
              "وضع تجريبي: قاعدة البيانات غير متصلة، فالتعديلات تُحفظ في هذا المتصفح فقط.",
              "Demo mode: no database connected, so edits are saved in this browser only.",
            )}
          </p>
        )}
        <Link href="/" className={styles.back}>{T("← الرجوع للمتجر", "← Back to store")}</Link>
      </form>
    </div>
  );
}
