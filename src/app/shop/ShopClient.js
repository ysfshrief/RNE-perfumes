"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import WhatsApp from "@/components/WhatsApp";
import { products, categories, getMinPrice, isInStock } from "@/data/products";
import styles from "./shop.module.css";

const SIZES = ["30ml", "50ml"];
const SORTS = [
  { v: "featured", l: "Featured" },
  { v: "price-asc", l: "Price: Low to High" },
  { v: "price-desc", l: "Price: High to Low" },
  { v: "rating", l: "Top Rated" },
];

export default function ShopClient() {
  const params = useSearchParams();
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

  useEffect(() => {
    if (initialCat) setActiveCats([initialCat]);
    if (offersOnly) setSaleOnly(true);
  }, [initialCat, offersOnly]);

  const toggle = (list, setList, val) =>
    setList(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);

  const filtered = useMemo(() => {
    let out = products.filter((p) => {
      if (search && !`${p.name} ${p.tagline} ${p.gender}`.toLowerCase().includes(search.toLowerCase()))
        return false;
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
        <h4>Search</h4>
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search fragrances…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.filterGroup}>
        <h4>Category</h4>
        {categories.map((c) => (
          <label key={c} className={styles.check}>
            <input type="checkbox" checked={activeCats.includes(c)} onChange={() => toggle(activeCats, setActiveCats, c)} />
            <span>{c}</span>
          </label>
        ))}
      </div>

      <div className={styles.filterGroup}>
        <h4>Size</h4>
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
        <h4>Max Price — {maxPrice} EGP</h4>
        <input
          type="range" min="600" max="1400" step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className={styles.range}
        />
      </div>

      <div className={styles.filterGroup}>
        <h4>Minimum Rating</h4>
        <div className={styles.pills}>
          {[0, 4, 4.5].map((r) => (
            <button
              key={r}
              className={`${styles.pill} ${minRating === r ? styles.pillOn : ""}`}
              onClick={() => setMinRating(r)}
            >
              {r === 0 ? "Any" : `${r}★+`}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.check}>
          <input type="checkbox" checked={bestOnly} onChange={() => setBestOnly((v) => !v)} />
          <span>Best Sellers only</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" checked={saleOnly} onChange={() => setSaleOnly((v) => !v)} />
          <span>On Offer only</span>
        </label>
      </div>

      <button className="btn btn--ghost btn--full" onClick={clearAll}>Clear filters</button>
    </>
  );

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <p className="eyebrow">The Collection</p>
          <h1 className={styles.title}>Shop all fragrances</h1>
          <p className={styles.sub}>{filtered.length} of {products.length} products</p>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        <aside className={styles.sidebar}>{Filters}</aside>

        <div className={styles.main}>
          <div className={styles.toolbar}>
            <button className={styles.filterBtn} onClick={() => setDrawer(true)}>
              Filters
            </button>
            <select className={styles.sort} value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>No fragrances match these filters.</p>
              <button className="btn btn--solid" onClick={clearAll}>Reset filters</button>
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
              <h3>Filters</h3>
              <button onClick={() => setDrawer(false)} aria-label="Close">✕</button>
            </div>
            {Filters}
            <button className="btn btn--solid btn--full" onClick={() => setDrawer(false)}>
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}

      <WhatsApp />
    </>
  );
}
