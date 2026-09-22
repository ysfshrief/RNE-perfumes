"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { useLang } from "@/context/LangContext";
import { reviews as allReviews } from "@/data/products";
import { pName, pTagline, pDescription, pIngredients, tNote, tGender, tSeason } from "@/data/productLocale";
import { familyKeys } from "@/data/productMeta";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import LearnMore from "@/components/LearnMore";
import ScentPicker from "@/components/ScentPicker";
import WhatsApp from "@/components/WhatsApp";
import { useProducts } from "@/context/ProductContext";
import styles from "./product.module.css";

export default function ProductClient({ product: baseProduct, slug }) {
  const { dispatch, state } = useShop();
  const { t, lang } = useLang();
  const { mergeProduct, allProducts, visibleProducts, ready } = useProducts();
  // Static product if it exists; otherwise find a custom product by slug from context.
  // Slugs may be URL-encoded (Arabic names), so decode before comparing.
  const decodedSlug = (() => { try { return decodeURIComponent(slug); } catch (e) { return slug; } })();
  const resolved = baseProduct || allProducts.find((p) => p.slug === slug || p.slug === decodedSlug) || null;
  const product = resolved ? mergeProduct(resolved) : null;

  // Default to the first size that is actually in stock.
  const firstInStock = product ? Math.max(0, product.sizes.findIndex((s) => Number(s.stock) > 0)) : 0;
  const [sizeIdx, setSizeIdx] = useState(firstInStock);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  useEffect(() => { setSizeIdx(firstInStock); setQty(1); }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), 2200);
    return () => clearTimeout(id);
  }, [added]);

  const related = useMemo(() => {
    if (!product) return [];
    const fam = new Set(familyKeys(product));
    return visibleProducts
      .filter((p) => p.id !== product.id && !p.isDiscoverySet)
      .map((p) => ({ p, score: (p.gender === product.gender ? 2 : 0) + familyKeys(p).filter((k) => fam.has(k)).length }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.p);
  }, [product, visibleProducts]);

  if (!product || (product.hidden && ready)) {
    return (
      <div className={`container ${styles.notFound}`}>
        {!ready ? (
          <div className={styles.loading} aria-busy="true"><span className={styles.spinner} /></div>
        ) : (
          <>
            <h1>{lang === "ar" ? "المنتج غير موجود" : "Product not found"}</h1>
            <p>{lang === "ar" ? "ربما تم نقله أو لم يعد متاحًا." : "It may have moved or is no longer available."}</p>
            <Link href="/shop" className="btn btn--solid">{t("cart.shopBtn")}</Link>
          </>
        )}
      </div>
    );
  }

  const size = product.sizes[sizeIdx] || product.sizes[0] || { size: "", price: 0, stock: 0 };
  const saved = state.wishlist.includes(product.id);
  const reviews = allReviews[product.id] || [];
  const cur = t("common.currency");
  const name = pName(product, lang);
  const stock = Number(size.stock) || 0;

  const addToCart = () => {
    if (stock <= 0) return;
    dispatch({ type: "ADD_TO_CART", payload: { product, size, qty } });
    setAdded(true);
  };

  const badges = (
    <>
      {size.oldPrice && <span className="pill pill--accent">{t("badge.sale")}</span>}
      {product.bestSeller && <span className="pill">{t("badge.best")}</span>}
    </>
  );

  return (
    <>
      <nav className={`container ${styles.crumbs}`} aria-label={lang === "ar" ? "مسار التصفح" : "Breadcrumb"}>
        <Link href="/">{t("product.home")}</Link> <span aria-hidden="true">/</span> <Link href="/shop">{t("product.shop")}</Link>{" "}
        <span aria-hidden="true">/</span> <span aria-current="page">{name}</span>
      </nav>

      <section className={`container ${styles.top}`}>
        <ProductGallery product={product} name={name} badges={badges} lang={lang} />

        <div className={styles.info}>
          <div className={styles.infoMeta}>
            <span>{tGender(product.gender, lang)}</span>
            {product.season?.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>{product.season.map((s) => tSeason(s, lang)).join(" / ")}</span>
              </>
            )}
          </div>
          <h1 className={styles.name}>{name}</h1>
          {product.inspiredBy && (
            <p className={styles.inspiredBy}>
              {t("product.inspiredBy")} <span className="keep-latin">{product.inspiredBy}</span>
            </p>
          )}
          <p className={styles.tagline}>{pTagline(product, lang)}</p>

          {product.reviewCount > 0 && (
            <div className={styles.ratingRow}>
              <span className="stars" aria-hidden="true">{"★".repeat(Math.round(product.rating))}</span>
              <span className={styles.ratingText}>
                {product.rating} · {product.reviewCount} {t("product.reviews")}
              </span>
            </div>
          )}

          <div className={styles.priceRow}>
            <span className="price">{size.price} {cur}</span>
            {size.oldPrice && <span className="price__old">{size.oldPrice} {cur}</span>}
          </div>

          {product.isDiscoverySet ? (
            <>
              <p className={styles.desc}>{pDescription(product, lang)}</p>
              <ScentPicker product={product} />
            </>
          ) : (
            <>
              <div className={styles.block}>
                <h2 className={styles.blockTitle} id="size-label">{t("product.size")}</h2>
                <div className={styles.sizes} role="radiogroup" aria-labelledby="size-label">
                  {product.sizes.map((s, i) => (
                    <button
                      key={s.size}
                      type="button"
                      role="radio"
                      aria-checked={i === sizeIdx}
                      className={`${styles.sizeBtn} ${i === sizeIdx ? styles.sizeOn : ""} ${Number(s.stock) <= 0 ? styles.sizeOut : ""}`}
                      onClick={() => { setSizeIdx(i); setQty(1); }}
                      disabled={Number(s.stock) <= 0}
                    >
                      <span dir="ltr">{s.size}</span>
                      {Number(s.stock) <= 0 && <span className={styles.outTag}>{t("badge.soldOut")}</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.stockNote} aria-live="polite">
                {stock > 0 ? (
                  stock <= 5 ? (
                    <span className={styles.low}>● {t("product.onlyLeft", { n: stock })}</span>
                  ) : (
                    <span className={styles.avail}>● {t("product.inStock")}</span>
                  )
                ) : (
                  <span className={styles.soldout}>● {t("product.unavailable")}</span>
                )}
              </div>

              <div className={styles.buyRow}>
                <div className={styles.qty} role="group" aria-label={lang === "ar" ? "الكمية" : "Quantity"}>
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label={lang === "ar" ? "تقليل الكمية" : "Decrease quantity"}>−</button>
                  <span aria-live="polite">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(stock, q + 1))}
                    disabled={qty >= stock}
                    aria-label={lang === "ar" ? "زيادة الكمية" : "Increase quantity"}
                  >+</button>
                </div>
                <button
                  type="button"
                  className={`btn btn--solid ${styles.cartBtn} ${added ? styles.btnDone : ""}`}
                  onClick={addToCart}
                  disabled={stock <= 0}
                >
                  {added ? t("product.added") : stock > 0 ? t("product.addToCart") : t("product.soldOut")}
                </button>
              </div>
              {added && (
                <Link href="/cart" className={styles.viewCart}>{t("discovery.viewCart")} →</Link>
              )}

              {/* Saved state uses the same solid treatment as "Add to cart". */}
              <button
                type="button"
                className={`btn btn--full ${saved ? "btn--solid" : "btn--ghost"} ${styles.wishBtn} ${saved ? styles.wishOn : ""}`}
                aria-pressed={saved}
                onClick={() => dispatch({ type: "TOGGLE_WISHLIST", payload: product.id })}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={styles.heart}>
                  <path d="M12 21C7 17 3 13.5 3 9a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 4.5-4 8-9 12z" />
                </svg>
                {saved ? t("product.savedWishlist") : t("product.addWishlist")}
              </button>

              <p className={styles.desc}>{pDescription(product, lang)}</p>
              <LearnMore product={product} />
            </>
          )}
        </div>
      </section>

      {!product.isDiscoverySet && product.notes?.top?.length > 0 && (
        <section className={styles.notesSection}>
          <div className="container">
            <h2 className="rule">{t("product.fragranceNotes")}</h2>
            <div className={styles.pyramid}>
              {["top", "heart", "base"].map((tier) => (
                (product.notes[tier] || []).length > 0 && (
                  <div key={tier} className={styles.noteRow}>
                    <span className={styles.noteTier}>{t(`product.${tier}`)}</span>
                    <div className={styles.noteChips}>
                      {product.notes[tier].map((n) => <span key={n} className={styles.chip}>{tNote(n, lang)}</span>)}
                    </div>
                  </div>
                )
              ))}
            </div>
            {pIngredients(product, lang) && (
              <div className={styles.ingredients}>
                <h3>{t("product.ingredients")}</h3>
                <p>{pIngredients(product, lang)}</p>
              </div>
            )}
          </div>
        </section>
      )}

      <section className={`container ${styles.reviews}`}>
        <h2 className="rule rule--short">{t("product.reviewsHead")}</h2>
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>{t("product.noReviews")}</p>
        ) : (
          <div className={styles.reviewList}>
            {reviews.map((r, i) => (
              <div key={`${r.name}-${i}`} className={styles.review}>
                <div className={styles.reviewHead}>
                  <strong>{r.name}</strong>
                  <span className="stars" aria-label={`${r.rating}/5`}>{"★".repeat(r.rating)}</span>
                </div>
                <p className={styles.reviewText}>{r.text}</p>
                <span className={styles.reviewDate}>{r.date}</span>
              </div>
            ))}
          </div>
        )}
        <p className={styles.reviewNote}>{t("product.reviewNote")}</p>
      </section>

      {related.length > 0 && (
        <section className={`container section ${styles.related}`}>
          <h2 className={styles.relatedTitle}>{t("product.related")}</h2>
          <div className={styles.relatedGrid}>
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <WhatsApp />
    </>
  );
}
