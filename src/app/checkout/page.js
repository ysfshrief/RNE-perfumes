"use client";

import { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import styles from "./checkout.module.css";

const GOVERNORATES = [
  "Cairo", "Giza", "Alexandria", "Beheira", "Dakahlia", "Sharqia",
  "Qalyubia", "Gharbia", "Monufia", "Aswan", "Luxor", "Other",
];

const PAYMENTS = [
  { id: "cod", label: "Cash on Delivery", note: "Pay when your order arrives" },
  { id: "card", label: "Visa / Mastercard", note: "Secure card payment" },
  { id: "instapay", label: "InstaPay", note: "Bank transfer via InstaPay" },
  { id: "vodafone", label: "Vodafone Cash", note: "Mobile wallet" },
  { id: "orange", label: "Orange Cash", note: "Mobile wallet" },
  { id: "etisalat", label: "Etisalat Cash", note: "Mobile wallet" },
];

export default function CheckoutPage() {
  const { state, dispatch, cartTotal } = useShop();
  const [pay, setPay] = useState("cod");
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    name: state.user?.name || "",
    phone: "", governorate: "", city: "", address: "", email: state.user?.email || "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.name && form.phone && form.governorate && form.city && form.address && form.email;

  const placeOrder = () => {
    if (!valid) return;
    // Prototype: no real payment/gateway call. Inventory would be deducted
    // only after Admin confirms the order (see blueprint §14).
    setPlaced(true);
    dispatch({ type: "CLEAR_CART" });
    window.scrollTo({ top: 0 });
  };

  if (placed) {
    return (
      <div className={`container ${styles.done}`}>
        <div className={styles.doneMark}>✓</div>
        <h1>Order placed</h1>
        <p>
          Thank you. Your order has been received with status <strong>New</strong>.
          We&apos;ll confirm it shortly — you can track progress in your account.
        </p>
        <div className={styles.doneActions}>
          <Link href="/account" className="btn btn--solid">View my orders</Link>
          <Link href="/shop" className="btn btn--ghost">Continue shopping</Link>
        </div>
      </div>
    );
  }

  if (state.cart.length === 0) {
    return (
      <div className={`container ${styles.done}`}>
        <h1>Nothing to check out</h1>
        <p>Your cart is empty.</p>
        <Link href="/shop" className="btn btn--solid">Shop fragrances</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.head}>
        <p className="eyebrow">Almost There</p>
        <h1 className={styles.title}>Checkout</h1>
      </div>

      {!state.user && (
        <div className={styles.notice}>
          You&apos;re checking out as a guest in this preview. An account is
          required to complete a real order — <Link href="/login">sign in</Link> or{" "}
          <Link href="/register">create one</Link>.
        </div>
      )}

      <div className={styles.layout}>
        <div className={styles.formCol}>
          <section className={styles.card}>
            <h3>Delivery details</h3>
            <div className={styles.grid2}>
              <Field label="Full name" value={form.name} onChange={set("name")} />
              <Field label="Phone number" value={form.phone} onChange={set("phone")} type="tel" />
              <div className={styles.field}>
                <label>Governorate</label>
                <select value={form.governorate} onChange={set("governorate")}>
                  <option value="">Select…</option>
                  {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <Field label="City / Markaz" value={form.city} onChange={set("city")} />
              <Field label="Email" value={form.email} onChange={set("email")} type="email" full />
              <Field label="Detailed address" value={form.address} onChange={set("address")} full textarea />
            </div>
          </section>

          <section className={styles.card}>
            <h3>Payment method</h3>
            <div className={styles.payments}>
              {PAYMENTS.map((p) => (
                <label key={p.id} className={`${styles.payment} ${pay === p.id ? styles.payOn : ""}`}>
                  <input type="radio" name="pay" checked={pay === p.id} onChange={() => setPay(p.id)} />
                  <span className={styles.payLabel}>{p.label}</span>
                  <span className={styles.payNote}>{p.note}</span>
                </label>
              ))}
            </div>
            <p className={styles.payHint}>
              Payment gateway configuration is set up by the store admin. This
              preview does not process real payments.
            </p>
          </section>
        </div>

        <aside className={styles.summary}>
          <h3>Your order</h3>
          <div className={styles.lines}>
            {state.cart.map((i) => (
              <div key={i.key} className={styles.line}>
                <span className={styles.lineDot} style={{ background: i.color }} />
                <span className={styles.lineName}>{i.name} · {i.size} × {i.qty}</span>
                <span className={styles.linePrice}>{i.price * i.qty} EGP</span>
              </div>
            ))}
          </div>
          <div className={styles.totals}>
            <div><span>Subtotal</span><span>{cartTotal} EGP</span></div>
            <div><span>Shipping</span><span>2–5 days · TBD</span></div>
          </div>
          <div className={styles.total}>
            <span>Total</span><span>{cartTotal} EGP</span>
          </div>
          <button className="btn btn--solid btn--full" onClick={placeOrder} disabled={!valid}>
            Place order
          </button>
          {!valid && <p className={styles.fillNote}>Fill in all delivery details to continue.</p>}
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", full, textarea }) {
  return (
    <div className={`${styles.field} ${full ? styles.full : ""}`}>
      <label>{label}</label>
      {textarea ? (
        <textarea value={value} onChange={onChange} rows={3} />
      ) : (
        <input type={type} value={value} onChange={onChange} />
      )}
    </div>
  );
}
