"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/context/LangContext";
import { useProducts } from "@/context/ProductContext";
import { useShop } from "@/context/ShopContext";
import { pName } from "@/data/productLocale";
import styles from "./ScentPicker.module.css";

// Renders 6 scent selectors for the Discovery Set.
// Each scent can only be picked once (no duplicates).
export default function ScentPicker({ product }) {
  const { t, lang } = useLang();
  const { visibleProducts } = useProducts();
  const { dispatch } = useShop();
  const count = product.testerCount || 6;
  const [selections, setSelections] = useState(Array(count).fill(""));
  const [added, setAdded] = useState(false);

  // Available scents = all non-discovery visible products
  const scents = useMemo(
    () => visibleProducts.filter((p) => !p.isDiscoverySet),
    [visibleProducts]
  );

  const selectedCount = selections.filter(Boolean).length;
  const allSelected = selectedCount === count;

  const handleSelect = (index, value) => {
    setSelections((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  // Check if a scent is already selected in another slot
  const isUsed = (scentId, currentIndex) =>
    selections.some((s, i) => s === scentId && i !== currentIndex);

  const addToCart = () => {
    if (!allSelected) return;
    const size = product.sizes[0];
    const selectedNames = selections
      .map((id) => scents.find((s) => s.id === id))
      .filter(Boolean)
      .map((s) => pName(s, lang));

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product: {
          ...product,
          // Store selected scents in the cart item for display
          _selectedScents: selectedNames,
        },
        size,
        qty: 1,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className={styles.picker}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t("discovery.title")}</h3>
        <p className={styles.subtitle}>{t("discovery.subtitle")}</p>
      </div>

      <div className={styles.slots}>
        {Array.from({ length: count }, (_, i) => {
          const selected = selections[i];
          const selectedScent = scents.find((s) => s.id === selected);
          return (
            <div key={i} className={`${styles.slot} ${selected ? styles.slotFilled : ""}`}>
              <label className={styles.slotLabel}>
                {t("discovery.scent")} {i + 1}
              </label>
              <div className={styles.selectWrap}>
                <select
                  className={styles.select}
                  value={selected}
                  onChange={(e) => handleSelect(i, e.target.value)}
                >
                  <option value="">{t("discovery.selectScent")}</option>
                  {scents.map((s) => {
                    const used = isUsed(s.id, i);
                    return (
                      <option key={s.id} value={s.id} disabled={used}>
                        {pName(s, lang)}{s.inspiredBy ? ` — ${s.inspiredBy}` : ""}{used ? ` ✗` : ""}
                      </option>
                    );
                  })}
                </select>
                {selectedScent && (
                  <span className={styles.scentTag}>
                    {pName(selectedScent, lang)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.status}>
        <span className={allSelected ? styles.statusDone : styles.statusPending}>
          {allSelected ? t("discovery.complete") : t("discovery.selected", { n: selectedCount })}
        </span>
      </div>

      <button
        className={`btn btn--solid btn--full ${styles.addBtn}`}
        onClick={addToCart}
        disabled={!allSelected}
      >
        {added
          ? (lang === "ar" ? "تمت الإضافة ✓" : "Added ✓")
          : allSelected
          ? t("discovery.addToCart")
          : t("discovery.selectAll")}
      </button>
    </div>
  );
}
