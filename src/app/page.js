"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import TestPackageBanner from "@/components/TestPackageBanner";
import WhatsApp from "@/components/WhatsApp";
import AdSlider from "@/components/AdSlider";
import SpinWheel from "@/components/SpinWheel";
import { useProducts } from "@/context/ProductContext";
import { useLang } from "@/context/LangContext";
import styles from "./home.module.css";

export default function HomePage() {
  const { t } = useLang();
  const { visibleProducts } = useProducts();
  const products = visibleProducts.filter((p) => !p.isDiscoverySet);
  const testPackage = visibleProducts.find((p) => p.isDiscoverySet);
  const featured = products.filter((p) => p.bestSeller).slice(0, 3);
  const fresh = products.slice(0, 4);

  const cats = [
    { label: t("home.forMen"), href: "/shop?category=Men", c: "#26302b" },
    { label: t("home.forWomen"), href: "/shop?category=Women", c: "#7a4b52" },
    { label: t("home.summer"), href: "/shop?category=Summer", c: "#3d5a6b" },
    { label: t("home.winter"), href: "/shop?category=Winter", c: "#8f6a30" },
  ];

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.heroEyebrow}>{t("home.heroEyebrow")}</p>
          <h1 className={styles.heroTitle}>
            {t("home.heroTitle1")} <em>{t("home.heroTitleEm")}</em>
            <br /> {t("home.heroTitle2")}
          </h1>
          <p className={styles.heroLead}>{t("home.heroLead")}</p>
          <div className={styles.heroActions}>
            <Link href="/shop" className="btn btn--solid">{t("home.shopCollection")}</Link>
            <Link href="/shop?offers=true" className="btn btn--ghost">{t("home.viewOffers")}</Link>
          </div>
        </div>
        <div className={`${styles.heroMark} keep-latin`} aria-hidden="true">RNE</div>
      </section>

      <AdSlider />

      <section className={styles.catStrip}>
        <div className="container">
          <div className="rule">{t("home.theCollection")}</div>
          <div className={styles.cats}>
            {cats.map((cat) => (
              <Link key={cat.href} href={cat.href} className={styles.cat} style={{ "--c": cat.c }}>
                <span>{cat.label}</span>
                <span className={styles.catArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className={styles.sectionHead}>
          <div>
            <p className="eyebrow">{t("home.bestSellers")}</p>
            <h2 className={styles.sectionTitle}>{t("home.mostLoved")}</h2>
          </div>
          <Link href="/shop" className={styles.seeAll}>{t("common.viewAll")}</Link>
        </div>
        <div className={styles.grid}>
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {testPackage && (
        <section className="section container">
          <TestPackageBanner product={testPackage} />
        </section>
      )}

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
