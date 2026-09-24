// Coupon check from the browser. Remote mode asks the server (coupon codes
// are never sent to the browser); local demo mode checks the local list.
import { isRemote } from "./backend";
import { validateCoupon } from "./pricing";
import { validateCouponRemote } from "./store";

export async function checkCoupon(code, config, subtotal) {
  if (!String(code || "").trim()) return { ok: false, reason: "empty" };
  if (!isRemote) return validateCoupon(code, config?.coupons, { subtotal });
  try {
    return await validateCouponRemote(code, subtotal);
  } catch (e) {
    return { ok: false, reason: "network" };
  }
}
