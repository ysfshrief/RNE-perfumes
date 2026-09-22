"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import TestPackageBanner from "@/components/TestPackageBanner";
import WhatsApp from "@/components/WhatsApp";
import { getMinPrice } from "@/data/products";
import { pName, pTagline } from "@/data/productLocale";
import { COLLECTIONS, collectionKeys, collectionLabel } from "@/data/productMeta";
import { useLang } from "@/context/LangContext";
import { useProducts } from "@/context/ProductContext";
import styles from "./shop.module.css";

const GENDERS = ["Men", "Women", "Unisex"];
const SEASONS = ["Summer", "Winter"];
const FAMILIES = COLLECTIONS.map((c) => c.key);

const list = (v) => (v ? String(v).split(",").map((x) => x.trim()).filter(Boolean) : []);

/**
 * Read filters from the URL. The URL is the single source of truth, so a
 * filtered view can be shared, survives refresh, and the back button undoes
 * the last filter change. Legacy links (?category=Men, ?offers=true) still work.
 */
function readFilters(params) {
  const legacy = list(params.get("category"));
  const gender = [...new Set([...list(params.get("gender")), ...legacy.filter((c) => GENDERS.includes(c))])].filter((g) => GENDERS.includes(g));
  const season = [...new Set([...list(params.get("season")), ...legacy.filter((c) => SEASONS.includes(c))])].filter((s) => SEASONS.includes(s));
  const family = list(params.get("family")).filter((f) => FAMILIES.includes(f));
  const max = Number(params.get("max")) || null;
  return {
    gender,
    season,
    family,
    size: list(params.get("size")),
    q: params.get("q") || "",
    sort: params.get("sort") || "featured",
    sale: params.get("sale") === "1" || params.get("offers") === "true",
    best: params.get("best") === "1",
    max,
  };
}

function writeFilters(f) {
  const p = new URLSearchParams();
  if (f.gender.length) p.set("gender", f.gender.join(","));
  if (f.season.length) p.set("season", f.season.join(","));
  if (f.family.length) p.set("family", f.family.join(","));
  if (f.size.length) p.set("size", f.size.join(","));
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.sort && f.sort !== "featured") p.set("sort", f.sort);
  if (f.sale) p.set("sale", "1");
  if (f.best) p.set("best", "1");
  if (f.max) p.set("max", String(f.max));
  const s = p.toString();
  return s ? `?${s}` : "";
}

export default function ShopClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { t, lang } = useLang();
  const { visibleProducts: products, ready } = useProducts();
  const [drawer, setDrawer] = useState(false);
  const drawerRef = useRef(null);

  const filters = useMemo(() => readFilters(params), [params]);

  // Search box is local while typing, then written to the URL (debounced).
  const [search, setSearch] = useState(filters.q);
  useEffect(() => { setSearch(filters.q); }, [filters.q]);

  const apply = useCallback((patch, { replace = false } = {}) => {
    const next = { ...filters, ...patch };
    const url = `${pathname}${writeFilters(next)}`;
    if (replace) router.replace(url, { scroll: false });
    else router.push(url, { scroll: false });
  }, [filters, pathname, router]);

  useEffect(() => {
    if (search === filters.q) return;
    const id = setTimeout(() => apply({ q: search }, { replace: true }), 300);
    return () => clearTimeout(id);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleIn = (key, val) => {
    const cur = filters[key];
    apply({ [key]: cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val] });
  };

  const SIZES = useMemo(() => {
    const seen = new Set();
    products.filter((p) => !p.isDiscoverySet).forEach((p) => (p.sizes || []).forEach((s) => s?.size && seen.add(s.size)));
    return [...seen].sort((a, b) => (parseInt(a) || 0) - (parseInt(b) || 0));
  }, [products]);

  const priceCeiling = useMemo(() => {
    const top = Math.max(0, ...products.map((p) => getMinPrice(p) || 0));
    return Math.max(100, Math.ceil(top / 50) * 50);
  }, [products]);

  // Does product p pass every filter group except `skip`? (used for counts)
  const passes = useCallback((p, f, skip) => {
    if (skip !== "q" && f.q) {
      const hay = `${p.name} ${p.tagline} ${p.inspiredBy || ""} ${pName(p, "ar")} ${pTagline(p, "ar")}`.toLowerCase();
      if (!hay.includes(f.q.toLowerCase())) return false;
    }
    if (skip !== "gender" && f.gender.length && !f.gender.includes(p.gender)) return false;
    if (skip !== "season" && f.season.length && !(p.season || []).some((s) => f.season.includes(s))) return false;
    if (skip !== "family" && f.family.length && !collectionKeys(p).some((k) => f.family.includes(k))) return false;
    if (skip !== "size" && f.size.length && !(p.sizes || []).some((s) => f.size.includes(s.size))) return false;
    if (f.max && getMinPrice(p) > f.max) return false;
    if (f.best && !p.bestSeller) return false;
    if (f.sale && !(p.sizes || []).some((s) => s.oldPrice)) return false;
    return true;
  }, []);

  // Anything narrower than "everything" hides the Test Package banner (it is
  // not a fragrance, so it cannot match a gender/season/family choice).
  const narrowed = filters.gender.length || filters.season.length || filters.family.length || filters.size.length || filters.q || filters.sale || filters.best || filters.max;

  const regular = useMemo(() => products.filter((p) => !p.isDiscoverySet), [products]);
  const testPackage = !narrowed ? products.find((p) => p.isDiscoverySet) : null;

  const filtered = useMemo(() => {
    let out = regular.filter((p) => passes(p, filters));
    switch (filters.sort) {
      case "price-asc": out = [...out].sort((a, b) => getMinPrice(a) - getMinPrice(b)); break;
      case "price-desc": out = [...out].sort((a, b) => getMinPrice(b) - getMinPrice(a)); break;
      case "rating": out = [...out].sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: out = [...out].sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    }
    return out;
  }, [regular, filters, passes]);

  // How many products this option would show, given the other active groups.
  const countFor = (group, val) =>
    regular.filter((p) => passes(p, { ...filters, [group]: [val] })).length;

  const clearAll = () => { setSearch(""); router.push(pathname, { scroll: false }); };

  // Drawer: Escape closes, background doesn't scroll, focus moves inside.
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e) => e.key === "Escape" && setDrawer(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.querySelector("button, input")?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [drawer]);

  const labelOf = {
    gender: (v) => t(`g.${v}`),
    season: (v) => t(`s.${v}`),
    family: (v) => collectionLabel(v, lang),
    size: (v) => v,
  };

  const activeChips = [
    ...filters.gender.map((v) => ({ group: "gender", v })),
    ...filters.season.map((v) => ({ group: "season", v })),
    ...filters.family.map((v) => ({ group: "family", v })),
    ...filters.size.map((v) => ({ group: "size", v })),
  ];
  const moreActive = filters.size.length + (filters.sale ? 1 : 0) + (filters.best ? 1 : 0) + (filters.max ? 1 : 0);
  const activeCount = activeChips.length + (filters.sale ? 1 : 0) + (filters.best ? 1 : 0) + (filters.max ? 1 : 0);

  // A render helper (not a component) so buttons keep focus across updates.
  const group_ = ({ id, title, group, options }) => (
    <fieldset className={styles.filterGroup}>
      <legend className={styles.groupTitle} id={id}>{title}</legend>
      <div className={styles.options}>
        {options.map((v) => {
          const on = filters[group].includes(v);
          const n = countFor(group, v);
          return (
            <button
              key={v}
              type="button"
              className={`${styles.option} ${on ? styles.optionOn : ""}`}
              aria-pressed={on}
              disabled={!on && n === 0}
              onClick={() => toggleIn(group, v)}
            >
              <span>{labelOf[group](v)}</span>
              <span className={styles.optionCount}>{n}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );

  const Filters = (
    <>
      <div className={styles.filterGroup}>
        <label className={styles.groupTitle} htmlFor="shop-search">{t("common.search")}</label>
        <input
          id="shop-search"
          className={styles.searchInput}
          type="search"
          placeholder={t("shop.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {group_({ id: "f-gender", title: t("shop.gender"), group: "gender", options: GENDERS })}
      {group_({ id: "f-season", title: t("shop.season"), group: "season", options: SEASONS })}
      {group_({ id: "f-family", title: t("shop.family"), group: "family", options: FAMILIES })}

      <details className={styles.more} open={moreActive > 0 || undefined}>
        <summary>{t("shop.more")}{moreActive > 0 ? ` (${moreActive})` : ""}</summary>
        <div className={styles.moreBody}>
          {SIZES.length > 1 && group_({ id: "f-size", title: t("shop.size"), group: "size", options: SIZES })}

          <div className={styles.filterGroup}>
            <label className={styles.groupTitle} htmlFor="shop-price">
              {t("shop.maxPrice")} — <span className="price">{filters.max ? `${filters.max} ${t("common.currency")}` : t("shop.priceAny")}</span>
            </label>
            <input
              id="shop-price"
              type="range"
              min={Math.min(100, priceCeiling)}
              max={priceCeiling}
              step={50}
              value={filters.max ?? priceCeiling}
              onChange={(e) => {
                const v = Number(e.target.value);
                apply({ max: v >= priceCeiling ? null : v }, { replace: true });
              }}
              className={styles.range}
            />
          </div>

          <label className={styles.check}>
            <input type="checkbox" checked={filters.sale} onChange={() => apply({ sale: !filters.sale })} />
            <span>{t("shop.saleOnly")}</span>
          </label>
          <label className={styles.check}>
            <input type="checkbox" checked={filters.best} onChange={() => apply({ best: !filters.best })} />
            <span>{t("shop.bestOnly")}</span>
          </label>
        </div>
      </details>

      {activeCount > 0 && (
        <button type="button" className="btn btn--ghost btn--full" onClick={clearAll}>{t("shop.clearFilters")}</button>
      )}
    </>
  );

  const SORTS = [
    { v: "featured", l: t("sort.featured") },
    { v: "price-asc", l: t("sort.priceAsc") },
    { v: "price-desc", l: t("sort.priceDesc") },
    { v: "rating", l: t("sort.rating") },
  ];

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <p className="eyebrow">{t("shop.eyebrow")}</p>
          <h1 className={styles.title}>{t("shop.title")}</h1>
          <p className={styles.sub} aria-live="polite">{t("shop.count", { shown: filtered.length, total: regular.length })}</p>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        <aside className={styles.sidebar} aria-label={t("shop.filters")}>{Filters}</aside>

        <div className={styles.main}>
          <div className={styles.toolbar}>
            <button type="button" className={styles.filterBtn} onClick={() => setDrawer(true)} aria-expanded={drawer} aria-controls="shop-drawer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
              {t("shop.filters")}{activeCount > 0 && <span className={styles.badge}>{activeCount}</span>}
            </button>
            <label className="sr-only" htmlFor="shop-sort">{t("shop.sortBy")}</label>
            <select id="shop-sort" className={styles.sort} value={filters.sort} onChange={(e) => apply({ sort: e.target.value }, { replace: true })}>
              {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </div>

          {activeChips.length + (filters.sale ? 1 : 0) + (filters.best ? 1 : 0) + (filters.max ? 1 : 0) > 0 && (
            <div className={styles.chips} aria-label={t("shop.active")}>
              {activeChips.map(({ group, v }) => (
                <button key={`${group}-${v}`} type="button" className={styles.chip} onClick={() => toggleIn(group, v)} aria-label={`${labelOf[group](v)} ×`}>
                  {labelOf[group](v)} <span aria-hidden="true">×</span>
                </button>
              ))}
              {filters.sale && <button type="button" className={styles.chip} onClick={() => apply({ sale: false })}>{t("shop.saleOnly")} <span aria-hidden="true">×</span></button>}
              {filters.best && <button type="button" className={styles.chip} onClick={() => apply({ best: false })}>{t("shop.bestOnly")} <span aria-hidden="true">×</span></button>}
              {filters.max && <button type="button" className={styles.chip} onClick={() => apply({ max: null })}><span className="price">≤ {filters.max} {t("common.currency")}</span> <span aria-hidden="true">×</span></button>}
              <button type="button" className={styles.clearLink} onClick={clearAll}>{t("shop.clearFilters")}</button>
            </div>
          )}

          {!ready && products.length === 0 ? (
            <div className={styles.grid} aria-busy="true">
              {Array.from({ length: 6 }, (_, i) => <div key={i} className={styles.skeleton} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>{t("shop.noMatch")}</p>
              <p>{t("shop.noMatchHint")}</p>
              <button type="button" className="btn btn--solid" onClick={clearAll}>{t("shop.resetFilters")}</button>
            </div>
          ) : (
            <>
              {testPackage && (
                <>
                  <TestPackageBanner product={testPackage} />
                  <div className={styles.serviceDivider}>
                    <span>{t("shop.ourFragrances")}</span>
                  </div>
                </>
              )}
              <div className={styles.grid}>
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}
        </div>
      </div>

      {drawer && (
        <div className={styles.drawerWrap} onClick={() => setDrawer(false)}>
          <div
            id="shop-drawer"
            ref={drawerRef}
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-label={t("shop.filters")}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.drawerHead}>
              <h2>{t("shop.filters")}</h2>
              <button type="button" onClick={() => setDrawer(false)} aria-label={t("common.close")}>✕</button>
            </div>
            <div className={styles.drawerBody}>{Filters}</div>
            <div className={styles.drawerFoot}>
              <button type="button" className="btn btn--solid btn--full" onClick={() => setDrawer(false)}>
                {t("shop.showResults", { n: filtered.length })}
              </button>
            </div>
          </div>
        </div>
      )}

      <WhatsApp />
    </>
  );
}
