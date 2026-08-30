"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { useConfig } from "@/context/ConfigContext";
import { useProducts, normalizeImageUrl } from "@/context/ProductContext";
import { getMinPrice } from "@/data/products";
import { pName } from "@/data/productLocale";
import FadingVideo from "./FadingVideo";
import { ArrowUpRight } from "./icons";
import styles from "./Hero.module.css";

/**
 * Cinematic campaign hero.
 * Media (image or video) comes from site settings — never hardcoded.
 * A hero product can optionally be pinned in settings; otherwise the first
 * best-seller from the live product data is used, so the price and note pills
 * are always real product data rather than decoration.
 */
export default function Hero() {
  const { t, lang } = useLang();
  const { config } = useConfig();
  const { visibleProducts } = useProducts();

  const heroCfg = config.hero || {};
  const pool = visibleProducts.filter((p) => !p.isDiscoverySet);
  const pinned = heroCfg.productSlug
    ? pool.find((p) => p.slug === heroCfg.productSlug)
    : null;
  const product = pinned || pool.find((p) => p.bestSeller) || pool[0] || null;

  const poster = heroCfg.image ? normalizeImageUrl(heroCfg.image) : null;
  const video = heroCfg.video ? normalizeImageUrl(heroCfg.video) : "";

  // Real fragrance notes → the pill row in the reference composition
  const notes = product
    ? [
        ...(product.notes?.top || []),
        ...(product.notes?.heart || []),
        ...(product.notes?.base || []),
      ].slice(0, 5)
    : [];

  return (
    <section className={styles.hero} aria-label={t("home.heroEyebrow")}>
      {/* Full-bleed cinematic media — no global dark overlay */}
      <div className={styles.media} aria-hidden="true">
        <FadingVideo
          src={video}
          poster={poster}
          alt=""
          fit="cover"
          className={styles.mediaInner}
        />
        {/* Local, directional scrim only where type sits — keeps the image cinematic */}
        <div className={styles.scrim} />
      </div>

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={`eyebrow ${styles.eyebrow}`}>{t("home.heroEyebrow")}</p>

          <h1 className={styles.title}>
            <span className={styles.titleBright}>{t("home.heroTitle1")}</span>
            <span className={styles.titleMuted}>{t("home.heroTitleEm")}</span>
          </h1>

          <p className={styles.lead}>{t("home.heroLead")}</p>

          <div className={styles.actions}>
            <Link href="/shop" className={styles.cta}>
              <span>{t("home.shopCollection")}</span>
              <ArrowUpRight size={18} className={styles.ctaArrow} />
            </Link>

            {product && (
              <Link href={`/product/${product.slug}`} className={styles.priceTag}>
                <span className={styles.priceFrom}>{t("product.from")}</span>
                <span className={styles.priceValue}>
                  {getMinPrice(product)} {t("common.currency")}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Note pills — real notes from the featured product */}
        {notes.length > 0 && (
          <div className={styles.notes}>
            <ul className={styles.noteList}>
              {notes.map((n) => (
                <li key={n} className="pill">{n}</li>
              ))}
            </ul>
            {product && (
              <Link
                href={`/product/${product.slug}`}
                className={styles.noteAction}
                aria-label={`${t("common.view")} — ${pName(product, lang)}`}
              >
                <ArrowUpRight size={18} />
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
