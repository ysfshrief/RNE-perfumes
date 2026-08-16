"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin.module.css";

const NAV = [
  { href: "/admin", label: "Overview", icon: "▤" },
  { href: "/admin/products", label: "Products", icon: "▦" },
  { href: "/admin/orders", label: "Orders", icon: "▧" },
  { href: "/admin/customers", label: "Customers", icon: "◉" },
  { href: "/admin/reviews", label: "Reviews", icon: "★" },
  { href: "/admin/discounts", label: "Discounts", icon: "%" },
  { href: "/admin/content", label: "Content", icon: "▤" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>RNE</span>
          <span className={styles.brandSub}>Admin</span>
        </div>
        <nav className={styles.nav}>
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`${styles.navLink} ${active ? styles.navActive : ""}`}
                onClick={() => setOpen(false)}
              >
                <span className={styles.navIcon}>{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/" className={styles.backToSite}>← View store</Link>
      </aside>

      <div className={styles.content}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setOpen((v) => !v)} aria-label="Menu">☰</button>
          <div className={styles.topbarRight}>
            <span className={styles.adminName}>Admin · روفائيل نسيم</span>
            <span className={styles.avatar}>R</span>
          </div>
        </header>
        <div className={styles.main}>{children}</div>
      </div>

      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}
    </div>
  );
}
