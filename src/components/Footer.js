"use client";

import Link from "next/link";
import LogoRNE from "./LogoRNE";
import LogoJoe from "./LogoJoe";
import FooterAdminTrigger from "./FooterAdminTrigger";
import { useLang } from "@/context/LangContext";
import { contact, socials } from "@/data/brand";
import styles from "./Footer.module.css";

const ICONS = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M14 8h2.2V5.1C15.8 5 14.9 5 13.9 5c-2.1 0-3.5 1.3-3.5 3.6V11H8v3h2.4v8h3V14h2.4l.4-3h-2.8V8.9c0-.6.2-.9 1.2-.9z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.5-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.3 7.3 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3.2-.4a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.4-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1c0 1.2.9 2.4 1 2.6a9.5 9.5 0 0 0 3.7 3.3c1.4.6 1.9.6 2.6.5a2.4 2.4 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.4-.3z" />
    </svg>
  ),
};

export default function Footer() {
  const { t } = useLang();

  const navLinks = [
    { href: "/", label: t("footer.home") },
    { href: "/shop", label: t("footer.allFragrances") },
    { href: "/shop?category=Men", label: t("nav.men") },
    { href: "/shop?category=Women", label: t("nav.women") },
    { href: "/shop?offers=true", label: t("footer.offers") },
  ];
  const careLinks = [
    { href: "/about", label: t("footer.aboutRne") },
    { href: "/faq", label: t("footer.faq") },
    { href: "/shipping-policy", label: t("footer.shippingPolicy") },
    { href: "/return-policy", label: t("footer.returns") },
    { href: "/terms", label: t("footer.terms") },
  ];

  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Top grid */}
        <div className={styles.top}>
          {/* Brand block */}
          <div className={styles.brandCol}>
            <LogoRNE light size="lg" />
            <p className={styles.tag}>{t("footer.tag")}</p>
            <div className={styles.social} aria-label={t("footer.followUs")}>
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={styles.socialLink}
                >
                  {ICONS[s.id]}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className={styles.linksWrap}>
            <nav className={styles.col} aria-label={t("footer.navigation")}>
              <h4>{t("footer.navigation")}</h4>
              <ul>
                {navLinks.map((l) => (
                  <li key={l.label}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </nav>

            <nav className={styles.col} aria-label={t("footer.customerCare")}>
              <h4>{t("footer.customerCare")}</h4>
              <ul>
                {careLinks.map((l) => (
                  <li key={l.label}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </nav>

            <div className={styles.col}>
              <h4>{t("footer.contact")}</h4>
              <ul>
                <li>
                  <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    {t("footer.callWhatsapp")}: +{contact.whatsapp}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <div className={styles.copy}>
            {/* Secret admin trigger: tap RNE 3× then enter 000 */}
            <FooterAdminTrigger />
            <div className={styles.copyText}>
              <p className={styles.copyright} dir="rtl">{t("footer.copyright")}</p>
              <p className={styles.dev} dir="ltr">{t("footer.developedBy")}</p>
            </div>
          </div>

          <div className={styles.developer} aria-label="Developed by JOE INDUSTRIES">
            <LogoJoe height={34} />
          </div>
        </div>
      </div>
    </footer>
  );
}
