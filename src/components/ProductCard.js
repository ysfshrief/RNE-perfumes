"use client";

import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { useLang } from "@/context/LangContext";
import { getMinPrice, isInStock } from "@/data/products";
import { pName, pTagline, tGender } from "@/data/productLocale";
import ProductImage from "./ProductImage";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const { state, dispatch } = useShop();
  const { t, lang } = useLang();
  const saved = state.wishlist.includes(product.id);
  const inStock = isInStock(product);
  const minPrice = getMinPrice(product);
  const hasSale = product.sizes.some((s) => s.oldPrice);

  return (
    <article className={styles.card}>
      <Link href={`/product/${product.slug}`} className={styles.media} aria-label={pName(product, lang)}>
        <ProductImage product={product} index={0} />
        <div className={styles.badges}>
          {!inStock && <span className="badge badge--out">{t("badge.soldOut")}</span>}
          {inStock && hasSale && <span className="badge badge--sale">{t("badge.sale")}</span>}
          {inStock && product.bestSeller && !hasSale && (
            <span className="badge badge--best">{t("badge.best")}</span>
          )}
        </div>
        <button
          className={`${styles.wish} ${saved ? styles.wishOn : ""}`}
          aria-label={saved ? t("card.removeWishlist") : t("card.addWishlist")}
          onClick={(e) => {
            e.preventDefault();
            dispatch({ type: "TOGGLE_WISHLIST", payload: product.id });
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21C7 17 3 13.5 3 9a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 4.5-4 8-9 12z" />
          </svg>
        </button>
      </Link>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span>{tGender(product.gender, lang)}</span>
          <span className="stars" aria-label={`${product.rating} / 5`}>★ {product.rating}</span>
        </div>
        <h3 className={styles.name}>
          <Link href={`/product/${product.slug}`}>{pName(product, lang)}</Link>
        </h3>
        {product.inspiredBy && (
          <p className={styles.inspired}>
            <span className={styles.inspiredLabel}>{t("product.inspiredBy")}</span>{" "}
            <span className="keep-latin">{product.inspiredBy}</span>
          </p>
        )}
        <p className={styles.tag}>{pTagline(product, lang)}</p>
        <div className={styles.foot}>
          <span className={styles.priceWrap}>
            {product.sizes.length > 1 && <span className={styles.fromLabel}>{t("product.from")}</span>}
            <span className="price">{minPrice} {t("common.currency")}</span>
          </span>
          <Link href={`/product/${product.slug}`} className={styles.view}>{t("common.view")}</Link>
        </div>
      </div>
    </article>
  );
}
