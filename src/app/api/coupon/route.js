import { handle, json, body } from "@/lib/server/http";
import { getDocument } from "@/lib/server/db";
import { validateCoupon } from "@/lib/pricing";

export const dynamic = "force-dynamic";

// Validate a code without exposing the coupon list to the browser.
export const POST = handle(async (req) => {
  const { code, subtotal } = await body(req, 2_000);
  const config = (await getDocument("config")) || {};
  await new Promise((r) => setTimeout(r, 150)); // slow down code guessing a little
  const res = validateCoupon(code, config.coupons, { subtotal: Number(subtotal) || 0 });
  if (!res.ok) return json({ ok: false, reason: res.reason, minOrder: res.minOrder });
  const { code: c, type, value, labelAr, labelEn } = res.coupon;
  return json({ ok: true, coupon: { code: c, type, value, labelAr, labelEn } });
});
