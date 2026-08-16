"use client";

import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import styles from "./wishlist.module.css";

export default function WishlistPage() {
  const { state } = useShop();
  const saved = products.filter((p) => state.wishlist.includes(p.id));

  return (
    <div className="container">
      <div className={styles.head}>
        <p className="eyebrow">Saved</p>
        <h1 className={styles.title}>Your wishlist</h1>
      </div>

      {saved.length === 0 ? (
        <div className={styles.empty}>
          <p>You haven&apos;t saved any fragrances yet.</p>
          <Link href="/shop" className="btn btn--solid">Browse the collection</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {saved.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
