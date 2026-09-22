"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { useProducts } from "@/context/ProductContext";
import { pName } from "@/data/productLocale";
import { testerCount, DEFAULT_TESTER_COUNT } from "@/data/products";
import { useToast } from "@/components/admin/Toast";
import { Section, Field, TextInput, Toggle, SaveBar, EmptyState, adminUi as u } from "@/components/admin/ui";
import ImageListEditor, { cleanImages, imagesInvalid } from "@/components/admin/ImageListEditor";
import adminStyles from "../admin.module.css";

/**
 * Test Package ("Try before you buy") management: number of testers, price,
 * stock, images, copy, and which fragrances customers may pick.
 * The tester count drives every label on the site ("Choose 5 testers"…),
 * the picker, the cart validation and the size label.
 */
export default function AdminTesters() {
  const { lang } = useLang();
  const { allProducts, updateProduct, overrides } = useProducts();
  const { toast } = useToast();
  const ar = lang === "ar";
  const T = (a, e) => (ar ? a : e);

  const pkg = allProducts.find((p) => p.isDiscoverySet);
  const scents = allProducts.filter((p) => !p.isDiscoverySet);

  const build = () => pkg && ({
    testerCount: testerCount(pkg),
    price: String(pkg.sizes?.[0]?.price ?? ""),
    oldPrice: pkg.sizes?.[0]?.oldPrice ? String(pkg.sizes[0].oldPrice) : "",
    stock: String(pkg.sizes?.[0]?.stock ?? 0),
    vial: (pkg.sizes?.[0]?.size || "").replace(/^\s*\d+\s*[×x]\s*/, "") || "5ml",
    images: [...(pkg.images || [])],
    name: pkg.name || "",
    nameAr: pkg.nameAr || pName(pkg, "ar"),
    tagline: pkg.tagline || "",
    taglineAr: pkg.taglineAr || "",
    description: pkg.description || "",
    descriptionAr: pkg.descriptionAr || "",
    hidden: !!pkg.hidden,
    exclude: [...(pkg.testerExclude || [])],
  });

  const [form, setForm] = useState(null);
  const [clean, setClean] = useState("");
  const dirty = !!form && JSON.stringify(form) !== clean;
  const reset = () => { const f = build(); setForm(f); setClean(JSON.stringify(f)); };
  const snapshot = JSON.stringify(overrides?.[pkg?.id] || null);
  useEffect(() => { if (!form || !dirty) reset(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot, !!pkg]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const errors = useMemo(() => {
    if (!form) return {};
    const e = {};
    const n = Number(form.testerCount);
    if (!Number.isInteger(n) || n < 2 || n > 12) e.count = T("العدد بين ٢ و١٢", "Between 2 and 12");
    if (!(Number(form.price) > 0)) e.price = T("أدخل سعرًا أكبر من صفر", "Enter a price above zero");
    if (form.oldPrice && !(Number(form.oldPrice) > Number(form.price))) e.oldPrice = T("السعر قبل الخصم يجب أن يكون أعلى من السعر", "Old price must be higher than the price");
    if (!(Number(form.stock) >= 0) || form.stock === "") e.stock = T("أدخل رقمًا (٠ أو أكثر)", "Enter 0 or more");
    if (imagesInvalid(form.images)) e.images = true;
    const eligible = scents.filter((s) => !s.hidden && !form.exclude.includes(s.id)).length;
    if (Number.isInteger(n) && eligible < n) e.eligible = T(`متاح ${eligible} عطر فقط — يجب أن يكون المتاح ${n} على الأقل`, `Only ${eligible} fragrances available — at least ${n} needed`);
    return e;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, lang, scents]);
  const errorCount = Object.keys(errors).length;

  if (!pkg) {
    return (
      <>
        <div className={adminStyles.pageHead}><h1 className={adminStyles.pageTitle}>{T("التيسترات", "Testers")}</h1></div>
        <EmptyState>{T("لا يوجد منتج تيست باكيدچ.", "No Test Package product found.")}</EmptyState>
      </>
    );
  }
  if (!form) return null;

  const save = () => {
    if (errorCount) return;
    const n = Number(form.testerCount) || DEFAULT_TESTER_COUNT;
    const images = cleanImages(form.images);
    updateProduct(pkg.id, {
      testerCount: n,
      sizes: [{
        size: `${n} × ${form.vial.trim() || "5ml"}`,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stock: Math.max(0, Math.floor(Number(form.stock) || 0)),
      }],
      images,
      image: images[0] || "",
      name: form.name.trim() || "Test Package",
      nameAr: form.nameAr.trim(),
      tagline: form.tagline,
      taglineAr: form.taglineAr,
      description: form.description,
      descriptionAr: form.descriptionAr,
      hidden: form.hidden,
      testerExclude: form.exclude,
    });
    setClean(JSON.stringify(form));
    toast(T("تم حفظ التيست باكيدچ", "Test Package saved"));
  };

  return (
    <>
      <div className={adminStyles.pageHead}>
        <h1 className={adminStyles.pageTitle}>{T("التيسترات — جرّب قبل ما تشتري", "Testers — Try before you buy")}</h1>
        <p className={adminStyles.pageSub}>
          {T("عدد التيسترات هنا يتحكم في كل النصوص («اختار ٥ تيسترات»)، وفي اختيار العميل، والسلة، والطلب.",
             "The tester count here drives every label (“Choose 5 testers”), the picker, the cart and the order.")}
          {" "}<Link href={`/product/${pkg.slug}`} target="_blank" style={{ textDecoration: "underline" }}>{T("معاينة ↗", "Preview ↗")}</Link>
        </p>
      </div>

      <Section id="t-basics" title={T("العدد والسعر والمخزون", "Count, price & stock")}>
        <div className={u.grid}>
          <Field label={T("عدد التيسترات في الباكيدچ", "Testers per package")} error={errors.count} help={T("الافتراضي ٥", "Default is 5")}>
            <TextInput type="number" dir="ltr" min={2} max={12} value={form.testerCount} onChange={(v) => set({ testerCount: v === "" ? "" : Number(v) })} invalid={!!errors.count} />
          </Field>
          <Field label={T("حجم التيستر", "Vial size")} help={T(`يظهر كـ «${form.testerCount} × ${form.vial}»`, `Shown as “${form.testerCount} × ${form.vial}”`)}>
            <TextInput dir="ltr" value={form.vial} onChange={(v) => set({ vial: v })} placeholder="5ml" />
          </Field>
          <Field label={T("السعر (ج.م)", "Price (EGP)")} error={errors.price}>
            <TextInput type="number" dir="ltr" min={0} value={form.price} onChange={(v) => set({ price: v })} invalid={!!errors.price} />
          </Field>
          <Field label={T("السعر قبل الخصم (اختياري)", "Old price (optional)")} error={errors.oldPrice}>
            <TextInput type="number" dir="ltr" min={0} value={form.oldPrice} onChange={(v) => set({ oldPrice: v })} invalid={!!errors.oldPrice} placeholder="—" />
          </Field>
          <Field label={T("المخزون (عدد الباكيدچات)", "Stock (packages)")} error={errors.stock}>
            <TextInput type="number" dir="ltr" min={0} value={form.stock} onChange={(v) => set({ stock: v })} invalid={!!errors.stock} />
          </Field>
        </div>
        <Toggle label={T("إخفاء التيست باكيدچ من المتجر", "Hide the Test Package from the store")} checked={form.hidden} onChange={(v) => set({ hidden: v })} />
      </Section>

      <Section id="t-scents" title={T("العطور المتاحة للاختيار", "Fragrances customers can choose")} description={T("ألغِ تحديد أي عطر لا تريد تقديمه كتيستر. العطور المخفية من المتجر لا تظهر تلقائيًا.", "Untick any fragrance you don't offer as a tester. Fragrances hidden from the store never appear.")}>
        {errors.eligible && <p className={u.error} role="alert" style={{ marginBottom: "0.8rem" }}>{errors.eligible}</p>}
        <div className={u.grid}>
          {scents.map((s) => {
            const on = !form.exclude.includes(s.id);
            return (
              <label key={s.id} className={u.item} style={{ display: "flex", alignItems: "center", gap: "0.6rem", margin: 0, opacity: s.hidden ? 0.5 : 1, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => set({ exclude: on ? [...form.exclude, s.id] : form.exclude.filter((x) => x !== s.id) })}
                  style={{ width: 18, height: 18, accentColor: "var(--ink)" }}
                />
                <span style={{ fontSize: "0.9rem" }}>{pName(s, lang)}{s.hidden ? ` · ${T("مخفي", "hidden")}` : ""}</span>
              </label>
            );
          })}
        </div>
      </Section>

      <Section id="t-images" title={T("صور الباكيدچ", "Package images")}>
        <ImageListEditor images={form.images} onChange={(images) => set({ images })} T={T} />
      </Section>

      <Section id="t-copy" title={T("الاسم والنصوص", "Name & text")} description={T("استخدم {n} مكان الرقم ليتغير تلقائيًا مع عدد التيسترات.", "Use {n} instead of the number so it follows the tester count.")}>
        <div className={u.langPair}>
          <Field label={T("الاسم — عربي", "Name — Arabic")}><TextInput dir="rtl" value={form.nameAr} onChange={(v) => set({ nameAr: v })} /></Field>
          <Field label={T("الاسم — English", "Name — English")}><TextInput dir="ltr" value={form.name} onChange={(v) => set({ name: v })} /></Field>
          <Field label={T("الوصف المختصر — عربي", "Short line — Arabic")} help={T("فارغ = النص الافتراضي", "Empty = default text")}><TextInput dir="rtl" value={form.taglineAr} onChange={(v) => set({ taglineAr: v })} placeholder="اختار {n} تيسترات واكتشف عطرك المفضّل" /></Field>
          <Field label={T("الوصف المختصر — English", "Short line — English")}><TextInput dir="ltr" value={form.tagline} onChange={(v) => set({ tagline: v })} /></Field>
          <Field label={T("الوصف الكامل — عربي", "Description — Arabic")}><TextInput dir="rtl" multiline value={form.descriptionAr} onChange={(v) => set({ descriptionAr: v })} /></Field>
          <Field label={T("الوصف الكامل — English", "Description — English")}><TextInput dir="ltr" multiline value={form.description} onChange={(v) => set({ description: v })} /></Field>
        </div>
      </Section>

      <SaveBar dirty={dirty} onSave={save} onDiscard={reset} T={T} errorCount={errorCount} />
    </>
  );
}
