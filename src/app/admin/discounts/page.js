"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { useConfig } from "@/context/ConfigContext";
import styles from "../admin.module.css";
import { useToast } from "@/components/admin/Toast";
import d from "./discounts.module.css";

export default function AdminDiscounts() {
  const { t, lang } = useLang();
  const { toast } = useToast();
  const T = (a, e) => (lang === "ar" ? a : e);
  const [tried, setTried] = useState(false);
  const { config, save } = useConfig();
  const cur = t("common.currency");
  const coupons = config.coupons || [];
  const [form, setForm] = useState({ code: "", type: "percent", value: "", expiresAt: "", minOrder: "", usageLimit: "" });

  const persist = (next) => save({ ...config, coupons: next });

  const typeLabel = (ty) => (ty === "percent" ? t("admin.percentage") : t("admin.fixed"));
  const toggle = (code) => {
    const c = coupons.find((x) => x.code === code);
    persist(coupons.map((x) => (x.code === code ? { ...x, active: !x.active } : x)));
    toast(c?.active ? T(`تم إيقاف ${code}`, `${code} disabled`) : T(`تم تفعيل ${code}`, `${code} enabled`));
  };
  const remove = (code) => {
    if (!confirm(T(`حذف الكوبون ${code} نهائيًا؟`, `Delete coupon ${code} permanently?`))) return;
    persist(coupons.filter((c) => c.code !== code));
    toast(T("تم حذف الكوبون", "Coupon deleted"), "info");
  };

  const codeClean = form.code.trim().toUpperCase();
  const errors = {};
  if (!/^[A-Z0-9_-]{3,20}$/.test(codeClean)) errors.code = T("٣–٢٠ حرف إنجليزي أو رقم، بدون مسافات", "3–20 letters or digits, no spaces");
  const val = Number(form.value);
  if (!(val > 0)) errors.value = T("القيمة يجب أن تكون أكبر من صفر", "Value must be above zero");
  else if (form.type === "percent" && val > 100) errors.value = T("النسبة لا تتجاوز ١٠٠٪", "Percentage cannot exceed 100%");
  if (form.minOrder && !(Number(form.minOrder) >= 0)) errors.minOrder = T("رقم غير صالح", "Invalid number");
  if (form.usageLimit && !(Number.isInteger(Number(form.usageLimit)) && Number(form.usageLimit) > 0)) errors.usageLimit = T("رقم صحيح أكبر من صفر", "Whole number above zero");
  if (form.expiresAt && new Date(form.expiresAt) < new Date(new Date().toDateString())) errors.expiresAt = T("التاريخ في الماضي", "Date is in the past");
  const exists = coupons.some((c) => String(c.code).toUpperCase() === codeClean);
  const err = (k) => (tried ? errors[k] : null);

  const add = () => {
    setTried(true);
    const code = codeClean;
    if (Object.keys(errors).length) return;
    if (exists && !confirm(T(`الكوبون ${code} موجود بالفعل. استبداله بالإعدادات الجديدة؟ (سيبدأ عدّاد الاستخدام من الصفر)`, `${code} already exists. Replace it with these settings? (usage count resets)`))) return;
    // Codes are unique — updating an existing one rather than silently
    // creating a duplicate the validator would never reach.
    const rest = coupons.filter((c) => String(c.code).toUpperCase() !== code);
    persist([
      {
        code,
        type: form.type,
        value: form.value,
        expiresAt: form.expiresAt || null,
        minOrder: form.minOrder || null,
        usageLimit: form.usageLimit || null,
        active: true,
        uses: 0,
      },
      ...rest,
    ]);
    setForm({ code: "", type: "percent", value: "", expiresAt: "", minOrder: "", usageLimit: "" });
    setTried(false);
    toast(exists ? T(`تم تحديث ${code}`, `${code} updated`) : T(`تم إنشاء ${code}`, `${code} created`));
  };
  const E = ({ k }) => (err(k) ? <span className={d.err} role="alert">{err(k)}</span> : null);

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t("admin.discountsTitle")}</h1>
        <p className={styles.pageSub}>{t("admin.discountsSub")}</p>
      </div>

      <div className={d.layout}>
        <div className={styles.card}>
          <h3 className={d.formTitle}>{t("admin.newCoupon")}</h3>
          <div className={d.field}>
            <label>{t("admin.code")}</label>
            <input dir="ltr" value={form.code} aria-invalid={!!err("code")} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase().replace(/\s/g, "") }))} placeholder="SUMMER20" />
            <E k="code" />
            {exists && !err("code") && <span className={d.warn}>{T("كود موجود — سيتم تحديثه", "Existing code — it will be updated")}</span>}
          </div>
          <div className={d.field}>
            <label>{t("admin.type")}</label>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              <option value="percent">{t("admin.percentage")}</option>
              <option value="fixed">{t("admin.fixed")}</option>
            </select>
          </div>
          <div className={d.field}>
            <label>{t("admin.value")} {form.type === "percent" ? "(%)" : `(${cur})`}</label>
            <input dir="ltr" type="number" min="0" value={form.value} aria-invalid={!!err("value")} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} />
            <E k="value" />
          </div>
          <div className={d.field}>
            <label>{t("admin.couponExpiry")}</label>
            <input type="date" value={form.expiresAt} aria-invalid={!!err("expiresAt")} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))} />
            <E k="expiresAt" />
          </div>
          <div className={d.field}>
            <label>{t("admin.couponMinOrder")} ({cur})</label>
            <input type="number" min="0" value={form.minOrder} placeholder="0" onChange={(e) => setForm((f) => ({ ...f, minOrder: e.target.value }))} />
            <E k="minOrder" />
          </div>
          <div className={d.field}>
            <label>{t("admin.couponUsageLimit")}</label>
            <input type="number" min="0" value={form.usageLimit} placeholder="∞" onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))} />
            <E k="usageLimit" />
          </div>
          <button className={`${styles.btnSm} ${styles.btnSmSolid}`} style={{ width: "100%", marginTop: "0.5rem", padding: "0.6rem" }} onClick={add}>
            {t("admin.createCoupon")}
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("admin.code")}</th>
                <th>{t("admin.type")}</th>
                <th>{t("admin.value")}</th>
                <th>{t("admin.couponLimits")}</th>
                <th>{t("admin.uses")}</th>
                <th>{t("admin.colStatus")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--ink-dim)" }}>{T("لا توجد كوبونات بعد — أنشئ أول كوبون من النموذج.", "No coupons yet — create your first one with the form.")}</td></tr>
              )}
              {coupons.map((c) => (
                <tr key={c.code}>
                  <td><strong className="keep-latin">{c.code}</strong></td>
                  <td>{typeLabel(c.type)}</td>
                  <td>{c.type === "fixed" ? `${c.value} ${cur}` : `${c.value}%`}</td>
                  <td className={d.limits}>
                    {c.expiresAt && <span>⏳ {c.expiresAt}</span>}
                    {c.minOrder ? <span>≥ {c.minOrder} {cur}</span> : null}
                    {c.usageLimit ? <span>≤ {c.usageLimit}</span> : null}
                    {!c.expiresAt && !c.minOrder && !c.usageLimit && <span>—</span>}
                  </td>
                  <td>{c.uses || 0}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                  <td>
                    <span className={styles.pill} style={{ background: c.active ? "rgba(106,146,104,0.2)" : "rgba(255,255,255,0.07)", color: c.active ? "var(--success)" : "var(--olive)" }}>
                      {c.active ? t("admin.active") : t("admin.inactive")}
                    </span>
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button type="button" className={styles.btnSm} onClick={() => toggle(c.code)}>{c.active ? t("admin.disable") : t("admin.enable")}</button>
                      <button type="button" className={`${styles.btnSm} ${styles.btnSmDanger}`} onClick={() => remove(c.code)}>{t("admin.delete")}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
