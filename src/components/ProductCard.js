"use client";

import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { useLang } from "@/context/LangContext";
import { getMinPrice, isInStock } from "@/data/products";
import { pName, pTagline, tGender } from "@/data/productLocale";
import { productTags } from "@/data/productMeta";
import ProductImage from "./ProductImage";
import { ArrowUpRight } from "./icons";
import styles from "./ProductCard.module.css";

/**
 * Liquid-glass product card.
 * Media sits behind; a semi-transparent glass panel carries the product info.
 * Layout: [tags] → flexible spacer → [title] → [meta] → [price + action]
 * so cards stay visually aligned regardless of description length.
 */
export default function ProductCard({ product }) {
  const { state, dispatch } = useShop();
  const { t, lang } = useLang();
  const saved = state.wishlist.includes(product.id);
  const inStock = isInStock(product);
  const minPrice = getMinPrice(product);
  const hasSale = product.sizes.some((s) => s.oldPrice);
  const tags = productTags(product, lang, t);

  return (
    <article className={styles.card}>
      <Link href={`/product/${product.slug}`} className={styles.media} aria-label={pName(product, lang)}>
        <div className={styles.mediaInner}>
          <ProductImage product={product} index={0} />
        </div>

        <div className={styles.badges}>
          {!inStock && <span className="pill">{t("badge.soldOut")}</span>}
          {inStock && hasSale && <span className="pill pill--accent">{t("badge.sale")}</span>}
          {inStock && product.bestSeller && !hasSale && (
            <span className="pill pill--accent">{t("badge.best")}</span>
          )}
        </div>

        <button
          className={`${styles.wish} ${saved ? styles.wishOn : ""}`}
          aria-label={saved ? t("card.removeWishlist") : t("card.addWishlist")}
          aria-pressed={saved}
          onClick={(e) => {
            e.preventDefault();
            dispatch({ type: "TOGGLE_WISHLIST", payload: product.id });
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 21C7 17 3 13.5 3 9a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 4.5-4 8-9 12z" />
          </svg>
        </button>
      </Link>

      {/* Glass information panel.
          A blurred copy of the product image sits behind it so the glass
          picks up the bottle's own colours instead of being a flat grey. */}
      <div className={styles.bodyWrap}>
        <div className={styles.tintLayer} aria-hidden="true">
          <ProductImage product={product} index={0} showLabel={false} />
        </div>
        <div className={`glass ${styles.body}`}>
        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag) => (
              <span key={tag} className="pill">{tag}</span>
            ))}
          </div>
        )}

        <div className={styles.spacer} />

        <h3 className={styles.name}>
          <Link href={`/product/${product.slug}`}>{pName(product, lang)}</Link>
        </h3>

        <p className={styles.meta}>
          {tGender(product.gender, lang)}
          {product.inspiredBy && (
            <>
              {" · "}
              <span className={styles.inspiredLabel}>{t("product.inspiredBy")}</span>{" "}
              <span className="keep-latin">{product.inspiredBy}</span>
            </>
          )}
        </p>

        <p className={styles.tagline}>{pTagline(product, lang)}</p>

        <div className={styles.foot}>
          <span className={styles.priceWrap}>
            {product.sizes.length > 1 && <span className={styles.fromLabel}>{t("product.from")}</span>}
            <span className={styles.price}>{minPrice} {t("common.currency")}</span>
          </span>
          <Link href={`/product/${product.slug}`} className={styles.action} aria-label={`${t("common.view")} — ${pName(product, lang)}`}>
            <span>{t("common.view")}</span>
            <ArrowUpRight className={styles.arrow} />
          </Link>
        </div>
      </div>
      </div>
    </article>
  );
}
