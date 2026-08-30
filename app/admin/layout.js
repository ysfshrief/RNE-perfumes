"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";
import styles from "./admin.module.css";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import { subscribeCollection } from "@/lib/store";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { t } = useLang();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [newOrders, setNewOrders] = useState(0);

  useEffect(() => {
    return subscribeCollection("orders", (list) =>
      setNewOrders(list.filter((o) => o.status === "New").length),
    );
  }, []);

  const NAV = [
    { href: "/admin", label: t("admin.overview"), icon: "▤" },
    { href: "/admin/products", label: t("admin.products"), icon: "▦" },
    { href: "/admin/orders", label: t("admin.orders"), icon: "▧" },
    { href: "/admin/customers", label: t("admin.customers"), icon: "◉" },
    { href: "/admin/reviews", label: t("admin.reviews"), icon: "★" },
    { href: "/admin/discounts", label: t("admin.discounts"), icon: "%" },
    { href: "/admin/content", label: t("admin.content"), icon: "▤" },
    { href: "/admin/settings", label: t("admin.settings"), icon: "⚙" },
  ];

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <DashboardSidebar onNavigate={() => setOpen(false)} counts={{ orders: newOrders }} />
      </aside>

      <div className={styles.content}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setOpen((v) => !v)} aria-label="Menu">☰</button>
          <div className={styles.topbarRight}>
            <span className={styles.adminName}>{t("admin.brand")} · {user?.name || user?.email || t("admin.brand")}</span>
            <span className={`${styles.avatar} keep-latin`}>R</span>
          </div>
        </header>
        <div className={styles.main}>{children}</div>
      </div>

      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}
    </div>
  );
}
