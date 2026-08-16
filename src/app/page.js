import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import WhatsApp from "@/components/WhatsApp";
import { products } from "@/data/products";
import styles from "./home.module.css";

export default function HomePage() {
  const featured = products.filter((p) => p.bestSeller).slice(0, 3);
  const fresh = products.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.heroEyebrow}>RNE — Eau de Parfum</p>
          <h1 className={styles.heroTitle}>
            Scent, <em>engineered</em>
            <br /> into signature.
          </h1>
          <p className={styles.heroLead}>
            Premium compositions built note by note. Discover fragrances made to
            be remembered — for him, for her, for every season.
          </p>
          <div className={styles.heroActions}>
            <Link href="/shop" className="btn btn--solid">Shop the collection</Link>
            <Link href="/shop?offers=true" className="btn btn--ghost">View offers</Link>
          </div>
        </div>
        <div className={styles.heroMark} aria-hidden="true">RNE</div>
      </section>

      {/* Category strip */}
      <section className={styles.catStrip}>
        <div className="container">
          <div className="rule">The Collection</div>
          <div className={styles.cats}>
            {[
              { label: "For Men", href: "/shop?category=Men", c: "#26302b" },
              { label: "For Women", href: "/shop?category=Women", c: "#7a4b52" },
              { label: "Summer", href: "/shop?category=Summer", c: "#3d5a6b" },
              { label: "Winter", href: "/shop?category=Winter", c: "#8f6a30" },
            ].map((cat) => (
              <Link key={cat.label} href={cat.href} className={styles.cat} style={{ "--c": cat.c }}>
                <span>{cat.label}</span>
                <span className={styles.catArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section container">
        <div className={styles.sectionHead}>
          <div>
            <p className="eyebrow">Best Sellers</p>
            <h2 className={styles.sectionTitle}>Most-loved this season</h2>
          </div>
          <Link href="/shop" className={styles.seeAll}>See all →</Link>
        </div>
        <div className={styles.grid}>
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Editorial band */}
      <section className={styles.editorial}>
        <div className="container">
          <div className={styles.editorialInner}>
            <div>
              <p className={styles.editEyebrow}>The RNE Standard</p>
              <h2 className={styles.editTitle}>
                Composed with intent. Worn as identity.
              </h2>
            </div>
            <div className={styles.editCols}>
              <div className={styles.editItem}>
                <span className={styles.editNum}>01</span>
                <h4>Concentrated formulas</h4>
                <p>Eau de parfum strength for depth and longevity that lasts through the day.</p>
              </div>
              <div className={styles.editItem}>
                <span className={styles.editNum}>02</span>
                <h4>Considered notes</h4>
                <p>Every accord — top, heart, base — chosen to unfold in balance over time.</p>
              </div>
              <div className={styles.editItem}>
                <span className={styles.editNum}>03</span>
                <h4>Delivered local</h4>
                <p>Fast local delivery in 2–5 days, with cash and card options at checkout.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="section container">
        <div className={styles.sectionHead}>
          <div>
            <p className="eyebrow">The Range</p>
            <h2 className={styles.sectionTitle}>Explore every scent</h2>
          </div>
          <Link href="/shop" className={styles.seeAll}>See all →</Link>
        </div>
        <div className={styles.grid4}>
          {fresh.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <WhatsApp />
    </>
  );
}
