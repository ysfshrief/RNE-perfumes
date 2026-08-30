"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import ProductCard from "./ProductCard";
import { ArrowUpRight } from "./icons";
import styles from "./ProductRow.module.css";

/**
 * Editorial product section used for Featured Fragrances and each Collection.
 * Always driven by real product data — the caller passes an already-filtered
 * list, and the section renders nothing when that list is empty so we never
 * ship decorative empty sections.
 */
export default function ProductRow({ eyebrow, title, lead, products, href = "/shop", id }) {
  const { t } = useLang();
  if (!products || products.length === 0) return null;

  return (
    <section className={`section ${styles.wrap}`} id={id} aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="container">
        <header className={styles.head}>
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 id={id ? `${id}-title` : undefined} className={`editorial editorial--section ${styles.title}`}>
              {title}
            </h2>
            {lead && <p className={styles.lead}>{lead}</p>}
          </div>
          <Link href={href} className={styles.all}>
            <span>{t("common.viewAll")}</span>
            <ArrowUpRight size={16} className={styles.allArrow} />
          </Link>
        </header>

        <div className={styles.grid}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
