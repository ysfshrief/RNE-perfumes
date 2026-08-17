"use client";

import Link from "next/link";
import LogoRNE from "./LogoRNE";
import LogoJoe from "./LogoJoe";
import FooterAdminTrigger from "./FooterAdminTrigger";
import { useLang } from "@/context/LangContext";
import styles from "./Footer.module.css";

export default function Footer() {
  const { t } = useLang();

  const columns = [
    {
      title: t("footer.shop"),
      links: [
        { href: "/shop", label: t("footer.allFragrances") },
        { href: "/shop?category=Men", label: t("nav.men") },
        { href: "/shop?category=Women", label: t("nav.women") },
        { href: "/shop?offers=true", label: t("footer.offers") },
      ],
    },
    {
      title: t("footer.help"),
      links: [
        { href: "/faq", label: t("footer.faq") },
        { href: "/shipping-policy", label: t("footer.shippingPolicy") },
        { href: "/return-policy", label: t("footer.returns") },
        { href: "/contact", label: t("nav.contact") },
      ],
    },
    {
      title: t("footer.brand"),
      links: [
        { href: "/about", label: t("footer.aboutRne") },
        { href: "/terms", label: t("footer.terms") },
        { href: "/account", label: t("nav.myAccount") },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <LogoRNE light />
            <p className={styles.tag}>{t("footer.tag")}</p>
            <div className={styles.social}>
              <a href="#" aria-label="Instagram"><IgIcon /></a>
              <a href="#" aria-label="Facebook"><FbIcon /></a>
              <a href="#" aria-label="TikTok"><TtIcon /></a>
            </div>
          </div>

          <div className={styles.cols}>
            {columns.map((c) => (
              <div key={c.title} className={styles.col}>
                <h4>{c.title}</h4>
                <ul>
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory copyright — do not alter */}
        <div className={styles.bottom}>
          <div className={styles.copyLeft}>
            {/* Secret admin trigger: tap RNE 3× then enter 000 */}
            <FooterAdminTrigger />
            <div className={styles.copyText}>
              <p dir="rtl">جميع الحقوق محفوظة RNE perfumes</p>
              <p dir="ltr">Developed &amp; designed by : Youssef Shrief</p>
            </div>
          </div>

          <div className={styles.devBy} dir="ltr">
            <span className={styles.poweredBy} dir="ltr">Powered by</span>
            <LogoJoe height={30} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function IgIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
function FbIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 8h2V5h-2c-2 0-3 1-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8z" />
    </svg>
  );
}
function TtIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 4c.5 2.5 2 4 4.5 4.2V11c-1.8 0-3.3-.6-4.5-1.5V15a5 5 0 1 1-5-5v3a2 2 0 1 0 2 2V4h3z" />
    </svg>
  );
}
