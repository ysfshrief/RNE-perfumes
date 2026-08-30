"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { useProducts, normalizeImageUrl } from "@/context/ProductContext";
import { productAr } from "@/data/productLocale";
import { getMinPrice } from "@/data/products";
import { placeholderProducts } from "@/data/placeholderProducts";
import { isPhoto } from "@/data/products";
import adminStyles from "../admin.module.css";
import styles from "./products.module.css";

export default function AdminProducts() {
  const { lang } = useLang();
  const { allProducts, updateProduct, addProduct, addProducts, deleteProduct, deleteProducts, resetProduct, overrides } = useProducts();
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [newP, setNewP] = useState({ name: "", inspiredBy: "", tagline: "", description: "", gender: "Unisex", image: "", price: "", size: "50ml", stock: "10" });
  const ar = lang === "ar";
  const cur = ar ? "ج.م" : "EGP";

  const T = (a, e) => (ar ? a : e);

  const createProduct = () => {
    if (!newP.name || !newP.price) return;
    const p = addProduct({
      name: newP.name,
      inspiredBy: newP.inspiredBy || null,
      tagline: newP.tagline,
      description: newP.description,
      gender: newP.gender,
      image: newP.image,
      sizes: [{ size: newP.size || "50ml", price: Number(newP.price), oldPrice: null, stock: Number(newP.stock) || 10 }],
    });
    setAdding(false);
    setNewP({ name: "", inspiredBy: "", tagline: "", description: "", gender: "Unisex", image: "", price: "", size: "50ml", stock: "10" });
    setEditingId(p.id);
  };

  // ── Demo catalogue (opt-in) ──────────────────────────────
  // Loads the fictional placeholder fragrances through the SAME custom-product
  // pipeline as manually added products, so they are fully editable/removable.
  const demoLoaded = allProducts.filter((p) => p._demo).length;

  const loadDemo = () => {
    if (demoLoaded > 0) return;
    addProducts(placeholderProducts.map((d) => ({ ...d, _demo: true })));
  };
  const clearDemo = () => {
    deleteProducts(allProducts.filter((p) => p._demo).map((p) => p.id));
  };

  const filtered = allProducts.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    (productAr[p.id]?.name || "").includes(query)
  );

  const editing = allProducts.find((p) => p.id === editingId);

  return (
    <>
      <div className={styles.head}>
        <div>
          <h1 className={adminStyles.pageTitle}>{T("المنتجات", "Products")}</h1>
          <p className={adminStyles.pageSub}>
            {T(`${allProducts.length} منتج — اضغط على أي منتج لتعديله`, `${allProducts.length} products — tap any product to edit`)}
          </p>
        </div>
        <div className={styles.headActions}>
          {demoLoaded > 0 ? (
            <button className={styles.demoBtn} onClick={clearDemo}>
              {T(`مسح كتالوج العرض (${demoLoaded})`, `Clear demo catalogue (${demoLoaded})`)}
            </button>
          ) : (
            <button className={styles.demoBtn} onClick={loadDemo}>
              {T(`تحميل كتالوج عرض (${placeholderProducts.length})`, `Load demo catalogue (${placeholderProducts.length})`)}
            </button>
          )}
          <button className={styles.addBtn} onClick={() => setAdding(true)}>+ {T("أضف منتج", "Add product")}</button>
        </div>
      </div>

      {adding && (
        <div className={styles.addForm}>
          <h3>{T("منتج جديد", "New product")}</h3>
          <div className={styles.addGrid}>
            <label>{T("اسم المنتج *", "Product name *")}
              <input value={newP.name} onChange={(e) => setNewP({ ...newP, name: e.target.value })} placeholder={T("مثال: خمرة", "e.g. Khamrah")} />
            </label>
            <label>{T("مستوحى من", "Inspired by")}
              <input value={newP.inspiredBy} onChange={(e) => setNewP({ ...newP, inspiredBy: e.target.value })} placeholder="Lattafa Khamrah" />
            </label>
            <label>{T("السعر *", "Price *")}
              <input type="number" value={newP.price} onChange={(e) => setNewP({ ...newP, price: e.target.value })} placeholder="500" />
            </label>
            <label>{T("الحجم", "Size")}
              <input value={newP.size} onChange={(e) => setNewP({ ...newP, size: e.target.value })} placeholder="50ml" />
            </label>
            <label>{T("المخزون", "Stock")}
              <input type="number" value={newP.stock} onChange={(e) => setNewP({ ...newP, stock: e.target.value })} placeholder="10" />
            </label>
            <label>{T("النوع", "Gender")}
              <select value={newP.gender} onChange={(e) => setNewP({ ...newP, gender: e.target.value })}>
                <option value="Unisex">{T("للجنسين", "Unisex")}</option>
                <option value="Men">{T("رجالي", "Men")}</option>
                <option value="Women">{T("حريمي", "Women")}</option>
              </select>
            </label>
            <label className={styles.full}>{T("رابط الصورة (Drive)", "Image link (Drive)")}
              <input dir="ltr" value={newP.image} onChange={(e) => setNewP({ ...newP, image: e.target.value })} placeholder="https://drive.google.com/..." />
            </label>
            <label className={styles.full}>{T("وصف مختصر", "Short tagline")}
              <input value={newP.tagline} onChange={(e) => setNewP({ ...newP, tagline: e.target.value })} />
            </label>
            <label className={styles.full}>{T("الوصف الكامل", "Full description")}
              <textarea rows={3} value={newP.description} onChange={(e) => setNewP({ ...newP, description: e.target.value })} />
            </label>
          </div>
          <div className={styles.addActions}>
            <button className={styles.saveBtn} onClick={createProduct} disabled={!newP.name || !newP.price}>{T("حفظ المنتج", "Save product")}</button>
            <button className={styles.cancelBtn} onClick={() => setAdding(false)}>{T("إلغاء", "Cancel")}</button>
          </div>
          <p className={styles.addHint}>{T("بعد الحفظ يمكنك تعديل باقي التفاصيل بالضغط على المنتج.", "After saving you can edit the rest by tapping the product.")}</p>
        </div>
      )}

      <input
        className={styles.search}
        placeholder={T("ابحث عن منتج…", "Search products…")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Product grid */}
      <div className={styles.grid}>
        {filtered.map((p) => {
          const minPrice = getMinPrice(p);
          const totalStock = p.sizes.reduce((n, s) => n + s.stock, 0);
          const edited = !!overrides[p.id];
          const hasPhoto = isPhoto(p.images?.[0] ?? p.image);
          return (
            <button key={p.id} className={styles.card} onClick={() => setEditingId(p.id)}>
              <div className={styles.thumb} style={{ background: hasPhoto ? "#eceae4" : (p.images?.[0] ?? p.image) }}>
                {hasPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={normalizeImageUrl(p.images[0] ?? p.image)} alt="" />
                ) : (
                  <span className={styles.thumbLabel}>{T("لا صورة", "No photo")}</span>
                )}
                {p.hidden && <span className={styles.hiddenTag}>{T("مخفي", "Hidden")}</span>}
                {edited && <span className={styles.editedTag}>{T("معدّل", "Edited")}</span>}
              </div>
              <div className={styles.cardBody}>
                <strong className={styles.cardName}>{ar ? (productAr[p.id]?.name || p.name) : p.name}</strong>
                <span className={styles.cardMeta}>{minPrice} {cur} · {T("مخزون", "stock")} {totalStock}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Edit drawer */}
      {editing && (
        <ProductEditor
          key={editing.id}
          product={editing}
          onClose={() => setEditingId(null)}
          onSave={(patch) => updateProduct(editing.id, patch)}
          onReset={() => { resetProduct(editing.id); setEditingId(null); }}
          onDelete={editing._custom ? () => { deleteProduct(editing.id); setEditingId(null); } : null}
          isEdited={!!overrides[editing.id]}
          T={T}
          ar={ar}
          cur={cur}
        />
      )}
    </>
  );
}

function ProductEditor({ product, onClose, onSave, onReset, onDelete, isEdited, T, ar, cur }) {
  const [form, setForm] = useState({
    name: product.name,
    nameAr: productAr[product.id]?.name || "",
    inspiredBy: product.inspiredBy || "",
    gender: product.gender,
    hidden: !!product.hidden,
    bestSeller: !!product.bestSeller,
    images: [...(product.images || [product.image])],
    sizes: product.sizes.map((s) => ({ ...s })),
  });
  const [savedFlash, setSavedFlash] = useState(false);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const setImage = (i, val) => {
    const images = [...form.images];
    images[i] = val;
    set({ images });
  };
  const setSize = (i, field, val) => {
    const sizes = form.sizes.map((s, idx) =>
      idx === i ? { ...s, [field]: field === "size" ? val : val } : s,
    );
    set({ sizes });
  };

  const save = () => {
    onSave({
      name: form.name,
      inspiredBy: form.inspiredBy,
      gender: form.gender,
      hidden: form.hidden,
      bestSeller: form.bestSeller,
      images: form.images,
      // Coerce here, not on every keystroke — and drop rows that ended up
      // without a usable price rather than saving them as 0.
      sizes: form.sizes
        .map((s) => ({
          ...s,
          price: Number(s.price) || 0,
          oldPrice: s.oldPrice ? Number(s.oldPrice) || null : null,
          stock: Number(s.stock) || 0,
        }))
        .filter((s) => s.price > 0),
    });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHead}>
          <h2>{T("تعديل المنتج", "Edit product")}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className={styles.drawerBody}>
          {/* Images */}
          <section className={styles.editSection}>
            <h3>{T("الصور", "Images")}</h3>
            <p className={styles.hint}>
              {T("الصق رابط صورة من Google Drive (شارك الملف كـ«أي شخص لديه الرابط»).",
                 "Paste a Google Drive image link (share the file as “Anyone with the link”).")}
            </p>
            <div className={styles.imageRows}>
              {form.images.map((img, i) => {
                const isUrl = isPhoto(img);
                return (
                  <div key={i} className={styles.imageRow}>
                    <div className={styles.imagePreview} style={{ background: isUrl ? "#eceae4" : img }}>
                      {isUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={normalizeImageUrl(img)} alt="" onError={(e) => { e.target.style.opacity = 0.2; }} />
                      ) : (
                        <span>{i + 1}</span>
                      )}
                    </div>
                    <input
                      className={styles.input}
                      dir="ltr"
                      placeholder={T("رابط Drive أو لون مثل #1a1a1a", "Drive link or color like #1a1a1a")}
                      value={img}
                      onChange={(e) => setImage(i, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Basic info */}
          <section className={styles.editSection}>
            <h3>{T("المعلومات", "Details")}</h3>
            <div className={styles.field}>
              <label>{T("الاسم (إنجليزي)", "Name (English)")}</label>
              <input className={styles.input} dir="ltr" value={form.name} onChange={(e) => set({ name: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label>{T("مستوحى من", "Inspired by")}</label>
              <input className={styles.input} dir="ltr" value={form.inspiredBy} onChange={(e) => set({ inspiredBy: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label>{T("التصنيف", "Category")}</label>
              <select className={styles.input} value={form.gender} onChange={(e) => set({ gender: e.target.value })}>
                <option value="Men">{T("رجالي", "Men")}</option>
                <option value="Women">{T("حريمي", "Women")}</option>
                <option value="Unisex">{T("للجنسين", "Unisex")}</option>
              </select>
            </div>
            <p className={styles.noteInline}>
              {T("لتعديل اسم ووصف المنتج بالعربي، استخدم صفحة «المحتوى».",
                 "To edit the Arabic name & description, use the “Content” page.")}
            </p>
          </section>

          {/* Sizes / prices / stock */}
          <section className={styles.editSection}>
            <h3>{T("المقاسات والأسعار", "Sizes & Prices")}</h3>
            <div className={styles.sizeTable}>
              <div className={styles.sizeHeadRow}>
                <span>{T("المقاس", "Size")}</span>
                <span>{T("السعر", "Price")}</span>
                <span>{T("قبل الخصم", "Old price")}</span>
                <span>{T("المخزون", "Stock")}</span>
              </div>
              {form.sizes.map((s, i) => (
                <div key={i} className={styles.sizeRow}>
                  <input className={styles.sizeInput} dir="ltr" value={s.size} onChange={(e) => setSize(i, "size", e.target.value)} />
                  <input className={styles.sizeInput} dir="ltr" type="number" value={s.price} onChange={(e) => setSize(i, "price", e.target.value)} />
                  <input className={styles.sizeInput} dir="ltr" type="number" value={s.oldPrice || ""} placeholder="—" onChange={(e) => setSize(i, "oldPrice", e.target.value)} />
                  <input className={styles.sizeInput} dir="ltr" type="number" value={s.stock} onChange={(e) => setSize(i, "stock", e.target.value)} />
                </div>
              ))}
            </div>
          </section>

          {/* Toggles */}
          <section className={styles.editSection}>
            <div className={styles.toggleRow}>
              <span>{T("الأكثر مبيعًا", "Best seller")}</span>
              <button
                className={`${styles.switch} ${form.bestSeller ? styles.switchOn : ""}`}
                onClick={() => set({ bestSeller: !form.bestSeller })}
                role="switch" aria-checked={form.bestSeller}
              ><span className={styles.knob} /></button>
            </div>
            <div className={styles.toggleRow}>
              <span>{T("إخفاء من المتجر", "Hide from store")}</span>
              <button
                className={`${styles.switch} ${form.hidden ? styles.switchOn : ""}`}
                onClick={() => set({ hidden: !form.hidden })}
                role="switch" aria-checked={form.hidden}
              ><span className={styles.knob} /></button>
            </div>
          </section>
        </div>

        <div className={styles.drawerFoot}>
          {onDelete && (
            <button className={styles.deleteLink} onClick={() => { if (confirm(T("متأكد من حذف المنتج؟", "Delete this product?"))) onDelete(); }}>
              {T("🗑 حذف المنتج", "🗑 Delete product")}
            </button>
          )}
          {isEdited && !onDelete && (
            <button className={styles.resetLink} onClick={onReset}>
              {T("استرجاع الأصل", "Reset to default")}
            </button>
          )}
          <div className={styles.footRight}>
            {savedFlash && <span className={styles.savedFlash}>{T("تم الحفظ ✓", "Saved ✓")}</span>}
            <button className={styles.saveBtn} onClick={save}>{T("حفظ", "Save")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
