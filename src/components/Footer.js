import Link from "next/link";
import Logo from "./Logo";
import styles from "./Footer.module.css";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Fragrances" },
      { href: "/shop?category=Men", label: "For Men" },
      { href: "/shop?category=Women", label: "For Women" },
      { href: "/shop?offers=true", label: "Offers" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/shipping-policy", label: "Shipping Policy" },
      { href: "/return-policy", label: "Returns & Refunds" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Brand",
    links: [
      { href: "/about", label: "About RNE" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/account", label: "My Account" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo light />
            <p className={styles.tag}>
              Premium fragrances, composed with intent. Crafted for those who
              wear scent as signature.
            </p>
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
          <p>جميع الحقوق محفوظة RNE perfumes</p>
          <p>Developed &amp; designed by : Youssef Shrief</p>
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
