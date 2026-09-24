// Server-side order placement. The client only says WHAT it wants (product,
// size, quantity, chosen testers, coupon code, delivery details); prices,
// discount, stock and totals are all decided here from the database, inside
// one transaction, so a tampered request can't change what is charged and two
// simultaneous orders can't both take the last bottle.

import { randomBytes } from "node:crypto";
import { buildCatalog } from "@/lib/catalog";
import { computeTotals, validateCoupon, egp } from "@/lib/pricing";
import { testerCount } from "@/data/products";
import { pName } from "@/data/productLocale";
import { getDb, upsertRecord } from "./db";

export class OrderError extends Error {
  constructor(code, detail) {
    super(code);
    this.code = code;
    this.detail = detail;
    this.status = 400;
  }
}

const PHONE_OK = (v) => /^01[0125]\d{8}$/.test(String(v || "").replace(/[\s-]/g, "").replace(/^(\+|00)20/, "0"));
const EMAIL_OK = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || "").trim());
const clip = (v, n = 300) => String(v ?? "").trim().slice(0, n);

export async function placeOrder(input, { user } = {}) {
  const c = input?.customer || {};
  const customer = {
    name: clip(c.name, 120),
    phone: clip(c.phone, 30).replace(/[\s-]/g, "").replace(/^(\+|00)20/, "0"),
    email: clip(c.email, 160).toLowerCase(),
    governorate: clip(c.governorate, 60),
    city: clip(c.city, 80),
    address: clip(c.address, 400),
  };
  if (!customer.name || !customer.governorate || !customer.city || customer.address.length < 8) throw new OrderError("invalidCustomer");
  if (!PHONE_OK(customer.phone)) throw new OrderError("invalidPhone");
  if (!EMAIL_OK(customer.email)) throw new OrderError("invalidEmail");

  const wanted = Array.isArray(input?.items) ? input.items.slice(0, 50) : [];
  if (!wanted.length) throw new OrderError("emptyCart");

  const db = await getDb();
  return db.tx(async (tx) => {
    // Lock the catalogue + settings rows for the duration of the order.
    const [prodRow] = await tx.query("SELECT data FROM rne_documents WHERE key = 'products' FOR UPDATE");
    const [cfgRow] = await tx.query("SELECT data FROM rne_documents WHERE key = 'config' FOR UPDATE");
    const overrides = prodRow?.data || {};
    const config = cfgRow?.data || {};
    const catalog = buildCatalog(overrides);

    const payments = config.payments || {};
    const payment = String(input.payment || "cod");
    if (payments[payment] === false) throw new OrderError("paymentUnavailable");

    // Resolve every line against the live catalogue.
    const lines = [];
    const need = new Map(); // productId → { size → qty }
    for (const it of wanted) {
      const qty = Math.floor(Number(it?.qty));
      if (!(qty >= 1 && qty <= 20)) throw new OrderError("invalidQty");
      const p = catalog.find((x) => x.id === it?.id);
      if (!p || p.hidden) throw new OrderError("unavailable", { id: it?.id });
      const size = (p.sizes || []).find((s) => s.size === it?.size);
      if (!size) throw new OrderError("unavailable", { id: p.id });

      let scents = null;
      if (p.isDiscoverySet) {
        const ids = Array.isArray(it.selectedScents) ? it.selectedScents.map((s) => (typeof s === "string" ? s : s?.id)) : [];
        const n = testerCount(p);
        const unique = new Set(ids);
        const excluded = new Set(p.testerExclude || []);
        const picked = ids.map((id) => catalog.find((x) => x.id === id && !x.isDiscoverySet && !x.hidden && !excluded.has(x.id)));
        if (ids.length !== n || unique.size !== n || picked.some((x) => !x)) throw new OrderError("invalidTesters", { n });
        scents = picked;
      }

      const bucket = need.get(p.id) || {};
      bucket[size.size] = (bucket[size.size] || 0) + qty;
      need.set(p.id, bucket);
      lines.push({ p, size, qty, scents });
    }

    // Stock check (after summing duplicate lines of the same size).
    for (const [pid, bySize] of need) {
      const p = catalog.find((x) => x.id === pid);
      for (const [sz, qty] of Object.entries(bySize)) {
        const s = p.sizes.find((x) => x.size === sz);
        if (Number(s.stock) < qty) throw new OrderError("outOfStock", { id: pid, name: p.name, size: sz, left: Number(s.stock) || 0 });
      }
    }

    const cart = lines.map(({ size, qty }) => ({ price: size.price, qty }));
    let coupon = null;
    if (input.couponCode) {
      const res = validateCoupon(input.couponCode, config.coupons, { subtotal: computeTotals({ cart }).subtotal });
      if (!res.ok) throw new OrderError("invalidCoupon", { reason: res.reason });
      coupon = res.coupon;
    }
    const totals = computeTotals({ cart, coupon });

    // Take the stock.
    const nextOverrides = { ...overrides };
    const custom = Array.isArray(overrides.__custom__) ? [...overrides.__custom__] : [];
    for (const [pid, bySize] of need) {
      const p = catalog.find((x) => x.id === pid);
      const sizes = p.sizes.map((s) => (bySize[s.size] ? { ...s, stock: Math.max(0, Number(s.stock) - bySize[s.size]) } : s));
      const ci = custom.findIndex((x) => x.id === pid);
      if (ci >= 0) custom[ci] = { ...custom[ci], sizes };
      else nextOverrides[pid] = { ...(nextOverrides[pid] || {}), sizes };
    }
    if (custom.length) nextOverrides.__custom__ = custom;
    nextOverrides._v = Date.now();
    await tx.query(
      `INSERT INTO rne_documents (key, data, updated_at) VALUES ('products', $1::jsonb, now())
       ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [JSON.stringify(nextOverrides)]
    );

    // Count the coupon redemption.
    if (coupon) {
      const coupons = (config.coupons || []).map((cp) =>
        String(cp.code).toUpperCase() === coupon.code ? { ...cp, uses: (Number(cp.uses) || 0) + 1 } : cp
      );
      await tx.query(
        "UPDATE rne_documents SET data = $1::jsonb, updated_at = now() WHERE key = 'config'",
        [JSON.stringify({ ...config, coupons, _v: Date.now() })]
      );
    }

    const now = new Date().toISOString();
    const order = {
      id: `${Date.now()}_${randomBytes(3).toString("hex")}`,
      createdAt: now,
      status: "New",
      userId: user?.uid || null,
      userEmail: (user?.email || customer.email).toLowerCase(),
      customer,
      items: lines.map(({ p, size, qty, scents }) => ({
        id: p.id,
        name: p.name,
        size: size.size,
        unitPrice: egp(size.price),
        qty,
        lineTotal: egp(size.price * qty),
        selectedScents: scents ? scents.map((s) => s.name) : null,
        selectedScentsAr: scents ? scents.map((s) => pName(s, "ar")) : null,
      })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
      coupon: totals.couponCode,
      couponType: coupon ? coupon.type : null,
      couponValue: coupon ? coupon.value : null,
      currency: "EGP",
      payment,
      note: clip(input.note, 500),
    };
    await upsertRecord("orders", order, tx);
    await upsertRecord("customers", { id: `cust_${customer.email}`, createdAt: now, ...customer }, tx);
    return order;
  });
}
