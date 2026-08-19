"use client";

import { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { useLang } from "@/context/LangContext";
import { useConfig } from "@/context/ConfigContext";
import styles from "./checkout.module.css";

const GOV_KEYS = [
  "Cairo", "Giza", "Alexandria", "Beheira", "Dakahlia", "Sharqia",
  "Qalyubia", "Gharbia", "Monufia", "Aswan", "Luxor", "Other",
];
const GOV_AR = {
  Cairo: "القاهرة", Giza: "الجيزة", Alexandria: "الإسكندرية", Beheira: "البحيرة",
  Dakahlia: "الدقهلية", Sharqia: "الشرقية", Qalyubia: "القليوبية", Gharbia: "الغربية",
  Monufia: "المنوفية", Aswan: "أسوان", Luxor: "الأقصر", Other: "أخرى",
};

export default function CheckoutPage() {
  const { state, dispatch, cartTotal } = useShop();
  const { t, lang } = useLang();
  const { config } = useConfig();
  const [pay, setPay] = useState("cod");
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    name: state.user?.name || "",
    phone: "", governorate: "", city: "", address: "", email: state.user?.email || "",
  });
  const cur = t("common.currency");

  const enabledPayments = config.payments || {};
  const PAYMENTS = [
    { id: "cod", label: t("pay.cod"), note: t("pay.codNote") },
    { id: "card", label: t("pay.card"), note: t("pay.cardNote") },
    { id: "instapay", label: t("pay.instapay"), note: t("pay.instapayNote") },
    { id: "vodafone", label: t("pay.vodafone"), note: t("pay.vodafoneNote") },
    { id: "orange", label: t("pay.orange"), note: t("pay.orangeNote") },
    { id: "etisalat", label: t("pay.etisalat"), note: t("pay.etisalatNote") },
  ].filter((p) => enabledPayments[p.id] !== false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.name && form.phone && form.governorate && form.city && form.address && form.email;

  const placeOrder = () => {
    if (!valid) return;
    setPlaced(true);
    dispatch({ type: "CLEAR_CART" });
    window.scrollTo({ top: 0 });
  };

  if (placed) {
    return (
      <div className={`container ${styles.done}`}>
        <div className={styles.doneMark}>✓</div>
        <h1>{t("checkout.done")}</h1>
        <p>{t("checkout.doneText")}</p>
        <div className={styles.doneActions}>
          <Link href="/account" className="btn btn--solid">{t("checkout.viewOrders")}</Link>
          <Link href="/shop" className="btn btn--ghost">{t("checkout.continueShopping")}</Link>
        </div>
      </div>
    );
  }

  if (state.cart.length === 0) {
    return (
      <div className={`container ${styles.done}`}>
        <h1>{t("checkout.nothing")}</h1>
        <p>{t("checkout.emptyCart")}</p>
        <Link href="/shop" className="btn btn--solid">{t("cart.shopBtn")}</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.head}>
        <p className="eyebrow">{t("checkout.eyebrow")}</p>
        <h1 className={styles.title}>{t("checkout.title")}</h1>
      </div>

      {!state.user && (
        <div className={styles.notice}>
          {t("checkout.guestNotice")}{" "}
          <Link href="/login">{t("checkout.signIn")}</Link> {t("checkout.or")}{" "}
          <Link href="/register">{t("checkout.createOne")}</Link>.
        </div>
      )}

      <div className={styles.layout}>
        <div className={styles.formCol}>
          <section className={styles.card}>
            <h3>{t("checkout.delivery")}</h3>
            <div className={styles.grid2}>
              <Field label={t("checkout.fullName")} value={form.name} onChange={set("name")} />
              <Field label={t("checkout.phone")} value={form.phone} onChange={set("phone")} type="tel" />
              <div className={styles.field}>
                <label>{t("checkout.governorate")}</label>
                <select value={form.governorate} onChange={set("governorate")}>
                  <option value="">{t("checkout.select")}</option>
                  {GOV_KEYS.map((g) => <option key={g} value={g}>{lang === "ar" ? GOV_AR[g] : g}</option>)}
                </select>
              </div>
              <Field label={t("checkout.city")} value={form.city} onChange={set("city")} />
              <Field label={t("checkout.email")} value={form.email} onChange={set("email")} type="email" full />
              <Field label={t("checkout.address")} value={form.address} onChange={set("address")} full textarea />
            </div>
          </section>

          <section className={styles.card}>
            <h3>{t("checkout.payment")}</h3>
            <div className={styles.payments}>
              {PAYMENTS.map((p) => (
                <label key={p.id} className={`${styles.payment} ${pay === p.id ? styles.payOn : ""}`}>
                  <input type="radio" name="pay" checked={pay === p.id} onChange={() => setPay(p.id)} />
                  <span className={styles.payLabel}>{p.label}</span>
                  <span className={styles.payNote}>{p.note}</span>
                </label>
              ))}
            </div>
            <p className={styles.payHint}>{t("checkout.paymentHint")}</p>
          </section>
        </div>

        <aside className={styles.summary}>
          <h3>{t("checkout.yourOrder")}</h3>
          <div className={styles.lines}>
            {state.cart.map((i) => (
              <div key={i.key} className={styles.line}>
                <span className={styles.lineDot} style={{ background: i.color }} />
                <span className={styles.lineName}>{i.name} · {i.size} × {i.qty}</span>
                <span className={styles.linePrice}>{i.price * i.qty} {cur}</span>
              </div>
            ))}
          </div>
          <div className={styles.totals}>
            <div><span>{t("cart.subtotal")}</span><span>{cartTotal} {cur}</span></div>
            <div><span>{t("cart.shipping")}</span><span>{t("checkout.shippingTbd")}</span></div>
          </div>
          <div className={styles.total}>
            <span>{t("cart.total")}</span><span>{cartTotal} {cur}</span>
          </div>
          <button className="btn btn--solid btn--full" onClick={placeOrder} disabled={!valid}>
            {t("checkout.placeOrder")}
          </button>
          {!valid && <p className={styles.fillNote}>{t("checkout.fillNote")}</p>}
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
