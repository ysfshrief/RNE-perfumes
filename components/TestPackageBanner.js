"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { pName, pTagline } from "@/data/productLocale";
import ProductImage from "./ProductImage";
import styles from "./TestPackageBanner.module.css";

// A distinct, wide horizontal feature card for the Test Package —
// visually separated from the regular product grid, like a special service.
export default function TestPackageBanner({ product }) {
  const { t, lang } = useLang();
  const price = product.sizes[0].price;
  const cur = t("common.currency");

  return (
    <Link href={`/product/${product.slug}`} className={styles.banner}>
      <div className={styles.media}>
        <ProductImage product={product} index={0} showLabel={false} />
        <span className={styles.tag}>{t("discovery.badge")}</span>
      </div>

      <div className={styles.body}>
        <span className={styles.eyebrow}>{t("discovery.service")}</span>
        <h3 className={styles.name}>{pName(product, lang)}</h3>
        <p className={styles.desc}>{pTagline(product, lang)}</p>

        <div className={styles.foot}>
          <div className={styles.priceWrap}>
            <span className={styles.from}>{t("discovery.from")}</span>
            <span className={styles.price}>{price} {cur}</span>
          </div>
          <span className={styles.cta}>
            {t("discovery.build")}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.arrow}>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
