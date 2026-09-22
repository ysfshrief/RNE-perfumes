"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { useConfig, defaultConfig } from "@/context/ConfigContext";
import { useProducts } from "@/context/ProductContext";
import { pName } from "@/data/productLocale";
import { useToast } from "@/components/admin/Toast";
import {
  Section, Field, TextInput, Toggle, ImageInput, OrderControls, SaveBar, EmptyState,
  moveItem, validUrl, adminUi as u,
} from "@/components/admin/ui";
import adminStyles from "../admin.module.css";

// Hero copy lives in the content (translation) system so it stays editable
// per language everywhere; this page is simply a friendlier editor for it.
const HERO_TEXT_KEYS = [
  { key: "home.heroEyebrow", ar: "السطر الصغير أعلى العنوان", en: "Small line above the title" },
  { key: "home.heroTitle1", ar: "العنوان — السطر الأول", en: "Title — line 1" },
  { key: "home.heroTitleEm", ar: "العنوان — السطر الثاني (فاتح)", en: "Title — line 2 (light)" },
  { key: "home.heroLead", ar: "النص التعريفي", en: "Intro sentence", multiline: true },
  { key: "home.shopCollection", ar: "نص الزر", en: "Button text" },
];

const uid = (p) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export default function AdminHomepage() {
  const { lang, overrides, saveOverrides, getText, getDefaultText } = useLang();
  const { config, save } = useConfig();
  const { allProducts } = useProducts();
  const { toast } = useToast();
  const ar = lang === "ar";
  const T = (a, e) => (ar ? a : e);
  const [tab, setTab] = useState("hero");

  // ── Draft state (nothing is published until "Save changes") ──
  const initialHero = () => {
    const h = { ...defaultConfig.hero, ...(config.hero || {}) };
    // First visit: seed the slideshow list from the legacy single image.
    if (!Array.isArray(h.images) || h.images.length === 0) {
      h.images = h.image ? [{ id: "h-legacy", url: h.image, alt: "", enabled: true }] : [];
    }
    return h;
  };
  const initialTexts = () => {
    const out = {};
    HERO_TEXT_KEYS.forEach(({ key }) => { out[key] = { ar: getText(key, "ar"), en: getText(key, "en") }; });
    return out;
  };
  const buildDrafts = () => ({
    hero: initialHero(),
    texts: initialTexts(),
    slides: (config.adSlides || []).map((x) => ({ enabled: true, ...x })),
    cats: (config.categories || []).map((c) => ({ ...c })),
  });
  const [draft, setDraft] = useState(null);
  const [clean, setClean] = useState("");
  const [saving, setSaving] = useState(false);
  const dirty = !!draft && JSON.stringify(draft) !== clean;

  const reset = () => {
    const d = buildDrafts();
    setDraft(d);
    setClean(JSON.stringify(d));
  };

  // Seed on mount, and re-seed when stored data arrives/changes (e.g. the
  // Firestore copy loads after the page) — but never over unsaved edits.
  const snapshot = JSON.stringify({ h: config.hero, s: config.adSlides, c: config.categories, o: overrides });
  useEffect(() => {
    if (!draft || !dirty) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot]);

  const part = (k) => (fn) => setDraft((d) => ({ ...d, [k]: typeof fn === "function" ? fn(d[k]) : fn }));
  const setHero = part("hero");
  const setTexts = part("texts");
  const setSlides = part("slides");
  const setCats = part("cats");
  const hero = draft?.hero || initialHero();
  const texts = draft?.texts || {};
  const slides = draft?.slides || [];
  const cats = draft?.cats || [];

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const h = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  // ── Validation ──
  const errors = useMemo(() => {
    const e = {};
    hero.images.forEach((img, i) => { if (!validUrl(img.url, { allowEmpty: false })) e[`hero.img.${i}`] = T("أدخل رابط صورة صحيح (https://…)", "Enter a valid image link (https://…)"); });
    if (!validUrl(hero.ctaHref, { allowEmpty: false })) e["hero.cta"] = T("الرابط يجب أن يبدأ بـ / أو https://", "Link must start with / or https://");
    if (hero.video && !validUrl(hero.video)) e["hero.video"] = T("رابط فيديو غير صالح", "Invalid video link");
    slides.forEach((sl, i) => {
      if (!validUrl(sl.href, { allowEmpty: false })) e[`slide.href.${i}`] = T("الرابط يجب أن يبدأ بـ / أو https://", "Link must start with / or https://");
      if (sl.image && !validUrl(sl.image)) e[`slide.img.${i}`] = T("رابط صورة غير صالح", "Invalid image link");
      if (!String(sl.subtitle || "").trim() && !String(sl.subtitleEn || "").trim()) e[`slide.head.${i}`] = T("اكتب العنوان الرئيسي بلغة واحدة على الأقل", "Add a heading in at least one language");
    });
    cats.forEach((c, i) => { if (c.image && !validUrl(c.image)) e[`cat.img.${i}`] = T("رابط صورة غير صالح", "Invalid image link"); });
    return e;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hero, slides, cats, lang]);
  const errorCount = Object.keys(errors).length;

  const publish = () => {
    if (errorCount) return;
    setSaving(true);
    const cleanedHero = {
      ...hero,
      images: hero.images.map((i) => ({ ...i, url: i.url.trim() })),
      // Keep the legacy field pointing at the first active image so anything
      // still reading `hero.image` shows the same picture.
      image: (hero.images.find((i) => i.enabled !== false && i.url.trim()) || {}).url || hero.image,
      interval: Math.min(20, Math.max(4, Number(hero.interval) || 7)),
      overlay: Math.min(90, Math.max(20, Number(hero.overlay) || 55)),
    };
    save({ ...config, hero: cleanedHero, adSlides: slides, categories: cats });

    const next = { en: { ...(overrides?.en || {}) }, ar: { ...(overrides?.ar || {}) } };
    Object.entries(texts).forEach(([key, v]) => {
      ["ar", "en"].forEach((L) => {
        const val = v[L] ?? "";
        if (!val.trim() || val === getDefaultText(key, L)) delete next[L][key];
        else next[L][key] = val;
      });
    });
    saveOverrides(next);

    setClean(JSON.stringify(draft));
    setSaving(false);
    toast(T("تم حفظ الصفحة الرئيسية ونشرها", "Homepage saved and published"));
  };

  const setImg = (i, patch) => setHero((h) => ({ ...h, images: h.images.map((x, idx) => (idx === i ? { ...x, ...patch } : x)) }));
  const setSlide = (i, patch) => setSlides((l) => l.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const setCat = (i, patch) => setCats((l) => l.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  const products = allProducts.filter((p) => !p.isDiscoverySet);

  const TABS = [
    { id: "hero", label: T("الهيرو", "Hero") },
    { id: "slides", label: T("البانر المتحرك", "Banner slider") },
    { id: "cats", label: T("خانات التصنيفات", "Category tiles") },
  ];

  return (
    <>
      <div className={adminStyles.pageHead}>
        <h1 className={adminStyles.pageTitle}>{T("الصفحة الرئيسية", "Homepage")}</h1>
        <p className={adminStyles.pageSub}>
          {T("الصور والنصوص والأزرار الظاهرة في الصفحة الرئيسية. التغييرات لا تظهر للعملاء إلا بعد «حفظ التغييرات».",
             "Images, text and buttons on the homepage. Changes go live only after “Save changes”.")}
          {" "}<Link href="/" target="_blank" className={u.help} style={{ textDecoration: "underline" }}>{T("معاينة الموقع ↗", "Preview site ↗")}</Link>
        </p>
      </div>

      <div className={u.tabs} role="tablist">
        {TABS.map((tb) => (
          <button key={tb.id} role="tab" aria-selected={tab === tb.id} className={`${u.tab} ${tab === tb.id ? u.tabOn : ""}`} onClick={() => setTab(tb.id)}>
            {tb.label}
          </button>
        ))}
      </div>

      {tab === "hero" && (
        <>
          <Section
            id="hero-images"
            title={T("صور الهيرو", "Hero images")}
            description={T("تتبدّل الصور تلقائيًا بانتقال سينمائي هادئ. رتّبها بالأسهم، وأوقف أي صورة مؤقتًا بدون حذفها. الروابط المعطّلة يتم تخطيها تلقائيًا.",
                           "Images crossfade automatically. Reorder with the arrows and pause any image without deleting it. Broken links are skipped automatically.")}
            actions={
              <button type="button" className={u.btnSolid} onClick={() => setHero((h) => ({ ...h, images: [...h.images, { id: uid("h"), url: "", alt: "", enabled: true }] }))}>
                + {T("إضافة صورة", "Add image")}
              </button>
            }
          >
            {hero.images.length === 0 ? (
              <EmptyState>{T("لا توجد صور — سيظهر لون خلفية بدلًا منها.", "No images yet — a brand gradient is shown instead.")}</EmptyState>
            ) : (
              hero.images.map((img, i) => (
                <div key={img.id} className={`${u.item} ${img.enabled === false ? u.itemOff : ""}`}>
                  <div className={u.itemHead}>
                    <span className={u.itemTitle}><span className={u.itemIndex}>{i + 1}</span>{T("صورة", "Image")} {i + 1}{img.enabled === false && ` · ${T("متوقفة", "Paused")}`}</span>
                    <OrderControls
                      index={i}
                      total={hero.images.length}
                      T={T}
                      onMove={(idx, d) => setHero((h) => ({ ...h, images: moveItem(h.images, idx, d) }))}
                      onRemove={(idx) => { if (confirm(T("حذف هذه الصورة من الهيرو؟", "Remove this image from the hero?"))) setHero((h) => ({ ...h, images: h.images.filter((_, k) => k !== idx) })); }}
                    />
                  </div>
                  <div className={u.grid}>
                    <Field label={T("رابط الصورة (Drive أو رابط مباشر)", "Image link (Drive or direct URL)")} error={errors[`hero.img.${i}`]} full htmlFor={`himg-${i}`}>
                      <ImageInput id={`himg-${i}`} value={img.url} onChange={(v) => setImg(i, { url: v })} T={T} invalid={!!errors[`hero.img.${i}`]} />
                    </Field>
                    <Field label={T("وصف الصورة (لقارئات الشاشة)", "Alt text (for screen readers)")} help={T("اختياري — مثال: زجاجة خمرة على خشب العود", "Optional — e.g. Khamrah bottle on oud wood")} htmlFor={`halt-${i}`}>
                      <TextInput id={`halt-${i}`} value={img.alt} onChange={(v) => setImg(i, { alt: v })} />
                    </Field>
                  </div>
                  <Toggle label={T("ظاهرة في الموقع", "Shown on site")} checked={img.enabled !== false} onChange={(v) => setImg(i, { enabled: v })} />
                </div>
              ))
            )}

            <div className={u.grid} style={{ marginTop: "1rem" }}>
              <Field label={T("مدة كل صورة (ثانية)", "Seconds per image")} help={T("بين ٤ و٢٠ ثانية", "Between 4 and 20")}>
                <div className={u.rangeRow}>
                  <input type="range" min={4} max={20} step={1} className={u.range} value={hero.interval ?? 7} onChange={(e) => setHero((h) => ({ ...h, interval: Number(e.target.value) }))} aria-label={T("مدة كل صورة", "Seconds per image")} />
                  <span className={u.rangeValue}>{hero.interval ?? 7}s</span>
                </div>
              </Field>
              <Field label={T("تعتيم الصورة خلف النص", "Darkening behind the text")} help={T("زوّده لو النص غير واضح على صورة فاتحة", "Increase if text is hard to read on a light photo")}>
                <div className={u.rangeRow}>
                  <input type="range" min={20} max={90} step={5} className={u.range} value={hero.overlay ?? 55} onChange={(e) => setHero((h) => ({ ...h, overlay: Number(e.target.value) }))} aria-label={T("تعتيم الصورة", "Darkening")} />
                  <span className={u.rangeValue}>{hero.overlay ?? 55}%</span>
                </div>
              </Field>
              <Field label={T("فيديو بدل الصور (اختياري)", "Video instead of images (optional)")} help={T("لو أضفت فيديو، سيظهر بدل الصور المتبدلة.", "If set, the video replaces the slideshow.")} error={errors["hero.video"]}>
                <TextInput dir="ltr" value={hero.video} onChange={(v) => setHero((h) => ({ ...h, video: v }))} placeholder="https://…/clip.mp4" invalid={!!errors["hero.video"]} />
              </Field>
            </div>
          </Section>

          <Section id="hero-text" title={T("نصوص الهيرو والزر", "Hero text & button")} description={T("اكتب النص بالعربي والإنجليزي. لو تركت الحقل فارغًا يرجع للنص الافتراضي.", "Write Arabic and English. An empty field falls back to the default text.")}>
            {HERO_TEXT_KEYS.map((f) => (
              <div key={f.key} className={u.langPair} style={{ marginBottom: "0.9rem" }}>
                <Field label={`${ar ? f.ar : f.en} — عربي`}>
                  <TextInput dir="rtl" multiline={f.multiline} value={texts[f.key]?.ar} onChange={(v) => setTexts((t) => ({ ...t, [f.key]: { ...t[f.key], ar: v } }))} placeholder={getDefaultText(f.key, "ar")} />
                </Field>
                <Field label={`${ar ? f.ar : f.en} — English`}>
                  <TextInput dir="ltr" multiline={f.multiline} value={texts[f.key]?.en} onChange={(v) => setTexts((t) => ({ ...t, [f.key]: { ...t[f.key], en: v } }))} placeholder={getDefaultText(f.key, "en")} />
                </Field>
              </div>
            ))}
            <div className={u.grid}>
              <Field label={T("رابط الزر", "Button link")} help={T("مثال: /shop أو /shop?gender=Men", "e.g. /shop or /shop?gender=Men")} error={errors["hero.cta"]}>
                <TextInput dir="ltr" value={hero.ctaHref} onChange={(v) => setHero((h) => ({ ...h, ctaHref: v }))} invalid={!!errors["hero.cta"]} />
              </Field>
              <Field label={T("العطر المعروض (السعر والنوتات)", "Featured fragrance (price & notes)")} help={T("تلقائي = أول عطر من الأكثر مبيعًا", "Automatic = first best-seller")}>
                <select className={u.input} value={hero.productSlug || ""} onChange={(e) => setHero((h) => ({ ...h, productSlug: e.target.value }))}>
                  <option value="">{T("تلقائي", "Automatic")}</option>
                  {products.map((p) => <option key={p.id} value={p.slug}>{pName(p, lang)}</option>)}
                </select>
              </Field>
            </div>
            <Toggle label={T("إظهار السعر والنوتات في الهيرو", "Show price & notes in the hero")} checked={hero.showProduct !== false} onChange={(v) => setHero((h) => ({ ...h, showProduct: v }))} />
          </Section>
        </>
      )}

      {tab === "slides" && (
        <Section
          id="slides"
          title={T("شرائح البانر المتحرك", "Banner slides")}
          description={T("كل شريحة لها شارة صغيرة، عنوان رئيسي، وصف اختياري، وزر. استخدم صورة أو لون خلفية.", "Each slide has a small badge, a main heading, an optional description and a button. Use an image or a background colour.")}
          actions={
            <button type="button" className={u.btnSolid} onClick={() => setSlides((l) => [...l, { id: uid("s"), enabled: true, title: "", titleEn: "", subtitle: "", subtitleEn: "", desc: "", descEn: "", cta: "تسوّق الآن", ctaEn: "Shop now", href: "/shop", bg: "#2a1e3a", fg: "#f7f5f1", image: "" }])}>
              + {T("إضافة شريحة", "Add slide")}
            </button>
          }
        >
          {slides.length === 0 && <EmptyState>{T("لا توجد شرائح — البانر مخفي من الموقع.", "No slides — the banner is hidden on the site.")}</EmptyState>}
          {slides.map((sl, i) => (
            <div key={sl.id} className={`${u.item} ${sl.enabled === false ? u.itemOff : ""}`} style={{ borderInlineStart: `4px solid ${sl.bg || "#16130F"}` }}>
              <div className={u.itemHead}>
                <span className={u.itemTitle}><span className={u.itemIndex}>{i + 1}</span>{(ar ? sl.subtitle || sl.subtitleEn : sl.subtitleEn || sl.subtitle) || T("شريحة جديدة", "New slide")}</span>
                <OrderControls
                  index={i}
                  total={slides.length}
                  T={T}
                  onMove={(idx, d) => setSlides((l) => moveItem(l, idx, d))}
                  onRemove={(idx) => { if (confirm(T("حذف هذه الشريحة نهائيًا؟", "Delete this slide permanently?"))) setSlides((l) => l.filter((_, k) => k !== idx)); }}
                />
              </div>
              <div className={u.langPair}>
                <Field label={T("الشارة الصغيرة — عربي", "Badge — Arabic")}><TextInput dir="rtl" value={sl.title} onChange={(v) => setSlide(i, { title: v })} /></Field>
                <Field label={T("الشارة الصغيرة — English", "Badge — English")}><TextInput dir="ltr" value={sl.titleEn} onChange={(v) => setSlide(i, { titleEn: v })} /></Field>
                <Field label={T("العنوان الرئيسي — عربي", "Heading — Arabic")} error={errors[`slide.head.${i}`]}><TextInput dir="rtl" value={sl.subtitle} onChange={(v) => setSlide(i, { subtitle: v })} invalid={!!errors[`slide.head.${i}`]} /></Field>
                <Field label={T("العنوان الرئيسي — English", "Heading — English")}><TextInput dir="ltr" value={sl.subtitleEn} onChange={(v) => setSlide(i, { subtitleEn: v })} /></Field>
                <Field label={T("الوصف (اختياري) — عربي", "Description (optional) — Arabic")}><TextInput dir="rtl" multiline rows={2} value={sl.desc} onChange={(v) => setSlide(i, { desc: v })} /></Field>
                <Field label={T("الوصف (اختياري) — English", "Description (optional) — English")}><TextInput dir="ltr" multiline rows={2} value={sl.descEn} onChange={(v) => setSlide(i, { descEn: v })} /></Field>
                <Field label={T("نص الزر — عربي", "Button — Arabic")} help={T("فارغ = بدون زر", "Empty = no button")}><TextInput dir="rtl" value={sl.cta} onChange={(v) => setSlide(i, { cta: v })} /></Field>
                <Field label={T("نص الزر — English", "Button — English")}><TextInput dir="ltr" value={sl.ctaEn} onChange={(v) => setSlide(i, { ctaEn: v })} /></Field>
              </div>
              <div className={u.grid} style={{ marginTop: "0.9rem" }}>
                <Field label={T("رابط الزر", "Button link")} error={errors[`slide.href.${i}`]}><TextInput dir="ltr" value={sl.href} onChange={(v) => setSlide(i, { href: v })} placeholder="/shop?offers=true" invalid={!!errors[`slide.href.${i}`]} /></Field>
                <Field label={T("لون الخلفية", "Background colour")}>
                  <ColorInput value={sl.bg} onChange={(v) => setSlide(i, { bg: v })} />
                </Field>
                <Field label={T("لون النص", "Text colour")}>
                  <ColorInput value={sl.fg} onChange={(v) => setSlide(i, { fg: v })} />
                </Field>
                <Field label={T("صورة خلفية (اختياري)", "Background image (optional)")} error={errors[`slide.img.${i}`]} full>
                  <ImageInput value={sl.image} onChange={(v) => setSlide(i, { image: v })} T={T} invalid={!!errors[`slide.img.${i}`]} />
                </Field>
              </div>
              <Toggle label={T("ظاهرة في الموقع", "Shown on site")} checked={sl.enabled !== false} onChange={(v) => setSlide(i, { enabled: v })} />
            </div>
          ))}
        </Section>
      )}

      {tab === "cats" && (
        <Section id="cats" title={T("خانات التصنيفات الأربعة", "The four category tiles")} description={T("الصورة والاسم لكل خانة (رجالي، حريمي، صيفي، شتوي). الضغط على الخانة يفتح المتجر بالفلتر المناسب.", "Image and label for each tile (Men, Women, Summer, Winter). Tapping a tile opens the shop with that filter.")}>
          {cats.map((c, i) => (
            <div key={c.id} className={u.item} style={{ borderInlineStart: `4px solid ${c.color}` }}>
              <div className={u.itemHead}><span className={u.itemTitle}><span className={u.itemIndex}>{i + 1}</span>{ar ? c.label : c.labelEn}</span></div>
              <div className={u.grid}>
                <Field label={T("الاسم — عربي", "Label — Arabic")}><TextInput dir="rtl" value={c.label} onChange={(v) => setCat(i, { label: v })} /></Field>
                <Field label={T("الاسم — English", "Label — English")}><TextInput dir="ltr" value={c.labelEn} onChange={(v) => setCat(i, { labelEn: v })} /></Field>
                <Field label={T("لون الطبقة فوق الصورة", "Overlay colour")}><ColorInput value={c.color} onChange={(v) => setCat(i, { color: v })} /></Field>
                <Field label={T("الصورة", "Image")} error={errors[`cat.img.${i}`]} full>
                  <ImageInput value={c.image} onChange={(v) => setCat(i, { image: v })} T={T} invalid={!!errors[`cat.img.${i}`]} />
                </Field>
              </div>
            </div>
          ))}
        </Section>
      )}

      <SaveBar dirty={dirty} saving={saving} onSave={publish} onDiscard={reset} T={T} errorCount={errorCount} />
    </>
  );
}

function ColorInput({ value, onChange }) {
  const safe = /^#[0-9a-f]{6}$/i.test(value || "") ? value : "#16130F";
  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <input type="color" value={safe} onChange={(e) => onChange(e.target.value)} style={{ width: 44, height: 42, padding: 2, borderRadius: 10, border: "1px solid var(--line-strong)", background: "var(--bg-2)" }} aria-label="colour" />
      <input className={u.input} dir="ltr" value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
