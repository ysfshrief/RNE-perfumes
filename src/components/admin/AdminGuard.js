"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { adminRequiresAuth, isDemoUnlocked, unlockDemo } from "@/lib/adminAccess";
import styles from "./AdminGuard.module.css";

/**
 * Wraps every /admin route. Nothing inside the dashboard renders (and no
 * admin-only collection is subscribed to) until access is confirmed.
 */
export default function AdminGuard({ children }) {
  const { user, isAdmin, ready } = useAuth();
  const { lang } = useLang();
  const T = (a, e) => (lang === "ar" ? a : e);
  const [demoOk, setDemoOk] = useState(false);
  const [checked, setChecked] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    setDemoOk(isDemoUnlocked());
    setChecked(true);
  }, []);

  if (!checked || (adminRequiresAuth && !ready)) {
    return (
      <div className={styles.wrap} aria-busy="true">
        <div className={styles.spinner} aria-hidden="true" />
        <p className={styles.muted}>{T("جارِ التحقق من الصلاحيات…", "Checking access…")}</p>
      </div>
    );
  }

  // ── Firebase mode: real authentication + admin claim ──
  if (adminRequiresAuth) {
    if (isAdmin) return children;
    return (
      <div className={styles.wrap}>
        <div className={styles.box}>
          <span className={styles.lock} aria-hidden="true">🔒</span>
          <h1>{T("لوحة التحكم محمية", "Admin area")}</h1>
          {!user ? (
            <>
              <p>{T("سجّل الدخول بحساب الأدمن للمتابعة.", "Sign in with an admin account to continue.")}</p>
              <Link href="/login?next=/admin" className="btn btn--solid btn--full">{T("تسجيل الدخول", "Sign in")}</Link>
            </>
          ) : (
            <>
              <p>
                {T(
                  `الحساب ${user.email} ليس لديه صلاحية أدمن.`,
                  `${user.email} does not have admin permission.`,
                )}
              </p>
              <p className={styles.muted}>
                {T(
                  "لإضافة صلاحية: شغّل  node scripts/setAdmin.mjs <email>  ثم سجّل خروج ودخول.",
                  "To grant access run  node scripts/setAdmin.mjs <email>  then sign out and back in.",
                )}
              </p>
            </>
          )}
          <Link href="/" className={styles.back}>{T("← الرجوع للمتجر", "← Back to store")}</Link>
        </div>
      </div>
    );
  }

  // ── Demo/local mode: session code gate ──
  if (demoOk) return children;
  return (
    <div className={styles.wrap}>
      <form
        className={styles.box}
        onSubmit={(e) => {
          e.preventDefault();
          if (unlockDemo(code)) setDemoOk(true);
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
        <button type="submit" className="btn btn--solid btn--full">{T("دخول", "Enter")}</button>
        <p className={styles.muted}>
          {T(
            "وضع تجريبي: Firebase غير متصل، فالتعديلات تُحفظ في هذا المتصفح فقط.",
            "Demo mode: Firebase is not connected, so edits are saved in this browser only.",
          )}
        </p>
        <Link href="/" className={styles.back}>{T("← الرجوع للمتجر", "← Back to store")}</Link>
      </form>
    </div>
  );
}
