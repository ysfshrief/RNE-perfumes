"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";
import styles from "./admin.module.css";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import AdminGuard from "@/components/admin/AdminGuard";
import { ToastProvider } from "@/components/admin/Toast";
import { subscribeCollection } from "@/lib/store";

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <ToastProvider>
        <AdminShell>{children}</AdminShell>
      </ToastProvider>
    </AdminGuard>
  );
}

// Only mounted once access is confirmed, so admin-only collections are never
// subscribed to by an unauthorised visitor.
function AdminShell({ children }) {
  const { t, lang, toggle } = useLang();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [newOrders, setNewOrders] = useState(0);

  useEffect(() => {
    return subscribeCollection("orders", (list) =>
      setNewOrders(list.filter((o) => o.status === "New").length),
    );
  }, []);

  // Close the mobile drawer with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`} aria-label={t("admin.brand")}>
        <DashboardSidebar onNavigate={() => setOpen(false)} counts={{ orders: newOrders }} />
      </aside>

      <div className={styles.content}>
        <header className={styles.topbar}>
          <button
            className={styles.menuBtn}
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >☰</button>
          <div className={styles.topbarRight}>
            <button type="button" className={styles.langSwitch} onClick={toggle} aria-label="Switch language">
              {lang === "ar" ? "EN" : "ع"}
            </button>
            <span className={styles.adminName}>{user?.name || user?.email || t("admin.brand")}</span>
            <span className={`${styles.avatar} keep-latin`} aria-hidden="true">R</span>
          </div>
        </header>
        <div className={styles.main}>{children}</div>
      </div>

      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}
    </div>
  );
}
