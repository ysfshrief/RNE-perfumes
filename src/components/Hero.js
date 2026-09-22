"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { useConfig } from "@/context/ConfigContext";
import { useProducts } from "@/context/ProductContext";
import { normalizeImageUrl } from "@/lib/media";
import { resolveHeroSlides, heroInterval } from "@/lib/heroSlides";
import { getMinPrice } from "@/data/products";
import { pName } from "@/data/productLocale";
import FadingVideo from "./FadingVideo";
import HeroSlideshow from "./HeroSlideshow";
import { ArrowUpRight } from "./icons";
import styles from "./Hero.module.css";

/**
 * Cinematic campaign hero.
 * Media comes from Admin → Homepage (an ordered list of images, or an
 * optional video). Copy comes from the content system, so it is editable per
 * language. The price/notes cluster uses real product data.
 */
export default function Hero() {
  const { t, lang } = useLang();
  const { config } = useConfig();
  const { visibleProducts } = useProducts();

  const heroCfg = config.hero || {};
  const slides = resolveHeroSlides(heroCfg);
  const video = heroCfg.video ? normalizeImageUrl(heroCfg.video) : "";
  const overlay = Math.min(90, Math.max(20, Number(heroCfg.overlay ?? 55))) / 100;
  const ctaHref = heroCfg.ctaHref || "/shop";
  const showProduct = heroCfg.showProduct !== false;

  const pool = visibleProducts.filter((p) => !p.isDiscoverySet);
  const pinned = heroCfg.productSlug ? pool.find((p) => p.slug === heroCfg.productSlug) : null;
  const product = showProduct ? pinned || pool.find((p) => p.bestSeller) || pool[0] || null : null;

  const notes = product
    ? [...(product.notes?.top || []), ...(product.notes?.heart || []), ...(product.notes?.base || [])].slice(0, 5)
    : [];

  return (
    <section className={styles.hero} aria-labelledby="hero-title" style={{ "--scrim": overlay }}>
      <div className={styles.media}>
        {video ? (
          <FadingVideo src={video} poster={slides[0]?.url} alt="" fit="cover" className={styles.mediaInner} />
        ) : (
          <HeroSlideshow
            slides={slides}
            interval={heroInterval(heroCfg)}
            label={t("home.heroEyebrow")}
            dotsLabel={lang === "ar" ? "صورة" : "Image"}
          />
        )}
        {/* Directional scrim sized to where the copy sits — keeps the text
            legible on any photo without flattening the whole image. */}
        <div className={styles.scrim} aria-hidden="true" />
      </div>

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{t("home.heroEyebrow")}</p>

          <h1 id="hero-title" className={styles.title}>
            <span className={styles.titleBright}>{t("home.heroTitle1")}</span>
            <span className={styles.titleMuted}>{t("home.heroTitleEm")}</span>
          </h1>

          <p className={styles.lead}>{t("home.heroLead")}</p>

          <div className={styles.actions}>
            <Link href={ctaHref} className={styles.cta}>
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

        {notes.length > 0 && (
          <div className={styles.notes}>
            <ul className={styles.noteList} aria-label={pName(product, lang)}>
              {notes.map((n) => (
                <li key={n} className={styles.notePill}>{n}</li>
              ))}
            </ul>
            <Link
              href={`/product/${product.slug}`}
              className={styles.noteAction}
              aria-label={`${t("common.view")} — ${pName(product, lang)}`}
            >
              <ArrowUpRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
