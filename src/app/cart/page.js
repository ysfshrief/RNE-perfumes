"use client";

import { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { useLang } from "@/context/LangContext";
import { useConfig } from "@/context/ConfigContext";
import { computeTotals, lineTotal, egp } from "@/lib/pricing";
import { checkCoupon } from "@/lib/couponClient";
import { normalizeImageUrl, isImageUrl } from "@/lib/media";
import styles from "./cart.module.css";

export default function CartPage() {
  const { state, dispatch } = useShop();
  const { t, lang } = useLang();
  const { config } = useConfig();
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [err, setErr] = useState("");
  const cur = t("common.currency");

  // Coupons come from the admin-managed list, and every figure below comes
  // from the shared pricing module so the cart and the checkout can never
  // disagree about a total.
  const { subtotal: cartTotal, discount, total } = computeTotals({
    cart: state.cart,
    coupon,
  });

  const applyCoupon = async () => {
    const res = await checkCoupon(code, config, cartTotal);
    if (!res.ok) {
      setCoupon(null);
      setErr(
        res.reason === "minOrder"
          ? t("cart.couponMinOrder", { n: egp(res.minOrder), cur })
          : res.reason === "expired"
          ? t("cart.couponExpired")
          : t("cart.invalidCoupon")
      );
      return;
    }
    setCoupon(res.coupon);
    setErr("");
    // Carry the code to checkout so the customer doesn't have to re-enter it.
    try { sessionStorage.setItem("rne-coupon", res.coupon.code); } catch (e) {}
  };

  if (state.cart.length === 0) {
    return (
      <div className={`container ${styles.empty}`}>
        <h1>{t("cart.empty")}</h1>
        <p>{t("cart.emptyLead")}</p>
        <Link href="/shop" className="btn btn--solid">{t("cart.shopBtn")}</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.head}>
        <p className="eyebrow">{t("cart.eyebrow")}</p>
        <h1 className={styles.title}>{t("cart.title")}</h1>
      </div>

      <div className={styles.layout}>
        <div className={styles.items}>
          {state.cart.map((item) => {
            const img = item.image || item.color; // `color` = legacy cart items
            const name = lang === "ar" ? item.nameAr || item.name : item.name;
            return (
            <div key={item.key} className={styles.item}>
              <Link href={`/product/${item.slug}`} className={styles.thumb} aria-label={name}>
                {isImageUrl(img) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={normalizeImageUrl(img, 300)} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
                ) : null}
              </Link>
              <div className={styles.itemInfo}>
                <Link href={`/product/${item.slug}`}><h3>{name}</h3></Link>
                <span className={styles.size}>{t("cart.sizeLabel")} <span dir="ltr">{item.size}</span></span>
                {item.selectedScents?.length > 0 && (
                  <ul className={styles.scents} aria-label={t("discovery.testers")}>
                    {item.selectedScents.map((sc) => (
                      <li key={sc.id}>{lang === "ar" ? sc.nameAr || sc.name : sc.name}</li>
                    ))}
                  </ul>
                )}
                <span className={`price ${styles.itemPrice}`}>{item.price} {cur}</span>
              </div>
              <div className={styles.itemControls}>
                <div className={styles.qty}>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "SET_QTY", payload: { key: item.key, qty: item.qty - 1 } })}
                    disabled={item.qty <= 1}
                    aria-label={lang === "ar" ? "تقليل الكمية" : "Decrease quantity"}
                  >−</button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => dispatch({ type: "SET_QTY", payload: { key: item.key, qty: item.qty + 1 } })}
                    type="button"
                    disabled={item.qty >= item.stock}
                    aria-label={lang === "ar" ? "زيادة الكمية" : "Increase quantity"}
                  >+</button>
                </div>
                <span className={`price ${styles.lineTotal}`}>{egp(lineTotal(item))} {cur}</span>
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: { key: item.key } })}
                >{t("cart.remove")}</button>
              </div>
            </div>
            );
          })}
        </div>

        <aside className={styles.summary}>
          <h3>{t("cart.summary")}</h3>

          <div className={styles.coupon}>
            <input
              type="text"
              dir="ltr"
              placeholder={t("cart.coupon")}
              aria-label={t("cart.coupon")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") applyCoupon(); }}
            />
            <button type="button" onClick={applyCoupon}>{t("common.apply")}</button>
          </div>
          {err && <p className={styles.err}>{err}</p>}
          {coupon && <p className={styles.ok}>{t("cart.applied", { label: (lang === "ar" ? coupon.labelAr : coupon.labelEn) || coupon.code, code: coupon.code })}</p>}
          <p className={styles.hint}>{t("cart.couponHint")}</p>

          <div className={styles.rows}>
            <div className={styles.row}><span>{t("cart.subtotal")}</span><span>{egp(cartTotal)} {cur}</span></div>
            {discount > 0 && (
              <div className={styles.row}><span>{t("cart.discount")}</span><span>−{egp(discount)} {cur}</span></div>
            )}
            <div className={styles.row}><span>{t("cart.shipping")}</span><span>{t("cart.calcCheckout")}</span></div>
          </div>

          <div className={styles.total}>
            <span>{t("cart.total")}</span>
            <span>{egp(total)} {cur}</span>
          </div>

          <Link href="/checkout" className="btn btn--solid btn--full">{t("cart.checkout")}</Link>
          <Link href="/shop" className={styles.continue}>{t("cart.continue")}</Link>
        </aside>
      </div>
    </div>
  );
}
