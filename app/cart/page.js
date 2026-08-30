"use client";

import { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { useLang } from "@/context/LangContext";
import { useConfig } from "@/context/ConfigContext";
import { computeTotals, validateCoupon, lineTotal, egp } from "@/lib/pricing";
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

  const applyCoupon = () => {
    const res = validateCoupon(code, config.coupons, { subtotal: cartTotal });
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
          {state.cart.map((item) => (
            <div key={item.key} className={styles.item}>
              <Link href={`/product/${item.slug}`} className={styles.thumb} style={{ background: item.color }} />
              <div className={styles.itemInfo}>
                <Link href={`/product/${item.slug}`}><h3>{item.name}</h3></Link>
                <span className={styles.size}>{t("cart.sizeLabel")} {item.size}</span>
                <span className={styles.itemPrice}>{item.price} {cur}</span>
              </div>
              <div className={styles.itemControls}>
                <div className={styles.qty}>
                  <button
                    onClick={() => dispatch({ type: "SET_QTY", payload: { key: item.key, qty: item.qty - 1 } })}
                    aria-label="-"
                  >−</button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => dispatch({ type: "SET_QTY", payload: { key: item.key, qty: item.qty + 1 } })}
                    disabled={item.qty >= item.stock}
                    aria-label="+"
                  >+</button>
                </div>
                <span className={styles.lineTotal}>{egp(lineTotal(item))} {cur}</span>
                <button
                  className={styles.remove}
                  onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: { key: item.key } })}
                >{t("cart.remove")}</button>
              </div>
            </div>
          ))}
        </div>

        <aside className={styles.summary}>
          <h3>{t("cart.summary")}</h3>

          <div className={styles.coupon}>
            <input
              type="text"
              placeholder={t("cart.coupon")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={applyCoupon}>{t("common.apply")}</button>
          </div>
          {err && <p className={styles.err}>{err}</p>}
          {coupon && <p className={styles.ok}>{t("cart.applied", { label: lang === "ar" ? coupon.labelAr : coupon.labelEn, code: coupon.code })}</p>}
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
