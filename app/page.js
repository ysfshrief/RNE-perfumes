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
import { useProducts, normalizeImageUrl } from "@/context/ProductContext";
import { useLang } from "@/context/LangContext";
import { useConfig } from "@/context/ConfigContext";
import { familyKeys } from "@/data/productMeta";
import styles from "./home.module.css";

export default function HomePage() {
  const { t, lang } = useLang();
  const { visibleProducts } = useProducts();
  const { config } = useConfig();
  const products = visibleProducts.filter((p) => !p.isDiscoverySet);
  const testPackage = visibleProducts.find((p) => p.isDiscoverySet);
  const featured = products.filter((p) => p.bestSeller).slice(0, 3);
  const fresh = products.slice(0, 4);

  // Collections are derived from the live catalogue. A collection is only
  // rendered when it actually has products, so no empty decorative sections.
  const collections = useMemo(() => {
    const byFamily = (key) => products.filter((p) => familyKeys(p).includes(key));
    const candidates = [
      { key: "oud",    title: lang === "ar" ? "العود" : "Oud",    items: byFamily("oud") },
      { key: "woody",  title: lang === "ar" ? "الأخشاب" : "Woody", items: byFamily("woody") },
      { key: "floral", title: lang === "ar" ? "الزهور" : "Floral", items: byFamily("floral") },
      { key: "fresh",  title: lang === "ar" ? "المنعش" : "Fresh",  items: [...byFamily("fresh"), ...byFamily("citrus")] },
      { key: "summer", title: lang === "ar" ? "صيفي" : "Summer",  items: products.filter((p) => (p.season || []).includes("Summer")), category: "Summer" },
      { key: "winter", title: lang === "ar" ? "شتوي" : "Winter",  items: products.filter((p) => (p.season || []).includes("Winter")), category: "Winter" },
    ];
    // De-duplicate items inside each collection, require at least 2 products,
    // and cap the homepage at three collections so the page stays editorial.
    return candidates
      .map((c) => ({ ...c, items: [...new Map(c.items.map((p) => [p.id, p])).values()].slice(0, 3) }))
      .filter((c) => c.items.length >= 2)
      .slice(0, 3);
  }, [products, lang]);

  const cats = (config.categories || []).map((c) => ({
    label: lang === "ar" ? c.label : c.labelEn,
    href: `/shop?category=${c.key}`,
    c: c.color,
    img: c.image ? normalizeImageUrl(c.image) : null,
  }));

  return (
    <>
      <Hero />

      <AdSlider />

      <section className={styles.catStrip}>
        <div className="container">
          <div className="rule">{t("home.theCollection")}</div>
          <div className={styles.cats}>
            {cats.map((cat) => (
              <Link key={cat.href} href={cat.href} className={styles.cat} style={{ "--c": cat.c }}>
                {cat.img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cat.img} alt="" className={styles.catImg} />
                )}
                <span className={styles.catLabel}>{cat.label}</span>
                <span className={styles.catArrow}>→</span>
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
          href={`/shop?category=${c.category || ""}`}
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
          <Link href="/shop" className={styles.seeAll}>{t("common.viewAll")}</Link>
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
