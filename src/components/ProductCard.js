"use client";

import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { getMinPrice, isInStock } from "@/data/products";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const { state, dispatch } = useShop();
  const saved = state.wishlist.includes(product.id);
  const inStock = isInStock(product);
  const minPrice = getMinPrice(product);
  const hasSale = product.sizes.some((s) => s.oldPrice);

  return (
    <article className={styles.card}>
      <Link href={`/product/${product.slug}`} className={styles.media} aria-label={product.name}>
        <div className={styles.bottle} style={{ background: product.images[0] }}>
          <span className={styles.bottleLabel}>{product.name}</span>
        </div>
        <div className={styles.badges}>
          {!inStock && <span className="badge badge--out">Sold Out</span>}
          {inStock && hasSale && <span className="badge badge--sale">Sale</span>}
          {inStock && product.bestSeller && !hasSale && (
            <span className="badge badge--best">Best Seller</span>
          )}
        </div>
        <button
          className={`${styles.wish} ${saved ? styles.wishOn : ""}`}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
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
          <span>{product.gender}</span>
          <span className="stars" aria-label={`${product.rating} out of 5`}>
            ★ {product.rating}
          </span>
        </div>
        <h3 className={styles.name}>
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className={styles.tag}>{product.tagline}</p>
        <div className={styles.foot}>
          <span className="price">
            {minPrice} EGP
          </span>
          <Link href={`/product/${product.slug}`} className={styles.view}>
            View →
          </Link>
        </div>
      </div>
    </article>
  );
}
