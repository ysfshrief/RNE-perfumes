"use client";

import { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { reviews as allReviews, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import WhatsApp from "@/components/WhatsApp";
import styles from "./product.module.css";

export default function ProductClient({ product }) {
  const { dispatch, state } = useShop();
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

  const addToCart = () => {
    if (size.stock <= 0) return;
    dispatch({ type: "ADD_TO_CART", payload: { product, size, qty } });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <div className={`container ${styles.crumbs}`}>
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> /{" "}
        <span>{product.name}</span>
      </div>

      <section className={`container ${styles.top}`}>
        {/* Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImg} style={{ background: product.images[imgIdx] }}>
            <span className={styles.imgLabel}>{product.name}</span>
            <div className={styles.imgBadges}>
              {size.oldPrice && <span className="badge badge--sale">Sale</span>}
              {product.bestSeller && <span className="badge badge--best">Best Seller</span>}
            </div>
          </div>
          <div className={styles.thumbs}>
            {product.images.map((c, i) => (
              <button
                key={i}
                className={`${styles.thumb} ${i === imgIdx ? styles.thumbOn : ""}`}
                style={{ background: c }}
                onClick={() => setImgIdx(i)}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className={styles.info}>
          <div className={styles.infoMeta}>
            <span>{product.gender}</span>
            <span>·</span>
            <span>{product.season.join(" / ")}</span>
          </div>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.tagline}>{product.tagline}</p>

          <div className={styles.ratingRow}>
            <span className="stars">{"★".repeat(Math.round(product.rating))}</span>
            <span className={styles.ratingText}>
              {product.rating} · {product.reviewCount} reviews
            </span>
          </div>

          <div className={styles.priceRow}>
            <span className="price">{size.price} EGP</span>
            {size.oldPrice && <span className="price__old">{size.oldPrice} EGP</span>}
          </div>

          <div className={styles.block}>
            <h4>Size</h4>
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
                  {s.stock <= 0 && <span className={styles.outTag}>Sold out</span>}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.stockNote}>
            {size.stock > 0 ? (
              size.stock <= 5 ? (
                <span className={styles.low}>● Only {size.stock} left in stock</span>
              ) : (
                <span className={styles.avail}>● In stock</span>
              )
            ) : (
              <span className={styles.soldout}>● Currently unavailable</span>
            )}
          </div>

          <div className={styles.buyRow}>
            <div className={styles.qty}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
              <span>{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(size.stock, q + 1))}
                disabled={qty >= size.stock}
                aria-label="Increase"
              >+</button>
            </div>
            <button
              className="btn btn--solid"
              style={{ flex: 1 }}
              onClick={addToCart}
              disabled={size.stock <= 0}
            >
              {added ? "Added ✓" : size.stock > 0 ? "Add to cart" : "Sold out"}
            </button>
          </div>

          <button
            className={`btn btn--ghost btn--full ${styles.wishBtn}`}
            onClick={() => dispatch({ type: "TOGGLE_WISHLIST", payload: product.id })}
          >
            {saved ? "♥ Saved to wishlist" : "♡ Add to wishlist"}
          </button>

          <p className={styles.desc}>{product.description}</p>
        </div>
      </section>

      {/* Notes pyramid — signature element */}
      <section className={styles.notesSection}>
        <div className="container">
          <div className="rule">Fragrance Notes</div>
          <div className={styles.pyramid}>
            <div className={styles.noteRow}>
              <span className={styles.noteTier}>Top</span>
              <div className={styles.noteChips}>
                {product.notes.top.map((n) => <span key={n} className={styles.chip}>{n}</span>)}
              </div>
            </div>
            <div className={styles.noteRow}>
              <span className={styles.noteTier}>Heart</span>
              <div className={styles.noteChips}>
                {product.notes.heart.map((n) => <span key={n} className={styles.chip}>{n}</span>)}
              </div>
            </div>
            <div className={styles.noteRow}>
              <span className={styles.noteTier}>Base</span>
              <div className={styles.noteChips}>
                {product.notes.base.map((n) => <span key={n} className={styles.chip}>{n}</span>)}
              </div>
            </div>
          </div>
          <div className={styles.ingredients}>
            <h4>Ingredients / Composition</h4>
            <p>{product.ingredients}</p>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className={`container ${styles.reviews}`}>
        <div className="rule rule--short">Reviews</div>
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>
            No reviews yet. Only verified buyers can leave a review.
          </p>
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
        <p className={styles.reviewNote}>
          Reviews can only be submitted by customers who purchased this product,
          and appear after approval.
        </p>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className={`container section ${styles.related}`}>
          <h2 className={styles.relatedTitle}>You may also like</h2>
          <div className={styles.relatedGrid}>
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <WhatsApp />
    </>
  );
}
