"use client";

import { Fragment, useState, useEffect, useMemo } from "react";
import { useLang } from "@/context/LangContext";
import { useProducts } from "@/context/ProductContext";
import { subscribeCollection, updateInCollection } from "@/lib/store";
import { egp } from "@/lib/pricing";
import { useToast } from "@/components/admin/Toast";
import { adminUi as u } from "@/components/admin/ui";
import styles from "../admin.module.css";
import o from "./orders.module.css";

const FLOW = ["New", "Confirmed", "Preparing", "OutForDelivery", "Delivered"];
const EXTRA = ["Cancelled", "Returned"];
const INACTIVE = new Set(EXTRA);

const STATUS_STYLE = {
  New: { bg: "#eceae4", c: "var(--ink)" },
  Confirmed: { bg: "#f6ecd8", c: "var(--amber-deep)" },
  Preparing: { bg: "#f6ecd8", c: "var(--amber-deep)" },
  OutForDelivery: { bg: "#e0e8ee", c: "#3d5a6b" },
  Delivered: { bg: "#e4efe4", c: "var(--success)" },
  Cancelled: { bg: "#f7e7e4", c: "var(--danger)" },
  Returned: { bg: "#f7e7e4", c: "var(--danger)" },
};
const FALLBACK_STYLE = { bg: "#eceae4", c: "var(--ink-dim)" };

const waNumber = (phone) => String(phone || "").replace(/\D/g, "").replace(/^0/, "20");

export default function AdminOrders() {
  const { t, lang } = useLang();
  const { allProducts, updateProducts } = useProducts();
  const { toast } = useToast();
  const cur = t("common.currency");
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => subscribeCollection("orders", setOrders), []);

  /**
   * Stock was taken when the order was placed. Cancelling / returning puts
   * it back; re-activating a cancelled order takes it again. `restocked`
   * on the order guarantees each direction happens only once.
   */
  const adjustStock = (ord, direction) => {
    const byProduct = new Map();
    (ord.items || []).forEach((it) => {
      if (!it.id || !it.size) return;
      const m = byProduct.get(it.id) || {};
      m[it.size] = (m[it.size] || 0) + (Number(it.qty) || 0);
      byProduct.set(it.id, m);
    });
    const patches = {};
    byProduct.forEach((bySize, pid) => {
      const p = allProducts.find((x) => x.id === pid);
      if (!p) return;
      patches[pid] = {
        sizes: p.sizes.map((s) => (bySize[s.size] ? { ...s, stock: Math.max(0, (Number(s.stock) || 0) + direction * bySize[s.size]) } : s)),
      };
    });
    updateProducts(patches);
  };

  const setStatus = (ord, status) => {
    if (ord.status === status) return;
    const goingInactive = INACTIVE.has(status) && !INACTIVE.has(ord.status);
    const reactivating = !INACTIVE.has(status) && INACTIVE.has(ord.status);
    if (goingInactive && !confirm(t("admin.confirmCancel", { status: t(`status.${status}`) }))) return;

    const patch = { status, updatedAt: new Date().toISOString() };
    if (goingInactive && !ord.restocked) { adjustStock(ord, +1); patch.restocked = true; }
    if (reactivating && ord.restocked) { adjustStock(ord, -1); patch.restocked = false; }

    setOrders((list) => list.map((x) => (x.id === ord.id ? { ...x, ...patch } : x)));
    updateInCollection("orders", ord.id, patch);
    toast(`${t("admin.statusUpdated")}: ${t(`status.${status}`)}${patch.restocked ? ` · ${t("admin.restocked")}` : ""}`);
  };

  const counts = useMemo(() => {
    const c = { All: orders.length };
    orders.forEach((x) => { c[x.status] = (c[x.status] || 0) + 1; });
    return c;
  }, [orders]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((ord) => {
      if (filter !== "All" && ord.status !== filter) return false;
      if (!q) return true;
      const c = ord.customer || {};
      return `${ord.id} ${c.name || ""} ${c.phone || ""} ${c.email || ""}`.toLowerCase().includes(q);
    });
  }, [orders, filter, query]);

  const date = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleString(lang === "ar" ? "ar-EG" : "en-GB", { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t("admin.orders")}</h1>
        <p className={styles.pageSub}>{t("admin.stockRule")}</p>
      </div>

      <div className={o.toolbar}>
        <input
          className={u.input}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("admin.searchOrders")}
          aria-label={t("admin.searchOrders")}
        />
      </div>

      <div className={o.filters} role="tablist">
        {["All", ...FLOW, ...EXTRA].map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            className={`${o.filterBtn} ${filter === f ? o.filterOn : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "All" ? t("admin.all") : t(`status.${f}`)}
            <span className={o.count}>{counts[f] || 0}</span>
          </button>
        ))}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t("admin.colOrder")}</th>
              <th>{t("admin.colCustomer")}</th>
              <th>{t("admin.colGov")}</th>
              <th>{t("admin.colDate")}</th>
              <th>{t("admin.colTotal")}</th>
              <th>{t("admin.colStatus")}</th>
              <th><span className="sr-only">{t("admin.manageBtn")}</span></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((ord) => {
              const st = STATUS_STYLE[ord.status] || FALLBACK_STYLE;
              const c = ord.customer || {};
              return (
                <Fragment key={ord.id}>
                  <tr>
                    <td><strong className="keep-latin">#{String(ord.id).slice(0, 8)}</strong></td>
                    <td>{c.name || (typeof ord.customer === "string" ? ord.customer : "—")}</td>
                    <td>{c.governorate || ord.gov || "—"}</td>
                    <td>{date(ord.createdAt || ord.date)}</td>
                    <td><span className="price">{egp(ord.total)} {cur}</span></td>
                    <td>
                      <span className={styles.pill} style={{ background: st.bg, color: st.c }}>
                        {t(`status.${ord.status}`)}
                      </span>
                    </td>
                    <td>
                      <button type="button" className={styles.btnSm} aria-expanded={expanded === ord.id} onClick={() => setExpanded(expanded === ord.id ? null : ord.id)}>
                        {expanded === ord.id ? t("admin.close") : t("admin.manageBtn")}
                      </button>
                    </td>
                  </tr>
                  {expanded === ord.id && (
                    <tr>
                      <td colSpan={7} className={o.expandCell}>
                        <div className={o.expand}>
                          <div>
                            <h4>{t("admin.contact")}</h4>
                            <p><strong>{c.name}</strong></p>
                            {c.phone && (
                              <p className={o.contactRow}>
                                <a href={`tel:${c.phone}`} dir="ltr">{c.phone}</a>
                                <a href={`https://wa.me/${waNumber(c.phone)}`} target="_blank" rel="noopener noreferrer" className={o.wa}>WhatsApp</a>
                              </p>
                            )}
                            {c.email && <p><a href={`mailto:${c.email}`} dir="ltr">{c.email}</a></p>}
                            {c.address && <p>{c.address}{c.city ? `، ${c.city}` : ""}{c.governorate ? `، ${c.governorate}` : ""}</p>}

                            <h4>{t("admin.items")}</h4>
                            <ul className={o.items}>
                              {(ord.items || []).map((it, i) => {
                                const scents = lang === "ar" ? it.selectedScentsAr || it.selectedScents : it.selectedScents;
                                return (
                                  <li key={i}>
                                    <span>{it.name || it.n} · <bdi>{it.size || it.s}</bdi> × {it.qty || it.q}</span>
                                    <span className="price">{egp(it.lineTotal ?? (it.unitPrice || 0) * (it.qty || 0))} {cur}</span>
                                    {scents?.length > 0 && (
                                      <span className={o.scents}>{t("discovery.testers")}: {scents.join("، ")}</span>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                            <div className={o.totals}>
                              <span>{t("cart.subtotal")}</span><span className="price">{egp(ord.subtotal)} {cur}</span>
                              {Number(ord.discount) > 0 && (<><span>{t("cart.discount")}{ord.coupon ? ` (${ord.coupon})` : ""}</span><span className="price">−{egp(ord.discount)} {cur}</span></>)}
                              <strong>{t("cart.total")}</strong><strong className="price">{egp(ord.total)} {cur}</strong>
                              <span>{t("checkout.payment")}</span><span>{ord.payment ? t(`pay.${ord.payment}`) : "—"}</span>
                            </div>
                          </div>
                          <div>
                            <h4>{t("admin.updateStatus")}</h4>
                            <div className={o.statusBtns}>
                              {[...FLOW, ...EXTRA].map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  aria-pressed={ord.status === s}
                                  className={`${o.statusBtn} ${ord.status === s ? o.statusBtnOn : ""} ${INACTIVE.has(s) ? o.statusDanger : ""}`}
                                  onClick={() => setStatus(ord, s)}
                                >
                                  {t(`status.${s}`)}
                                </button>
                              ))}
                            </div>
                            <p className={o.hint}>{t("admin.confirmHint")}</p>
                            {ord.updatedAt && <p className={o.meta}>{t("admin.lastUpdate")}: {date(ord.updatedAt)}</p>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {shown.length === 0 && (
          <p className={o.empty}>{orders.length === 0 ? t("admin.noOrders") : t("admin.noMatchOrders")}</p>
        )}
      </div>
    </>
  );
}
