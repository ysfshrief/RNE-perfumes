import { handle, json, forbidden } from "@/lib/server/http";
import { listRecords } from "@/lib/server/db";
import { isAdminRequest } from "@/lib/server/session";

export const dynamic = "force-dynamic";
const COLLECTIONS = new Set(["orders", "customers"]);

// Full lists are admin-only (they contain customer details). Orders are
// created through /api/orders, customers are recorded with each order.
export const GET = handle(async (_req, { params }) => {
  if (!COLLECTIONS.has(params.name)) return json({ error: "notFound" }, 404);
  if (!isAdminRequest()) return forbidden();
  return json({ items: await listRecords(params.name) });
});
