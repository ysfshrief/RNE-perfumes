import { handle, json, body, forbidden } from "@/lib/server/http";
import { patchRecord, deleteRecord } from "@/lib/server/db";
import { isAdminRequest } from "@/lib/server/session";

export const dynamic = "force-dynamic";
const COLLECTIONS = new Set(["orders", "customers"]);
const ORDER_FIELDS = new Set(["status", "updatedAt", "restocked", "adminNote"]);

export const PATCH = handle(async (req, { params }) => {
  if (!COLLECTIONS.has(params.name)) return json({ error: "notFound" }, 404);
  if (!isAdminRequest()) return forbidden();
  const patch = await body(req);
  // Money fields of an order are never editable after placement.
  const safe = params.name === "orders"
    ? Object.fromEntries(Object.entries(patch || {}).filter(([k]) => ORDER_FIELDS.has(k)))
    : patch;
  const data = await patchRecord(params.name, params.id, safe);
  return data ? json({ data }) : json({ error: "notFound" }, 404);
});

export const DELETE = handle(async (_req, { params }) => {
  if (!COLLECTIONS.has(params.name)) return json({ error: "notFound" }, 404);
  if (!isAdminRequest()) return forbidden();
  await deleteRecord(params.name, params.id);
  return json({ ok: true });
});
