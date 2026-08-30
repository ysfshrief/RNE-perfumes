// ─────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for money.
//
// Every price, discount and total in the app must go through this module.
// Before it existed the cart and the checkout each calculated the coupon
// discount differently, and the cart validated codes against a hardcoded
// map instead of the admin's coupon list — so a customer could redeem a
// code the store owner never created.
//
// Rules:
//  - all amounts are integer EGP (piastres are not used by this store)
//  - rounding happens once, here, never at the display layer
//  - a discount can never exceed the subtotal or produce a negative total
// ─────────────────────────────────────────────────────────────

/** Coerce anything the admin may have typed ("15", "15%", " 15 ") to a number. */
export function toAmount(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const n = parseFloat(String(value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Money rounding — one place, so totals can never disagree by a piastre. */
export function money(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

/** Whole-EGP display value. */
export function egp(n) {
  return Math.round(Number(n) || 0);
}

/** Line total for a single cart item. */
export function lineTotal(item) {
  return money(toAmount(item?.price) * (Number(item?.qty) || 0));
}

/** Cart subtotal from the raw cart array. */
export function subtotalOf(cart = []) {
  return money(cart.reduce((sum, i) => sum + lineTotal(i), 0));
}

/**
 * Validate a coupon code against the admin-managed list.
 * Returns { ok, coupon, reason } — never throws.
 *
 * reason ∈ 'empty' | 'notFound' | 'inactive' | 'expired' | 'minOrder' | 'usageLimit'
 */
export function validateCoupon(rawCode, coupons = [], { subtotal = 0 } = {}) {
  const code = String(rawCode || "").trim().toUpperCase();
  if (!code) return { ok: false, reason: "empty" };

  const found = (coupons || []).find(
    (c) => String(c.code || "").trim().toUpperCase() === code
  );
  if (!found) return { ok: false, reason: "notFound" };
  if (found.active === false) return { ok: false, reason: "inactive" };

  if (found.expiresAt) {
    const exp = new Date(found.expiresAt);
    // Treat the expiry date as inclusive of that whole day.
    exp.setHours(23, 59, 59, 999);
    if (!Number.isNaN(exp.getTime()) && Date.now() > exp.getTime()) {
      return { ok: false, reason: "expired" };
    }
  }

  const minOrder = toAmount(found.minOrder);
  if (minOrder > 0 && subtotal < minOrder) {
    return { ok: false, reason: "minOrder", minOrder };
  }

  const limit = toAmount(found.usageLimit);
  if (limit > 0 && toAmount(found.uses) >= limit) {
    return { ok: false, reason: "usageLimit" };
  }

  return { ok: true, coupon: { ...found, code } };
}

/**
 * Discount amount for a validated coupon. Clamped to the subtotal so a
 * fixed-value coupon larger than the basket can never create a negative total.
 */
export function discountFor(coupon, subtotal) {
  if (!coupon) return 0;
  const sub = money(subtotal);
  const val = toAmount(coupon.value);
  if (val <= 0) return 0;

  const raw = coupon.type === "percent" ? (sub * Math.min(val, 100)) / 100 : val;
  // Round to whole EGP *here*, not at the display layer. Otherwise a 15%
  // discount on 1370 shows as 206 while the total is derived from 205.5,
  // and the customer sees 1370 − 206 = 1165 instead of 1164.
  return Math.min(Math.max(Math.round(raw), 0), Math.round(sub));
}

/**
 * The one function that produces an order's money figures.
 * Used by the cart, the checkout, order creation and the admin, so the same
 * basket always yields the same numbers everywhere.
 */
export function computeTotals({ cart = [], coupon = null, shipping = 0 } = {}) {
  // Work in whole EGP end-to-end: every figure that is shown is also the
  // figure used in the arithmetic, so subtotal − discount + shipping always
  // equals the displayed total exactly.
  const subtotal = Math.round(subtotalOf(cart));
  const discount = discountFor(coupon, subtotal);
  const ship = Math.round(money(shipping));
  const total = Math.max(0, subtotal - discount + ship);
  return {
    subtotal,
    discount,
    shipping: ship,
    total,
    couponCode: coupon ? String(coupon.code || "").toUpperCase() : null,
  };
}
