"use client";

import { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import styles from "./cart.module.css";

// Mock coupons — managed from Admin Dashboard in production.
const COUPONS = {
  RNE10: { type: "percent", value: 10, label: "10% off" },
  SAVE50: { type: "fixed", value: 50, label: "50 EGP off" },
};

export default function CartPage() {
  const { state, dispatch, cartTotal } = useShop();
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [err, setErr] = useState("");

  const applyCoupon = () => {
    const c = COUPONS[code.trim().toUpperCase()];
    if (!c) { setErr("Invalid coupon code."); setCoupon(null); return; }
    setCoupon({ ...c, code: code.trim().toUpperCase() });
    setErr("");
  };

  const discount = coupon
    ? coupon.type === "percent"
      ? Math.round(cartTotal * (coupon.value / 100))
      : coupon.value
    : 0;
  const total = Math.max(0, cartTotal - discount);

  if (state.cart.length === 0) {
    return (
      <div className={`container ${styles.empty}`}>
        <h1>Your cart is empty</h1>
        <p>Discover a scent worth carrying.</p>
        <Link href="/shop" className="btn btn--solid">Shop fragrances</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.head}>
        <p className="eyebrow">Your Selection</p>
        <h1 className={styles.title}>Shopping cart</h1>
      </div>

      <div className={styles.layout}>
        <div className={styles.items}>
          {state.cart.map((item) => (
            <div key={item.key} className={styles.item}>
              <Link href={`/product/${item.slug}`} className={styles.thumb} style={{ background: item.color }} />
              <div className={styles.itemInfo}>
                <Link href={`/product/${item.slug}`}><h3>{item.name}</h3></Link>
                <span className={styles.size}>Size: {item.size}</span>
                <span className={styles.itemPrice}>{item.price} EGP</span>
              </div>
              <div className={styles.itemControls}>
                <div className={styles.qty}>
                  <button
                    onClick={() => dispatch({ type: "SET_QTY", payload: { key: item.key, qty: item.qty - 1 } })}
                    aria-label="Decrease"
                  >−</button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => dispatch({ type: "SET_QTY", payload: { key: item.key, qty: item.qty + 1 } })}
                    disabled={item.qty >= item.stock}
                    aria-label="Increase"
                  >+</button>
                </div>
                <span className={styles.lineTotal}>{item.price * item.qty} EGP</span>
                <button
                  className={styles.remove}
                  onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: { key: item.key } })}
                  aria-label="Remove"
                >Remove</button>
              </div>
            </div>
          ))}
        </div>

        <aside className={styles.summary}>
          <h3>Order summary</h3>

          <div className={styles.coupon}>
            <input
              type="text"
              placeholder="Coupon code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={applyCoupon}>Apply</button>
          </div>
          {err && <p className={styles.err}>{err}</p>}
          {coupon && <p className={styles.ok}>Applied: {coupon.label} ({coupon.code})</p>}
          <p className={styles.hint}>Try RNE10 or SAVE50</p>

          <div className={styles.rows}>
            <div className={styles.row}><span>Subtotal</span><span>{cartTotal} EGP</span></div>
            {discount > 0 && (
              <div className={styles.row}><span>Discount</span><span>−{discount} EGP</span></div>
            )}
            <div className={styles.row}><span>Shipping</span><span>Calculated at checkout</span></div>
          </div>

          <div className={styles.total}>
            <span>Total</span>
            <span>{total} EGP</span>
          </div>

          <Link href="/checkout" className="btn btn--solid btn--full">Proceed to checkout</Link>
          <Link href="/shop" className={styles.continue}>← Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
