"use client";

import { useMemo } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductRow from "@/components/ProductRow";
import Discovery from "@/components/Discovery";
import BrandStory from "@/components/BrandStory";
import TestPackageBanner from "@/components/TestPackageBanner";
import Hero from "@/components/Hero";
import WhatsApp from "@/components/WhatsApp";
import AdSlider from "@/components/AdSlider";
import SpinWheel from "@/components/SpinWheel";
import { ArrowUpRight } from "@/components/icons";
import { useProducts, normalizeImageUrl } from "@/context/ProductContext";
import { useLang } from "@/context/LangContext";
import { useConfig } from "@/context/ConfigContext";
import { COLLECTIONS, collectionKeys } from "@/data/productMeta";
import styles from "./home.module.css";

export default function HomePage() {
  const { t, lang } = useLang();
  const { visibleProducts } = useProducts();
  const { config } = useConfig();
  const products = useMemo(() => visibleProducts.filter((p) => !p.isDiscoverySet), [visibleProducts]);
  const testPackage = visibleProducts.find((p) => p.isDiscoverySet);
  const featured = products.filter((p) => p.bestSeller).slice(0, 3);
  const fresh = products.slice(0, 4);

  // Collections come from the same model as the shop's "Collection" filter
  // (Floral / Woody / Fresh / Warm), so a row and its "View all" link always
  // show the same products. Rows need at least 2 products; max 3 rows.
  const collections = useMemo(() => {
    return COLLECTIONS
      .map((c) => ({
        key: c.key,
        title: lang === "ar" ? c.ar : c.en,
        items: products.filter((p) => collectionKeys(p).includes(c.key)).slice(0, 3),
      }))
      .filter((c) => c.items.length >= 2)
      .slice(0, 3);
  }, [products, lang]);

  const cats = (config.categories || []).map((c) => ({
    label: lang === "ar" ? c.label : c.labelEn,
    href: `/shop?${["Men", "Women", "Unisex"].includes(c.key) ? "gender" : "season"}=${c.key}`,
    c: c.color,
    img: c.image ? normalizeImageUrl(c.image, 800) : null,
  }));

  return (
    <>
      <Hero />

      <AdSlider />

      <section className={styles.catStrip}>
        <div className="container">
          <h2 className={`rule rule--lg ${styles.collectionRule}`}>{t("home.theCollection")}</h2>
          <div className={styles.cats}>
            {cats.map((cat) => (
              <Link key={cat.href} href={cat.href} className={styles.cat} style={{ "--c": cat.c }} data-zoom>
                {cat.img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cat.img} alt="" className={styles.catImg} loading="lazy" decoding="async"
                    onError={(e) => { e.currentTarget.style.display = "none"; }} />
                )}
                <span className={styles.catText}>
                  <span className={styles.catLabel}>{cat.label}</span>
                  <span className={styles.catCta}>{t("home.shopCat")}</span>
                </span>
                <span className={styles.catArrow} aria-hidden="true"><ArrowUpRight size={18} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ProductRow
        id="featured"
        eyebrow={t("home.bestSellers")}
        title={t("home.mostLoved")}
        products={featured}
        href="/shop"
      />

      {testPackage && (
        <section className="section container">
          <TestPackageBanner product={testPackage} />
        </section>
      )}

      <Discovery />

      {collections.map((c) => (
        <ProductRow
          key={c.key}
          id={`collection-${c.key}`}
          eyebrow={t("collection.label")}
          title={c.title}
          products={c.items}
          href={`/shop?family=${c.key}`}
        />
      ))}

      <BrandStory />

      <section className={styles.editorial}>
        <div className="container">
          <div className={styles.editorialInner}>
            <div>
              <p className={styles.editEyebrow}>{t("home.theStandard")}</p>
              <h2 className={styles.editTitle}>{t("home.standardTitle")}</h2>
            </div>
            <div className={styles.editCols}>
              <div className={styles.editItem}>
                <span className={styles.editNum}>01</span>
                <h4>{t("home.feat1Title")}</h4>
                <p>{t("home.feat1Text")}</p>
              </div>
              <div className={styles.editItem}>
                <span className={styles.editNum}>02</span>
                <h4>{t("home.feat2Title")}</h4>
                <p>{t("home.feat2Text")}</p>
              </div>
              <div className={styles.editItem}>
                <span className={styles.editNum}>03</span>
                <h4>{t("home.feat3Title")}</h4>
                <p>{t("home.feat3Text")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className={styles.sectionHead}>
          <div>
            <p className="eyebrow">{t("home.theRange")}</p>
            <h2 className={styles.sectionTitle}>{t("home.exploreEvery")}</h2>
          </div>
          <Link href="/shop" className="link-pill">
            <span>{t("common.viewAll")}</span>
            <ArrowUpRight size={16} className="link-pill__arrow" />
          </Link>
        </div>
        <div className={styles.grid4}>
          {fresh.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <SpinWheel />
      <WhatsApp />
    </>
  );
}
