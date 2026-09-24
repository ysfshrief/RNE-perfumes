"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { useProducts } from "@/context/ProductContext";
import { productAr, pName } from "@/data/productLocale";
import { getMinPrice } from "@/data/products";
import { COLLECTIONS, collectionKeys } from "@/data/productMeta";
import { placeholderProducts } from "@/data/placeholderProducts";
import { normalizeImageUrl, isImageUrl, productImages } from "@/lib/media";
import { useToast } from "@/components/admin/Toast";
import { Field, TextInput, Toggle, EmptyState, adminUi as u } from "@/components/admin/ui";
import ImageListEditor, { cleanImages, imagesInvalid } from "@/components/admin/ImageListEditor";
import adminStyles from "../admin.module.css";
import styles from "./products.module.css";

const LOW_STOCK = 5;

export default function AdminProducts() {
  const { lang } = useLang();
  const { allProducts, updateProduct, addProduct, addProducts, deleteProduct, deleteProducts, resetProduct, overrides, ready } = useProducts();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState(null); // product id | "new" | null
  const [query, setQuery] = useState("");
  const [view, setView] = useState("all"); // all | visible | hidden | low
  const ar = lang === "ar";
  const cur = ar ? "ج.م" : "EGP";
  const T = (a, e) => (ar ? a : e);

  const demoLoaded = allProducts.filter((p) => p._demo).length;
  const loadDemo = () => {
    if (demoLoaded > 0) return;
    addProducts(placeholderProducts.map((d) => ({ ...d, _demo: true })));
    toast(T("تم تحميل كتالوج العرض", "Demo catalogue loaded"));
  };
  const clearDemo = () => {
    if (!confirm(T(`حذف ${demoLoaded} منتج تجريبي؟`, `Delete ${demoLoaded} demo products?`))) return;
    deleteProducts(allProducts.filter((p) => p._demo).map((p) => p.id));
    toast(T("تم حذف كتالوج العرض", "Demo catalogue removed"));
  };

  const stockOf = (p) => (p.sizes || []).reduce((n, s) => n + (Number(s.stock) || 0), 0);
  const isLow = (p) => (p.sizes || []).some((s) => Number(s.stock) <= LOW_STOCK);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allProducts.filter((p) => {
      if (q && !`${p.name} ${pName(p, "ar")} ${p.inspiredBy || ""}`.toLowerCase().includes(q)) return false;
      if (view === "visible" && p.hidden) return false;
      if (view === "hidden" && !p.hidden) return false;
      if (view === "low" && !isLow(p)) return false;
      return true;
    });
  }, [allProducts, query, view]);

  const editing = editingId === "new" ? null : allProducts.find((p) => p.id === editingId);

  const VIEWS = [
    { id: "all", label: T("الكل", "All"), n: allProducts.length },
    { id: "visible", label: T("ظاهر", "Visible"), n: allProducts.filter((p) => !p.hidden).length },
    { id: "hidden", label: T("مخفي", "Hidden"), n: allProducts.filter((p) => p.hidden).length },
    { id: "low", label: T("مخزون منخفض", "Low stock"), n: allProducts.filter(isLow).length },
  ];

  return (
    <>
      <div className={styles.head}>
        <div>
          <h1 className={adminStyles.pageTitle}>{T("المنتجات", "Products")}</h1>
          <p className={adminStyles.pageSub}>
            {T("اضغط على أي منتج لتعديل الصور والأسعار والتصنيف والنصوص.", "Tap a product to edit images, prices, classification and text.")}
          </p>
        </div>
        <div className={styles.headActions}>
          {demoLoaded > 0 ? (
            <button type="button" className={u.btnGhost} onClick={clearDemo}>{T(`حذف كتالوج العرض (${demoLoaded})`, `Remove demo catalogue (${demoLoaded})`)}</button>
          ) : (
            <button type="button" className={u.btnGhost} onClick={loadDemo}>{T(`تحميل كتالوج عرض (${placeholderProducts.length})`, `Load demo catalogue (${placeholderProducts.length})`)}</button>
          )}
          <button type="button" className={u.btnSolid} onClick={() => setEditingId("new")}>+ {T("منتج جديد", "New product")}</button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          className={u.input}
          type="search"
          placeholder={T("ابحث بالاسم أو «مستوحى من»…", "Search by name or inspiration…")}
          aria-label={T("بحث", "Search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={u.tabs} style={{ margin: 0 }} role="tablist">
          {VIEWS.map((v) => (
            <button key={v.id} role="tab" aria-selected={view === v.id} className={`${u.tab} ${view === v.id ? u.tabOn : ""}`} onClick={() => setView(v.id)}>
              {v.label} <span className={styles.tabCount}>{v.n}</span>
            </button>
          ))}
        </div>
      </div>

      {!ready && allProducts.length === 0 ? (
        <p className={adminStyles.pageSub}>{T("جارِ التحميل…", "Loading…")}</p>
      ) : filtered.length === 0 ? (
        <EmptyState action={query || view !== "all" ? <button type="button" className={u.btnGhost} onClick={() => { setQuery(""); setView("all"); }}>{T("مسح البحث", "Clear search")}</button> : null}>
          {T("لا توجد منتجات مطابقة.", "No matching products.")}
        </EmptyState>
      ) : (
        <div className={styles.grid}>
          {filtered.map((p) => {
            const img = productImages(p)[0];
            const edited = !!overrides[p.id];
            const card = (
              <>
                <div className={styles.thumb}>
                  {isImageUrl(img) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={normalizeImageUrl(img, 400)} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.opacity = 0; }} />
                  ) : (
                    <span className={styles.thumbLabel}>{T("لا صورة", "No photo")}</span>
                  )}
                  <div className={styles.tags}>
                    {p.hidden && <span className={styles.hiddenTag}>{T("مخفي", "Hidden")}</span>}
                    {isLow(p) && <span className={styles.lowTag}>{T("مخزون منخفض", "Low stock")}</span>}
                    {edited && !p._custom && <span className={styles.editedTag}>{T("معدّل", "Edited")}</span>}
                    {p.isDiscoverySet && <span className={styles.editedTag}>{T("تيسترات", "Testers")}</span>}
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <strong className={styles.cardName}>{pName(p, lang)}</strong>
                  <span className={styles.cardMeta}>
                    <span className="price">{getMinPrice(p)} {cur}</span> · {T("مخزون", "stock")} {stockOf(p)} · {productImages(p).length} {T("صورة", "img")}
                  </span>
                </div>
              </>
            );
            return p.isDiscoverySet ? (
              <Link key={p.id} href="/admin/testers" className={styles.card}>{card}</Link>
            ) : (
              <button key={p.id} type="button" className={styles.card} onClick={() => setEditingId(p.id)}>{card}</button>
            );
          })}
        </div>
      )}

      {(editing || editingId === "new") && (
        <ProductEditor
          key={editingId}
          product={editing}
          T={T}
          lang={lang}
          cur={cur}
          isEdited={!!(editing && overrides[editing.id])}
          onClose={() => setEditingId(null)}
          onSave={(patch) => {
            if (editing) {
              updateProduct(editing.id, patch);
              toast(T("تم حفظ المنتج", "Product saved"));
            } else {
              const created = addProduct(patch);
              toast(T("تمت إضافة المنتج", "Product created"));
              setEditingId(created.id);
            }
          }}
          onReset={editing && !editing._custom ? () => { resetProduct(editing.id); toast(T("تم استرجاع البيانات الأصلية", "Restored to original"), "info"); setEditingId(null); } : null}
          onDelete={editing?._custom ? () => { deleteProduct(editing.id); toast(T("تم حذف المنتج", "Product deleted"), "info"); setEditingId(null); } : null}
        />
      )}
    </>
  );
}

const SEASONS = ["Summer", "Winter"];
const GENDERS = ["Men", "Women", "Unisex"];

function ProductEditor({ product, T, lang, cur, isEdited, onClose, onSave, onReset, onDelete }) {
  const isNew = !product;
  const build = () => ({
    name: product?.name || "",
    nameAr: product?.nameAr || (product ? productAr[product.id]?.name || "" : ""),
    inspiredBy: product?.inspiredBy || "",
    tagline: product?.tagline || "",
    taglineAr: product?.taglineAr || (product ? productAr[product.id]?.tagline || "" : ""),
    description: product?.description || "",
    descriptionAr: product?.descriptionAr || (product ? productAr[product.id]?.description || "" : ""),
    gender: product?.gender || "Unisex",
    season: [...(product?.season || ["Summer"])],
    familiesAuto: !(Array.isArray(product?.families) && product.families.length),
    families: [...(product?.families?.length ? product.families : product ? collectionKeys(product) : [])],
    images: product ? [...productImages(product)] : [""],
    imageFit: product?.imageFit || "cover",
    sizes: (product?.sizes?.length ? product.sizes : [{ size: "50ml", price: "", oldPrice: null, stock: 10 }]).map((s) => ({
      size: s.size || "",
      price: s.price ?? "",
      oldPrice: s.oldPrice ?? "",
      stock: s.stock ?? 0,
    })),
    notesTop: (product?.notes?.top || []).join(", "),
    notesHeart: (product?.notes?.heart || []).join(", "),
    notesBase: (product?.notes?.base || []).join(", "),
    ingredients: product?.ingredients || "",
    ingredientsAr: product?.ingredientsAr || (product ? productAr[product.id]?.ingredients || "" : ""),
    bestSeller: !!product?.bestSeller,
    hidden: !!product?.hidden,
  });
  const [form, setForm] = useState(build);
  const [clean, setClean] = useState(() => JSON.stringify(build()));
  const [tried, setTried] = useState(false);
  const dirty = JSON.stringify(form) !== clean;
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  // Escape closes (with a guard for unsaved edits).
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const close = () => {
    if (dirty && !confirm(T("لديك تغييرات غير محفوظة. إغلاق بدون حفظ؟", "You have unsaved changes. Close without saving?"))) return;
    onClose();
  };

  const errors = {};
  if (!form.name.trim() && !form.nameAr.trim()) errors.name = T("اكتب اسم المنتج", "Enter a product name");
  if (!form.name.trim()) errors.nameEn = T("الاسم الإنجليزي مطلوب (يُستخدم في الرابط)", "English name is required (used in the link)");
  if (!form.season.length) errors.season = T("اختر موسمًا واحدًا على الأقل", "Choose at least one season");
  const sizeErr = form.sizes.map((s) => {
    if (!String(s.size).trim()) return T("اكتب المقاس", "Enter a size");
    if (!(Number(s.price) > 0)) return T("السعر يجب أن يكون أكبر من صفر", "Price must be above zero");
    if (s.oldPrice !== "" && s.oldPrice != null && !(Number(s.oldPrice) > Number(s.price))) return T("السعر قبل الخصم يجب أن يكون أعلى", "Old price must be higher");
    if (!(Number(s.stock) >= 0) || s.stock === "") return T("المخزون رقم ٠ أو أكثر", "Stock must be 0 or more");
    return null;
  });
  if (sizeErr.some(Boolean)) errors.sizes = true;
  const sizeNames = form.sizes.map((s) => String(s.size).trim().toLowerCase());
  if (new Set(sizeNames).size !== sizeNames.length) errors.sizeDup = T("كل مقاس يجب أن يكون مختلف", "Each size must be different");
  if (imagesInvalid(form.images)) errors.images = true;
  if (!form.familiesAuto && !form.families.length) errors.families = T("اختر مجموعة واحدة على الأقل أو فعّل «تلقائي»", "Pick at least one collection or switch to Automatic");
  const errorCount = Object.keys(errors).length;
  const show = (k) => (tried ? errors[k] : null);

  const splitNotes = (v) => String(v || "").split(/[,،\n]/).map((x) => x.trim()).filter(Boolean);

  const save = () => {
    setTried(true);
    if (errorCount) return;
    const images = cleanImages(form.images);
    onSave({
      name: form.name.trim(),
      nameAr: form.nameAr.trim(),
      inspiredBy: form.inspiredBy.trim() || null,
      tagline: form.tagline,
      taglineAr: form.taglineAr,
      description: form.description,
      descriptionAr: form.descriptionAr,
      gender: form.gender,
      season: form.season,
      families: form.familiesAuto ? [] : form.families,
      images,
      image: images[0] || "",
      imageFit: form.imageFit,
      sizes: form.sizes.map((s) => ({
        size: String(s.size).trim(),
        price: Number(s.price),
        oldPrice: s.oldPrice !== "" && s.oldPrice != null ? Number(s.oldPrice) : null,
        stock: Math.max(0, Math.floor(Number(s.stock) || 0)),
      })),
      notes: { top: splitNotes(form.notesTop), heart: splitNotes(form.notesHeart), base: splitNotes(form.notesBase) },
      ingredients: form.ingredients,
      ingredientsAr: form.ingredientsAr,
      bestSeller: form.bestSeller,
      hidden: form.hidden,
    });
    setClean(JSON.stringify(form));
    setTried(false);
  };

  const setSize = (i, patch) => set({ sizes: form.sizes.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  const toggle = (key, v) => set({ [key]: form[key].includes(v) ? form[key].filter((x) => x !== v) : [...form[key], v] });
  const inferred = product ? collectionKeys({ ...product, families: [] }) : [];

  return (
    <div className={styles.drawerOverlay} onClick={close}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="pe-title">
        <div className={styles.drawerHead}>
          <h2 id="pe-title">{isNew ? T("منتج جديد", "New product") : `${T("تعديل", "Edit")} — ${pName(product, lang)}`}</h2>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {!isNew && !product.hidden && (
              <Link href={`/product/${product.slug}`} target="_blank" className={u.btnGhost}>{T("عرض ↗", "View ↗")}</Link>
            )}
            <button type="button" className={styles.close} onClick={close} aria-label={T("إغلاق", "Close")}>×</button>
          </div>
        </div>

        <div className={styles.drawerBody}>
          {tried && errorCount > 0 && (
            <p className={u.error} role="alert" style={{ marginBottom: "1rem", fontSize: "0.88rem" }}>
              {T("راجع الحقول المعلّمة باللون الأحمر.", "Please check the fields marked in red.")}
            </p>
          )}

          <section className={styles.editSection}>
            <h3>{T("الصور", "Images")}</h3>
            <p className={styles.hint}>{T("الصورة الأولى هي الرئيسية (تظهر في البطاقات والسلة). باقي الصور تظهر في معرض صفحة المنتج. يمكن استخدام روابط Google Drive (مشاركة «أي شخص لديه الرابط»).", "The first image is the main one (cards, cart). The rest appear in the product gallery. Google Drive links work (share as “Anyone with the link”).")}</p>
            <ImageListEditor images={form.images} onChange={(images) => set({ images })} T={T} />
            <div style={{ marginTop: "0.8rem" }}>
              <Toggle
                label={T("إظهار الصورة كاملة بدون قص", "Show the whole image (no cropping)")}
                description={T("مفيد للصور غير المربعة. الافتراضي: تملأ الإطار.", "Useful for non-square photos. Default: fill the frame.")}
                checked={form.imageFit === "contain"}
                onChange={(v) => set({ imageFit: v ? "contain" : "cover" })}
              />
            </div>
          </section>

          <section className={styles.editSection}>
            <h3>{T("الاسم والوصف", "Name & description")}</h3>
            <div className={u.langPair}>
              <Field label={T("الاسم — عربي", "Name — Arabic")} error={show("name")}><TextInput dir="rtl" value={form.nameAr} onChange={(v) => set({ nameAr: v })} invalid={!!show("name")} /></Field>
              <Field label={T("الاسم — English *", "Name — English *")} error={show("nameEn")}><TextInput dir="ltr" value={form.name} onChange={(v) => set({ name: v })} invalid={!!show("nameEn")} /></Field>
              <Field label={T("وصف مختصر — عربي", "Short line — Arabic")}><TextInput dir="rtl" value={form.taglineAr} onChange={(v) => set({ taglineAr: v })} /></Field>
              <Field label={T("وصف مختصر — English", "Short line — English")}><TextInput dir="ltr" value={form.tagline} onChange={(v) => set({ tagline: v })} /></Field>
              <Field label={T("الوصف الكامل — عربي", "Description — Arabic")}><TextInput dir="rtl" multiline rows={4} value={form.descriptionAr} onChange={(v) => set({ descriptionAr: v })} /></Field>
              <Field label={T("الوصف الكامل — English", "Description — English")}><TextInput dir="ltr" multiline rows={4} value={form.description} onChange={(v) => set({ description: v })} /></Field>
            </div>
            <div style={{ marginTop: "0.9rem" }}>
              <Field label={T("مستوحى من", "Inspired by")} help={T("مثال: Dior Sauvage — اختياري", "e.g. Dior Sauvage — optional")}>
                <TextInput dir="ltr" value={form.inspiredBy} onChange={(v) => set({ inspiredBy: v })} />
              </Field>
            </div>
          </section>

          <section className={styles.editSection}>
            <h3>{T("التصنيف (يُستخدم في فلاتر المتجر)", "Classification (used by shop filters)")}</h3>
            <Field label={T("الجنس", "Gender")}>
              <div className={styles.choiceRow}>
                {GENDERS.map((g) => (
                  <button key={g} type="button" className={`${u.tab} ${form.gender === g ? u.tabOn : ""}`} aria-pressed={form.gender === g} onClick={() => set({ gender: g })}>
                    {g === "Men" ? T("رجالي", "Men") : g === "Women" ? T("حريمي", "Women") : T("للجنسين", "Unisex")}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={T("النوع / الموسم", "Type / season")} error={show("season")}>
              <div className={styles.choiceRow}>
                {SEASONS.map((s) => (
                  <button key={s} type="button" className={`${u.tab} ${form.season.includes(s) ? u.tabOn : ""}`} aria-pressed={form.season.includes(s)} onClick={() => toggle("season", s)}>
                    {s === "Summer" ? T("صيفي", "Summer") : T("شتوي", "Winter")}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={T("المجموعة", "Collection")} error={show("families")} help={form.familiesAuto ? T(`تلقائي من النوتات: ${inferred.map((k) => COLLECTIONS.find((c) => c.key === k)?.ar).join("، ") || "—"}`, `Automatic from notes: ${inferred.map((k) => COLLECTIONS.find((c) => c.key === k)?.en).join(", ") || "—"}`) : null}>
              <Toggle label={T("تحديد تلقائي من النوتات", "Set automatically from the notes")} checked={form.familiesAuto} onChange={(v) => set({ familiesAuto: v, families: v ? form.families : (form.families.length ? form.families : inferred) })} />
              {!form.familiesAuto && (
                <div className={styles.choiceRow}>
                  {COLLECTIONS.map((c) => (
                    <button key={c.key} type="button" className={`${u.tab} ${form.families.includes(c.key) ? u.tabOn : ""}`} aria-pressed={form.families.includes(c.key)} onClick={() => toggle("families", c.key)}>
                      {lang === "ar" ? c.ar : c.en}
                    </button>
                  ))}
                </div>
              )}
            </Field>
          </section>

          <section className={styles.editSection}>
            <h3>{T("المقاسات والأسعار والمخزون", "Sizes, prices & stock")}</h3>
            {show("sizeDup") && <p className={u.error}>{errors.sizeDup}</p>}
            <div className={styles.sizeTable}>
              <div className={styles.sizeHeadRow}>
                <span>{T("المقاس", "Size")}</span>
                <span>{T("السعر", "Price")} ({cur})</span>
                <span>{T("قبل الخصم", "Old price")}</span>
                <span>{T("المخزون", "Stock")}</span>
                <span />
              </div>
              {form.sizes.map((s, i) => (
                <div key={i}>
                  <div className={styles.sizeRow}>
                    <input className={styles.sizeInput} dir="ltr" value={s.size} onChange={(e) => setSize(i, { size: e.target.value })} aria-label={T("المقاس", "Size")} placeholder="50ml" />
                    <input className={styles.sizeInput} dir="ltr" type="number" min="0" value={s.price} onChange={(e) => setSize(i, { price: e.target.value })} aria-label={T("السعر", "Price")} />
                    <input className={styles.sizeInput} dir="ltr" type="number" min="0" value={s.oldPrice ?? ""} placeholder="—" onChange={(e) => setSize(i, { oldPrice: e.target.value })} aria-label={T("قبل الخصم", "Old price")} />
                    <input className={styles.sizeInput} dir="ltr" type="number" min="0" value={s.stock} onChange={(e) => setSize(i, { stock: e.target.value })} aria-label={T("المخزون", "Stock")} />
                    <button type="button" className={styles.rowRemove} disabled={form.sizes.length === 1} onClick={() => set({ sizes: form.sizes.filter((_, k) => k !== i) })} aria-label={T("حذف المقاس", "Remove size")}>✕</button>
                  </div>
                  {tried && sizeErr[i] && <p className={u.error}>{sizeErr[i]}</p>}
                </div>
              ))}
            </div>
            <button type="button" className={u.btnGhost} style={{ marginTop: "0.6rem" }} onClick={() => set({ sizes: [...form.sizes, { size: "", price: "", oldPrice: "", stock: 0 }] })}>
              + {T("إضافة مقاس", "Add size")}
            </button>
          </section>

          <section className={styles.editSection}>
            <h3>{T("النوتات والمكونات", "Notes & ingredients")}</h3>
            <p className={styles.hint}>{T("افصل بين النوتات بفاصلة. تُستخدم أيضًا في «اكتشف عطرك» والتصنيف التلقائي.", "Separate notes with commas. Also used by “Find your fragrance” and automatic classification.")}</p>
            <div className={u.grid}>
              <Field label={T("النوتات العليا", "Top notes")}><TextInput dir="ltr" value={form.notesTop} onChange={(v) => set({ notesTop: v })} placeholder="Bergamot, Lemon" /></Field>
              <Field label={T("نوتات القلب", "Heart notes")}><TextInput dir="ltr" value={form.notesHeart} onChange={(v) => set({ notesHeart: v })} placeholder="Rose, Jasmine" /></Field>
              <Field label={T("النوتات الأساسية", "Base notes")}><TextInput dir="ltr" value={form.notesBase} onChange={(v) => set({ notesBase: v })} placeholder="Amber, Musk" /></Field>
            </div>
            <div className={u.langPair} style={{ marginTop: "0.9rem" }}>
              <Field label={T("المكونات — عربي", "Ingredients — Arabic")}><TextInput dir="rtl" multiline rows={2} value={form.ingredientsAr} onChange={(v) => set({ ingredientsAr: v })} /></Field>
              <Field label={T("المكونات — English", "Ingredients — English")}><TextInput dir="ltr" multiline rows={2} value={form.ingredients} onChange={(v) => set({ ingredients: v })} /></Field>
            </div>
          </section>

          <section className={styles.editSection}>
            <h3>{T("الظهور", "Visibility")}</h3>
            <Toggle label={T("الأكثر مبيعًا", "Best seller")} description={T("يظهر في «الأكثر مبيعًا» ويحمل شارة.", "Shown in Best Sellers with a badge.")} checked={form.bestSeller} onChange={(v) => set({ bestSeller: v })} />
            <Toggle label={T("إخفاء من المتجر", "Hide from store")} description={T("المنتج المخفي لا يظهر للعملاء ولا يمكن طلبه.", "Hidden products are not shown or orderable.")} checked={form.hidden} onChange={(v) => set({ hidden: v })} />
          </section>
        </div>

        <div className={styles.drawerFoot}>
          {onDelete && (
            <button type="button" className={u.btnDanger} onClick={() => { if (confirm(T("حذف المنتج نهائيًا؟ لا يمكن التراجع.", "Delete this product permanently? This cannot be undone."))) onDelete(); }}>
              {T("حذف المنتج", "Delete product")}
            </button>
          )}
          {isEdited && onReset && (
            <button type="button" className={u.btnGhost} onClick={() => { if (confirm(T("استرجاع كل بيانات المنتج الأصلية؟ ستُفقد تعديلاتك.", "Restore the original product data? Your edits will be lost."))) onReset(); }}>
              {T("استرجاع الأصل", "Reset to original")}
            </button>
          )}
          <div className={styles.footRight}>
            {!dirty && !isNew && <span className={styles.savedFlash}>{T("كل التغييرات محفوظة", "All changes saved")}</span>}
            <button type="button" className={u.btnGhost} onClick={close}>{T("إغلاق", "Close")}</button>
            <button type="button" className={u.btnSolid} onClick={save} disabled={!dirty && !isNew}>
              {isNew ? T("إنشاء المنتج", "Create product") : T("حفظ", "Save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
