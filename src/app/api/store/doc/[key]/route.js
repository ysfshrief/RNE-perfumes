import { handle, json, body, forbidden } from "@/lib/server/http";
import { getDocument, putDocument } from "@/lib/server/db";
import { isAdminRequest } from "@/lib/server/session";

export const dynamic = "force-dynamic";

// Site-wide documents. Everyone can read them (they render the store);
// only an admin session can write them.
const KEYS = new Set(["content", "config", "products"]);

/** Coupon codes are private: customers validate codes through /api/coupon. */
function publicView(key, data) {
  if (key !== "config" || !data) return data;
  const { coupons, ...rest } = data;
  return rest;
}

export const GET = handle(async (_req, { params }) => {
  if (!KEYS.has(params.key)) return json({ error: "notFound" }, 404);
  const data = await getDocument(params.key);
  return json({ data: isAdminRequest() ? data : publicView(params.key, data) });
});

export const PUT = handle(async (req, { params }) => {
  if (!KEYS.has(params.key)) return json({ error: "notFound" }, 404);
  if (!isAdminRequest()) return forbidden();
  const data = await body(req, 4_000_000);
  if (!data || typeof data !== "object" || Array.isArray(data)) return json({ error: "invalid" }, 400);
  await putDocument(params.key, data);
  return json({ ok: true });
});
