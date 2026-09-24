"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import styles from "./Toast.module.css";

// Lightweight toast notifications for the admin. `toast(msg, "success" | "error" | "info")`.
const ToastContext = createContext({ toast: () => {} });

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const seq = useRef(0);

  const dismiss = useCallback((id) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const toast = useCallback((message, type = "success", ms = 2600) => {
    const id = ++seq.current;
    // Collapse identical consecutive messages (e.g. saving while typing).
    setItems((list) => [...list.filter((t) => t.message !== message), { id, message, type }].slice(-4));
    setTimeout(() => dismiss(id), ms);
  }, [dismiss]);

  // Server saves happen in the background; surface failures instead of
  // letting an edit silently exist only in this browser.
  useEffect(() => {
    const onErr = (e) => {
      const ar = document.documentElement.lang === "ar";
      const status = e.detail?.status;
      toast(
        status === 403
          ? (ar ? "انتهت جلسة الأدمن — ادخل من جديد ثم أعد الحفظ" : "Admin session expired — sign in again and re-save")
          : (ar ? "تعذّر الحفظ على السيرفر — التعديل محفوظ مؤقتًا في هذا المتصفح" : "Couldn't save to the server — kept in this browser for now"),
        "error",
        6000
      );
    };
    window.addEventListener("rne-sync-error", onErr);
    return () => window.removeEventListener("rne-sync-error", onErr);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className={styles.stack} role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`${styles.toast} ${styles[t.type] || ""}`}>
            <span className={styles.icon} aria-hidden="true">
              {t.type === "error" ? "!" : t.type === "info" ? "i" : "✓"}
            </span>
            <span>{t.message}</span>
            <button type="button" className={styles.close} onClick={() => dismiss(t.id)} aria-label="Dismiss">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
