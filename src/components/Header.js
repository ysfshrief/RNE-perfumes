"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { useShop } from "@/context/ShopContext";
import styles from "./Header.module.css";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=Men", label: "Men" },
  { href: "/shop?category=Women", label: "Women" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { cartCount, state } = useShop();
  const [open, setOpen] = useState(false);
  const wishCount = state.wishlist.length;

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <button
          className={styles.burger}
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>

        <Link href="/" className={styles.logo}>
          <Logo compact />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {nav.map((n) => (
            <Link key={n.label} href={n.href} className={styles.link}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/account" aria-label="Account" className={styles.iconLink}>
            <UserIcon />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className={styles.iconLink}>
            <HeartIcon />
            {wishCount > 0 && <span className={styles.count}>{wishCount}</span>}
          </Link>
          <Link href="/cart" aria-label="Cart" className={styles.iconLink}>
            <BagIcon />
            {cartCount > 0 && <span className={styles.count}>{cartCount}</span>}
          </Link>
        </div>
      </div>

      {open && (
        <nav className={styles.mobileNav} aria-label="Mobile">
          {nav.map((n) => (
            <Link key={n.label} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
          <Link href="/account" onClick={() => setOpen(false)}>My Account</Link>
        </nav>
      )}
    </header>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 21C7 17 3 13.5 3 9a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 4.5-4 8-9 12z" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
