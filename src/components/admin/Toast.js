"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
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
