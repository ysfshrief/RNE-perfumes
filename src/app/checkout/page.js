"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { useLang } from "@/context/LangContext";
import { useConfig } from "@/context/ConfigContext";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";
import { addToCollection } from "@/lib/store";
import { computeTotals, validateCoupon, lineTotal, egp } from "@/lib/pricing";
import { normalizeImageUrl, isImageUrl } from "@/lib/media";
import { isFirebaseEnabled } from "@/lib/firebase";

// Egyptian mobile: 01XXXXXXXXX (11 digits), optionally written +20 / 0020.
const normalizePhone = (v) => String(v || "").replace(/[\s-]/g, "").replace(/^(\+|00)20/, "0");
const PHONE_OK = (v) => /^01[0125]\d{8}$/.test(normalizePhone(v));
const EMAIL_OK = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || "").trim());
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
  const { config, save: saveConfig } = useConfig();
  const { user: authUser, ready: authReady } = useAuth();
  const { allProducts, updateProducts } = useProducts();
  const [pay, setPay] = useState("cod");
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    name: state.user?.name || "",
    phone: "", governorate: "", city: "", address: "", email: state.user?.email || "",
  });
  const [attempted, setAttempted] = useState(false);
  const [stockError, setStockError] = useState("");
  const signedIn = !!(authUser || state.user);
  // With Firebase on, the security rules only accept orders from signed-in
  // customers — a guest order would silently never reach the store.
  const mustSignIn = isFirebaseEnabled && authReady && !authUser;

  // Prefill from the signed-in account once it is known.
  useEffect(() => {
    const u = authUser || state.user;
    if (!u) return;
    setForm((f) => ({ ...f, name: f.name || u.name || "", email: f.email || u.email || "" }));
  }, [authUser, state.user]);
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
  const fieldErrors = {
    name: !form.name.trim() ? t("checkout.errRequired") : "",
    phone: !form.phone.trim() ? t("checkout.errRequired") : !PHONE_OK(form.phone) ? t("checkout.errPhone") : "",
    governorate: !form.governorate ? t("checkout.errRequired") : "",
    city: !form.city.trim() ? t("checkout.errRequired") : "",
    address: form.address.trim().length < 8 ? t("checkout.errAddress") : "",
    email: !form.email.trim() ? t("checkout.errRequired") : !EMAIL_OK(form.email) ? t("checkout.errEmail") : "",
  };
  const valid = Object.values(fieldErrors).every((e) => !e);
  const showErr = (k) => (attempted ? fieldErrors[k] : "");

  // ---- Coupon / discount logic ----
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [placing, setPlacing] = useState(false);

  const applyCoupon = () => {
    setCouponError("");
    const res = validateCoupon(couponInput, config.coupons, { subtotal: cartTotal });
    if (!res.ok) {
      setAppliedCoupon(null);
      if (res.reason === "empty") return;
      setCouponError(
        res.reason === "minOrder"
          ? t("cart.couponMinOrder", { n: egp(res.minOrder), cur })
          : res.reason === "expired"
          ? t("cart.couponExpired")
          : t("cart.invalidCoupon")
      );
      return;
    }
    setAppliedCoupon(res.coupon);
  };

  const removeCoupon = () => { setAppliedCoupon(null); setCouponInput(""); setCouponError(""); };

  // Same shared calculation the cart uses — totals cannot drift apart.
  const totals = computeTotals({ cart: state.cart, coupon: appliedCoupon });
  const discount = totals.discount;
  const finalTotal = totals.total;

  // A coupon applied on the cart page carries over to checkout.
  useEffect(() => {
    let code = "";
    try { code = sessionStorage.getItem("rne-coupon") || ""; } catch (e) {}
    if (!code) return;
    const res = validateCoupon(code, config.coupons, { subtotal: cartTotal });
    if (res.ok) { setAppliedCoupon(res.coupon); setCouponInput(code); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placeOrder = async () => {
    setAttempted(true);
    // Guard against a double-click creating two identical orders.
    if (!valid || placing || mustSignIn) return;

    // Re-check stock against the live catalogue: the cart may be hours old.
    const short = state.cart.find((it) => {
      const p = allProducts.find((x) => x.id === it.id);
      const sz = p?.sizes?.find((z) => z.size === it.size);
      return !p || p.hidden || !sz || Number(sz.stock) < it.qty;
    });
    if (short) {
      setStockError(t("checkout.errStock", { name: lang === "ar" ? short.nameAr || short.name : short.name }));
      return;
    }
    setStockError("");

    // The coupon could have expired or hit its limit since it was applied.
    if (appliedCoupon) {
      const again = validateCoupon(appliedCoupon.code, config.coupons, { subtotal: totals.subtotal });
      if (!again.ok) { setAppliedCoupon(null); setCouponError(t("cart.invalidCoupon")); return; }
    }
    setPlacing(true);
    // Build the order record
    const order = {
      status: "New",
      // Ownership. UID is the reliable key (email can change / differ between
      // providers); the normalised email is kept as a fallback for orders
      // placed as a guest and later claimed by the same address.
      userId: authUser?.uid || null,
      userEmail: (authUser?.email || form.email || "").trim().toLowerCase(),
      customer: {
        name: form.name,
        phone: normalizePhone(form.phone),
        email: form.email,
        governorate: form.governorate,
        city: form.city,
        address: form.address,
      },
      // Snapshot of the transaction. Unit prices and line totals are stored so
      // the order can never be re-priced later from the current catalogue.
      items: state.cart.map((it) => ({
        id: it.id ?? it.product?.id,
        name: it.name ?? it.product?.name,
        size: it.size?.size ?? it.size,
        unitPrice: egp(it.price ?? it.size?.price),
        qty: it.qty,
        lineTotal: egp(lineTotal(it)),
        // Names of the chosen testers (Test Package) — what the store packs.
        selectedScents: Array.isArray(it.selectedScents) && it.selectedScents.length
          ? it.selectedScents.map((sc) => sc.name)
          : null,
        selectedScentsAr: Array.isArray(it.selectedScents) && it.selectedScents.length
          ? it.selectedScents.map((sc) => sc.nameAr || sc.name)
          : null,
      })),
      subtotal: egp(totals.subtotal),
      discount: egp(totals.discount),
      shipping: egp(totals.shipping),
      total: egp(totals.total),
      coupon: totals.couponCode,
      couponType: appliedCoupon ? appliedCoupon.type : null,
      couponValue: appliedCoupon ? appliedCoupon.value : null,
      currency: "EGP",
      payment: pay,
      note: form.note || "",
    };
    await addToCollection("orders", order);

    // Decrement stock for what was actually sold. Without this the same unit
    // could be sold indefinitely — the cart enforced stock but the order never
    // consumed it.
    const sold = new Map(); // productId -> { size: qty }
    state.cart.forEach((it) => {
      const pid = it.id ?? it.product?.id;
      const size = it.size?.size ?? it.size;
      if (!pid || !size) return;
      const bucket = sold.get(pid) || {};
      bucket[size] = (bucket[size] || 0) + (Number(it.qty) || 0);
      sold.set(pid, bucket);
    });
    const stockPatches = {};
    sold.forEach((bySize, pid) => {
      const product = allProducts.find((p) => p.id === pid);
      if (!product) return;
      stockPatches[pid] = {
        sizes: (product.sizes || []).map((sz) =>
          bySize[sz.size]
            ? { ...sz, stock: Math.max(0, (Number(sz.stock) || 0) - bySize[sz.size]) }
            : sz,
        ),
      };
    });
    updateProducts(stockPatches); // one write — see ProductContext.updateProducts
    // Also save/update the customer record
    await addToCollection("customers", {
      id: `cust_${form.email}`,
      name: form.name,
      email: form.email,
      phone: normalizePhone(form.phone),
      governorate: form.governorate,
      city: form.city,
      address: form.address,
    });
    // Record redemption so usage limits are enforceable and the admin can
    // see how often each code was actually used.
    if (appliedCoupon) {
      const next = (config.coupons || []).map((c) =>
        String(c.code).toUpperCase() === totals.couponCode
          ? { ...c, uses: (Number(c.uses) || 0) + 1 }
          : c
      );
      saveConfig({ ...config, coupons: next });
    }

    // Cart is only cleared once the order actually exists.
    setPlaced(true);
    setPlacing(false);
    try { sessionStorage.removeItem("rne-coupon"); } catch (e) {}
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

      {!signedIn && (
        <div className={styles.notice} role={mustSignIn ? "alert" : undefined}>
          {mustSignIn ? t("checkout.mustSignIn") : t("checkout.guestNotice")}{" "}
          <Link href="/login?next=/checkout">{t("checkout.signIn")}</Link> {t("checkout.or")}{" "}
          <Link href="/register">{t("checkout.createOne")}</Link>.
        </div>
      )}

      <div className={styles.layout}>
        <div className={styles.formCol}>
          <section className={styles.card}>
            <h3>{t("checkout.delivery")}</h3>
            <div className={styles.grid2}>
              <Field id="co-name" label={t("checkout.fullName")} value={form.name} onChange={set("name")} error={showErr("name")} autoComplete="name" />
              <Field id="co-phone" label={t("checkout.phone")} value={form.phone} onChange={set("phone")} type="tel" error={showErr("phone")} autoComplete="tel" dir="ltr" placeholder="01XXXXXXXXX" inputMode="tel" />
              <div className={styles.field}>
                <label htmlFor="co-gov">{t("checkout.governorate")}</label>
                <select id="co-gov" value={form.governorate} onChange={set("governorate")} aria-invalid={!!showErr("governorate")}>
                  <option value="">{t("checkout.select")}</option>
                  {GOV_KEYS.map((g) => <option key={g} value={g}>{lang === "ar" ? GOV_AR[g] : g}</option>)}
                </select>
                {showErr("governorate") && <span className={styles.fieldError} role="alert">{showErr("governorate")}</span>}
              </div>
              <Field id="co-city" label={t("checkout.city")} value={form.city} onChange={set("city")} error={showErr("city")} autoComplete="address-level2" />
              <Field id="co-email" label={t("checkout.email")} value={form.email} onChange={set("email")} type="email" full error={showErr("email")} autoComplete="email" dir="ltr" />
              <Field id="co-address" label={t("checkout.address")} value={form.address} onChange={set("address")} full textarea error={showErr("address")} autoComplete="street-address" />
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
            {state.cart.map((i) => {
              const img = i.image || i.color;
              return (
                <div key={i.key} className={styles.line}>
                  <span className={styles.lineThumb} aria-hidden="true">
                    {isImageUrl(img) && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={normalizeImageUrl(img, 200)} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
                    )}
                  </span>
                  <span className={styles.lineName}>
                    <span className={styles.lineTitle}>{lang === "ar" ? i.nameAr || i.name : i.name}</span>
                    <span className={styles.lineMeta}><bdi>{i.size}</bdi> · {lang === "ar" ? "الكمية" : "Qty"} {i.qty}</span>
                    {i.selectedScents?.length > 0 && (
                      <span className={styles.lineScents}>
                        {i.selectedScents.map((sc) => (lang === "ar" ? sc.nameAr || sc.name : sc.name)).join("، ")}
                      </span>
                    )}
                  </span>
                  <span className={`price ${styles.linePrice}`}>{egp(lineTotal(i))} {cur}</span>
                </div>
              );
            })}
          </div>
          <div className={styles.totals}>
            <div><span>{t("cart.subtotal")}</span><span>{egp(cartTotal)} {cur}</span></div>
            <div><span>{t("cart.shipping")}</span><span>{t("checkout.shippingTbd")}</span></div>
            {discount > 0 && (
              <div className={styles.discountRow}>
                <span>{t("checkout.discount")} ({appliedCoupon.code})</span>
                <span>− {egp(discount)} {cur}</span>
              </div>
            )}
          </div>

          {/* Coupon code */}
          <div className={styles.couponBox}>
            {appliedCoupon ? (
              <div className={styles.couponApplied}>
                <span>✓ {appliedCoupon.code} {t("checkout.couponApplied")}</span>
                <button type="button" onClick={removeCoupon} className={styles.couponRemove}>{t("checkout.remove")}</button>
              </div>
            ) : (
              <div className={styles.couponInput}>
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder={t("checkout.couponPlaceholder")}
                  dir="ltr"
                />
                <button type="button" onClick={applyCoupon} className={styles.couponApply}>{t("checkout.apply")}</button>
              </div>
            )}
            {couponError && <p className={styles.couponError}>{couponError}</p>}
          </div>

          <div className={styles.total}>
            <span>{t("cart.total")}</span><span>{egp(finalTotal)} {cur}</span>
          </div>
          {stockError && <p className={styles.fieldError} role="alert">{stockError}</p>}
          <button type="button" className="btn btn--solid btn--full" onClick={placeOrder} disabled={placing || mustSignIn} aria-busy={placing}>
            {placing ? t("checkout.placing") : t("checkout.placeOrder")}
          </button>
          {attempted && !valid && <p className={styles.fillNote} role="alert">{t("checkout.fillNote")}</p>}
        </aside>
      </div>
    </div>
  );
}

function Field({ id, label, value, onChange, type = "text", full, textarea, error, ...rest }) {
  const errId = error ? `${id}-err` : undefined;
  return (
    <div className={`${styles.field} ${full ? styles.full : ""}`}>
      <label htmlFor={id}>{label}</label>
      {textarea ? (
        <textarea id={id} value={value} onChange={onChange} rows={3} aria-invalid={!!error} aria-describedby={errId} {...rest} />
      ) : (
        <input id={id} type={type} value={value} onChange={onChange} aria-invalid={!!error} aria-describedby={errId} {...rest} />
      )}
      {error && <span id={errId} className={styles.fieldError} role="alert">{error}</span>}
    </div>
  );
}
