"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { useProducts } from "@/context/ProductContext";
import { useShop } from "@/context/ShopContext";
import { pName } from "@/data/productLocale";
import { testerCount, localNum } from "@/data/products";
import ProductImage from "./ProductImage";
import styles from "./ScentPicker.module.css";

/**
 * Test Package builder: the customer taps exactly N different fragrances
 * (N = product.testerCount, admin-editable). Selection is stored on the cart
 * line and carried into the order so the store knows what to pack.
 */
export default function ScentPicker({ product }) {
  const { t, lang } = useLang();
  const { visibleProducts } = useProducts();
  const { dispatch } = useShop();
  const count = testerCount(product);
  const [picked, setPicked] = useState([]); // product ids, in tap order
  const [added, setAdded] = useState(false);
  const [hint, setHint] = useState("");

  const excluded = useMemo(() => new Set(product.testerExclude || []), [product.testerExclude]);
  const scents = useMemo(
    () => visibleProducts.filter((p) => !p.isDiscoverySet && !excluded.has(p.id)),
    [visibleProducts, excluded]
  );

  // Drop selections that are no longer available (hidden by the admin).
  useEffect(() => {
    setPicked((list) => {
      const next = list.filter((id) => scents.some((s) => s.id === id)).slice(0, count);
      return next.length === list.length ? list : next;
    });
  }, [scents, count]);

  const n = (x) => localNum(x, lang);
  const remaining = count - picked.length;
  const complete = remaining === 0;
  const size = product.sizes?.[0];
  const soldOut = !size || Number(size.stock) <= 0;

  const toggle = (id) => {
    setAdded(false);
    if (picked.includes(id)) {
      setHint("");
      setPicked(picked.filter((x) => x !== id));
    } else if (picked.length >= count) {
      setHint(t("discovery.maxReached", { n: n(count) }));
    } else {
      setHint("");
      setPicked([...picked, id]);
    }
  };

  const addToCart = () => {
    if (!complete || soldOut) return;
    const selectedScents = picked
      .map((id) => scents.find((s) => s.id === id))
      .filter(Boolean)
      .map((s) => ({ id: s.id, name: s.name, nameAr: pName(s, "ar") }));
    if (selectedScents.length !== count) return;
    dispatch({ type: "ADD_TO_CART", payload: { product, size, qty: 1, selectedScents } });
    setAdded(true);
    setPicked([]);
  };

  return (
    <div className={styles.picker}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t("discovery.title", { n: n(count) })}</h3>
        <p className={styles.subtitle}>{t("discovery.subtitle", { n: n(count) })}</p>
      </div>

      {/* Progress: filled dots = chosen testers */}
      <div className={styles.progress} aria-live="polite">
        <div className={styles.dots} aria-hidden="true">
          {Array.from({ length: count }, (_, i) => (
            <span key={i} className={`${styles.dot} ${i < picked.length ? styles.dotOn : ""}`} />
          ))}
        </div>
        <span className={complete ? styles.statusDone : styles.statusPending}>
          {complete
            ? t("discovery.complete", { n: n(count) })
            : t("discovery.selected", { n: n(picked.length), total: n(count) })}
        </span>
      </div>

      {picked.length > 0 && (
        <div className={styles.chosen}>
          <span className={styles.chosenLabel}>{t("discovery.yourSet")}</span>
          <ul className={styles.chips}>
            {picked.map((id, i) => {
              const s = scents.find((x) => x.id === id);
              if (!s) return null;
              return (
                <li key={id}>
                  <button type="button" className={styles.chip} onClick={() => toggle(id)} aria-label={`${pName(s, lang)} — ${lang === "ar" ? "إزالة" : "remove"}`}>
                    <span className={styles.chipNum}>{n(i + 1)}</span>
                    {pName(s, lang)}
                    <span aria-hidden="true" className={styles.chipX}>×</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button type="button" className={styles.clear} onClick={() => { setPicked([]); setHint(""); }}>
            {t("discovery.clear")}
          </button>
        </div>
      )}

      <ul className={styles.grid} aria-label={t("discovery.title", { n: n(count) })}>
        {scents.map((s) => {
          const on = picked.includes(s.id);
          const disabled = !on && picked.length >= count;
          return (
            <li key={s.id}>
              <button
                type="button"
                className={`${styles.option} ${on ? styles.optionOn : ""} ${disabled ? styles.optionMuted : ""}`}
                aria-pressed={on}
                onClick={() => toggle(s.id)}
              >
                <span className={styles.thumb}><ProductImage product={s} width={200} alt="" showLabel={false} /></span>
                <span className={styles.optionText}>
                  <span className={styles.optionName}>{pName(s, lang)}</span>
                  {s.inspiredBy && <span className={`${styles.optionMeta} keep-latin`}>{s.inspiredBy}</span>}
                </span>
                <span className={styles.check} aria-hidden="true">{on ? "✓" : "+"}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {hint && <p className={styles.hint} role="status">{hint}</p>}

      <button
        type="button"
        className={`btn btn--solid btn--full ${styles.addBtn} ${added ? styles.addBtnDone : ""}`}
        onClick={addToCart}
        disabled={(!complete && !added) || soldOut}
      >
        {soldOut
          ? t("product.soldOut")
          : added
          ? t("discovery.added")
          : complete
          ? t("discovery.addToCart")
          : t("discovery.selectAll", { n: n(remaining) })}
      </button>
      {added && (
        <Link href="/cart" className={styles.viewCart}>{t("discovery.viewCart")}</Link>
      )}
    </div>
  );
}
