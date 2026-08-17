"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import WhatsApp from "@/components/WhatsApp";
import { products, categories, getMinPrice } from "@/data/products";
import { pName, pTagline } from "@/data/productLocale";
import { useLang } from "@/context/LangContext";
import styles from "./shop.module.css";

const SIZES = ["30ml", "50ml"];

export default function ShopClient() {
  const params = useSearchParams();
  const { t, lang } = useLang();
  const initialCat = params.get("category");
  const offersOnly = params.get("offers") === "true";

  const [search, setSearch] = useState("");
  const [activeCats, setActiveCats] = useState(initialCat ? [initialCat] : []);
  const [activeSizes, setActiveSizes] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1400);
  const [bestOnly, setBestOnly] = useState(false);
  const [saleOnly, setSaleOnly] = useState(offersOnly);
  const [sort, setSort] = useState("featured");
  const [drawer, setDrawer] = useState(false);

  const SORTS = [
    { v: "featured", l: t("sort.featured") },
    { v: "price-asc", l: t("sort.priceAsc") },
    { v: "price-desc", l: t("sort.priceDesc") },
    { v: "rating", l: t("sort.rating") },
  ];
  const catLabels = { Men: t("g.Men"), Women: t("g.Women"), Summer: t("s.Summer"), Winter: t("s.Winter") };

  useEffect(() => {
    if (initialCat) setActiveCats([initialCat]);
    if (offersOnly) setSaleOnly(true);
  }, [initialCat, offersOnly]);

  const toggle = (list, setList, val) =>
    setList(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);

  const filtered = useMemo(() => {
    let out = products.filter((p) => {
      const haystack = `${p.name} ${p.tagline} ${p.gender} ${pName(p, "ar")} ${pTagline(p, "ar")}`.toLowerCase();
      if (search && !haystack.includes(search.toLowerCase())) return false;
      if (activeCats.length) {
        const inCat = activeCats.some((c) => p.gender === c || p.season.includes(c));
        if (!inCat) return false;
      }
      if (activeSizes.length) {
        const hasSize = p.sizes.some((s) => activeSizes.includes(s.size));
        if (!hasSize) return false;
      }
      if (minRating && p.rating < minRating) return false;
      if (getMinPrice(p) > maxPrice) return false;
      if (bestOnly && !p.bestSeller) return false;
      if (saleOnly && !p.sizes.some((s) => s.oldPrice)) return false;
      return true;
    });

    switch (sort) {
      case "price-asc": out = [...out].sort((a, b) => getMinPrice(a) - getMinPrice(b)); break;
      case "price-desc": out = [...out].sort((a, b) => getMinPrice(b) - getMinPrice(a)); break;
      case "rating": out = [...out].sort((a, b) => b.rating - a.rating); break;
      default: out = [...out].sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    }
    return out;
  }, [search, activeCats, activeSizes, minRating, maxPrice, bestOnly, saleOnly, sort]);

  const clearAll = () => {
    setActiveCats([]); setActiveSizes([]); setMinRating(0);
    setMaxPrice(1400); setBestOnly(false); setSaleOnly(false); setSearch("");
  };

  const Filters = (
    <>
      <div className={styles.filterGroup}>
        <h4>{t("common.search")}</h4>
        <input
          className={styles.searchInput}
          type="search"
          placeholder={t("shop.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.filterGroup}>
        <h4>{t("shop.category")}</h4>
        {categories.map((c) => (
          <label key={c} className={styles.check}>
            <input type="checkbox" checked={activeCats.includes(c)} onChange={() => toggle(activeCats, setActiveCats, c)} />
            <span>{catLabels[c]}</span>
          </label>
        ))}
      </div>

      <div className={styles.filterGroup}>
        <h4>{t("shop.size")}</h4>
        <div className={styles.pills}>
          {SIZES.map((s) => (
            <button
              key={s}
              className={`${styles.pill} ${activeSizes.includes(s) ? styles.pillOn : ""}`}
              onClick={() => toggle(activeSizes, setActiveSizes, s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <h4>{t("shop.maxPrice")} — {maxPrice} {t("common.currency")}</h4>
        <input
          type="range" min="600" max="1400" step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className={styles.range}
        />
      </div>

      <div className={styles.filterGroup}>
        <h4>{t("shop.minRating")}</h4>
        <div className={styles.pills}>
          {[0, 4, 4.5].map((r) => (
            <button
              key={r}
              className={`${styles.pill} ${minRating === r ? styles.pillOn : ""}`}
              onClick={() => setMinRating(r)}
            >
              {r === 0 ? t("shop.any") : `${r}★+`}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.check}>
          <input type="checkbox" checked={bestOnly} onChange={() => setBestOnly((v) => !v)} />
          <span>{t("shop.bestOnly")}</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" checked={saleOnly} onChange={() => setSaleOnly((v) => !v)} />
          <span>{t("shop.saleOnly")}</span>
        </label>
      </div>

      <button className="btn btn--ghost btn--full" onClick={clearAll}>{t("shop.clearFilters")}</button>
    </>
  );

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <p className="eyebrow">{t("shop.eyebrow")}</p>
          <h1 className={styles.title}>{t("shop.title")}</h1>
          <p className={styles.sub}>{t("shop.count", { shown: filtered.length, total: products.length })}</p>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        <aside className={styles.sidebar}>{Filters}</aside>

        <div className={styles.main}>
          <div className={styles.toolbar}>
            <button className={styles.filterBtn} onClick={() => setDrawer(true)}>
              {t("shop.filters")}
            </button>
            <select className={styles.sort} value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>{t("shop.noMatch")}</p>
              <button className="btn btn--solid" onClick={clearAll}>{t("shop.resetFilters")}</button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {drawer && (
        <div className={styles.drawerWrap} onClick={() => setDrawer(false)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHead}>
              <h3>{t("shop.filters")}</h3>
              <button onClick={() => setDrawer(false)} aria-label={t("common.close")}>✕</button>
            </div>
            {Filters}
            <button className="btn btn--solid btn--full" onClick={() => setDrawer(false)}>
              {t("shop.showResults", { n: filtered.length })}
            </button>
          </div>
        </div>
      )}

      <WhatsApp />
    </>
  );
}
