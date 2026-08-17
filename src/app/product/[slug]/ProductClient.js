"use client";

import { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { useLang } from "@/context/LangContext";
import { reviews as allReviews, products } from "@/data/products";
import { pName, pTagline, pDescription, pIngredients, tNote, tGender, tSeason } from "@/data/productLocale";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import LearnMore from "@/components/LearnMore";
import WhatsApp from "@/components/WhatsApp";
import { useProducts } from "@/context/ProductContext";
import styles from "./product.module.css";

export default function ProductClient({ product: baseProduct }) {
  const { dispatch, state } = useShop();
  const { t, lang } = useLang();
  const { mergeProduct } = useProducts();
  const product = mergeProduct(baseProduct);
  const [sizeIdx, setSizeIdx] = useState(
    product.sizes.findIndex((s) => s.stock > 0) === -1
      ? 0
      : product.sizes.findIndex((s) => s.stock > 0)
  );
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded] = useState(false);

  const size = product.sizes[sizeIdx];
  const saved = state.wishlist.includes(product.id);
  const reviews = allReviews[product.id] || [];
  const related = products.filter((p) => p.id !== product.id && p.gender === product.gender).slice(0, 3);
  const cur = t("common.currency");

  const addToCart = () => {
    if (size.stock <= 0) return;
    dispatch({ type: "ADD_TO_CART", payload: { product, size, qty } });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <div className={`container ${styles.crumbs}`}>
        <Link href="/">{t("product.home")}</Link> / <Link href="/shop">{t("product.shop")}</Link> /{" "}
        <span>{pName(product, lang)}</span>
      </div>

      <section className={`container ${styles.top}`}>
        <div className={styles.gallery}>
          <div className={styles.mainImg}>
            <ProductImage product={product} index={imgIdx} />
            <div className={styles.imgBadges}>
              {size.oldPrice && <span className="badge badge--sale">{t("badge.sale")}</span>}
              {product.bestSeller && <span className="badge badge--best">{t("badge.best")}</span>}
            </div>
          </div>
          <div className={styles.thumbs}>
            {product.images.map((c, i) => (
              <button
                key={i}
                className={`${styles.thumb} ${i === imgIdx ? styles.thumbOn : ""}`}
                onClick={() => setImgIdx(i)}
                aria-label={`${i + 1}`}
              >
                <ProductImage product={product} index={i} showLabel={false} />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.infoMeta}>
            <span>{tGender(product.gender, lang)}</span>
            <span>·</span>
            <span>{product.season.map((s) => tSeason(s, lang)).join(" / ")}</span>
          </div>
          <h1 className={styles.name}>{pName(product, lang)}</h1>
          {product.inspiredBy && (
            <p className={styles.inspiredBy}>
              {t("product.inspiredBy")} <span className="keep-latin">{product.inspiredBy}</span>
            </p>
          )}
          <p className={styles.tagline}>{pTagline(product, lang)}</p>

          <div className={styles.ratingRow}>
            <span className="stars">{"★".repeat(Math.round(product.rating))}</span>
            <span className={styles.ratingText}>
              {product.rating} · {product.reviewCount} {t("product.reviews")}
            </span>
          </div>

          <div className={styles.priceRow}>
            <span className="price">{size.price} {cur}</span>
            {size.oldPrice && <span className="price__old">{size.oldPrice} {cur}</span>}
          </div>

          <div className={styles.block}>
            <h4>{t("product.size")}</h4>
            <div className={styles.sizes}>
              {product.sizes.map((s, i) => (
                <button
                  key={s.size}
                  className={`${styles.sizeBtn} ${i === sizeIdx ? styles.sizeOn : ""} ${
                    s.stock <= 0 ? styles.sizeOut : ""
                  }`}
                  onClick={() => { setSizeIdx(i); setQty(1); }}
                  disabled={s.stock <= 0}
                >
                  {s.size}
                  {s.stock <= 0 && <span className={styles.outTag}>{t("badge.soldOut")}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.stockNote}>
            {size.stock > 0 ? (
              size.stock <= 5 ? (
                <span className={styles.low}>● {t("product.onlyLeft", { n: size.stock })}</span>
              ) : (
                <span className={styles.avail}>● {t("product.inStock")}</span>
              )
            ) : (
              <span className={styles.soldout}>● {t("product.unavailable")}</span>
            )}
          </div>

          <div className={styles.buyRow}>
            <div className={styles.qty}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="-">−</button>
              <span>{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(size.stock, q + 1))}
                disabled={qty >= size.stock}
                aria-label="+"
              >+</button>
            </div>
            <button
              className="btn btn--solid"
              style={{ flex: 1 }}
              onClick={addToCart}
              disabled={size.stock <= 0}
            >
              {added ? t("product.added") : size.stock > 0 ? t("product.addToCart") : t("product.soldOut")}
            </button>
          </div>

          <button
            className={`btn btn--ghost btn--full ${styles.wishBtn}`}
            onClick={() => dispatch({ type: "TOGGLE_WISHLIST", payload: product.id })}
          >
            {saved ? t("product.savedWishlist") : t("product.addWishlist")}
          </button>

          <p className={styles.desc}>{pDescription(product, lang)}</p>
          <LearnMore product={product} />
        </div>
      </section>

      <section className={styles.notesSection}>
        <div className="container">
          <div className="rule">{t("product.fragranceNotes")}</div>
          <div className={styles.pyramid}>
            <div className={styles.noteRow}>
              <span className={styles.noteTier}>{t("product.top")}</span>
              <div className={styles.noteChips}>
                {product.notes.top.map((n) => <span key={n} className={styles.chip}>{tNote(n, lang)}</span>)}
              </div>
            </div>
            <div className={styles.noteRow}>
              <span className={styles.noteTier}>{t("product.heart")}</span>
              <div className={styles.noteChips}>
                {product.notes.heart.map((n) => <span key={n} className={styles.chip}>{tNote(n, lang)}</span>)}
              </div>
            </div>
            <div className={styles.noteRow}>
              <span className={styles.noteTier}>{t("product.base")}</span>
              <div className={styles.noteChips}>
                {product.notes.base.map((n) => <span key={n} className={styles.chip}>{tNote(n, lang)}</span>)}
              </div>
            </div>
          </div>
          <div className={styles.ingredients}>
            <h4>{t("product.ingredients")}</h4>
            <p>{pIngredients(product, lang)}</p>
          </div>
        </div>
      </section>

      <section className={`container ${styles.reviews}`}>
        <div className="rule rule--short">{t("product.reviewsHead")}</div>
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>{t("product.noReviews")}</p>
        ) : (
          <div className={styles.reviewList}>
            {reviews.map((r, i) => (
              <div key={i} className={styles.review}>
                <div className={styles.reviewHead}>
                  <strong>{r.name}</strong>
                  <span className="stars">{"★".repeat(r.rating)}</span>
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
