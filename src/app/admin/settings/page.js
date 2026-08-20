"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { useConfig, defaultConfig } from "@/context/ConfigContext";
import adminStyles from "../admin.module.css";
import s from "./settings.module.css";

export default function AdminSettings() {
  const { lang } = useLang();
  const { config, save, reset } = useConfig();
  const [saved, setSaved] = useState(false);
  const ar = lang === "ar";
  const T = (a, e) => (ar ? a : e);

  const colors = config.colors || defaultConfig.colors;
  const effects = config.effects || defaultConfig.effects;

  const setColor = (key, val) => {
    save({ ...config, colors: { ...colors, [key]: val } });
    flash();
  };
  const setEffect = (key, val) => {
    save({ ...config, effects: { ...effects, [key]: val } });
    flash();
  };
  const flash = () => { setSaved(true); clearTimeout(window.__st); window.__st = setTimeout(() => setSaved(false), 1200); };

  const COLOR_FIELDS = [
    { key: "accent", label: T("اللون الأساسي (البيرجاندي)", "Primary accent (burgundy)") },
    { key: "accentDeep", label: T("اللون الأساسي الغامق", "Deep accent") },
    { key: "ink", label: T("لون النصوص / الخلفية الداكنة", "Text / dark background") },
    { key: "paper", label: T("لون الخلفية الفاتحة", "Light background") },
    { key: "olive", label: T("لون النصوص الثانوية", "Secondary text") },
    { key: "line", label: T("لون الخطوط والحدود", "Borders & lines") },
    { key: "success", label: T("لون النجاح", "Success color") },
    { key: "danger", label: T("لون الخطأ", "Error color") },
  ];

  const EFFECT_FIELDS = [
    { key: "enabled", label: T("تفعيل كل التأثيرات", "Enable all effects"), desc: T("إيقافها يزيل كل الحركات والتأثيرات", "Disabling removes ALL animations") },
    { key: "fadeOnScroll", label: T("ظهور تدريجي للأقسام", "Fade-in on scroll") },
    { key: "hoverLift", label: T("رفع البطاقات عند المرور", "Card hover lift") },
    { key: "imageZoom", label: T("تكبير الصور عند المرور", "Image hover zoom") },
    { key: "smoothTransitions", label: T("انتقالات ناعمة", "Smooth transitions") },
    { key: "parallax", label: T("تأثير Parallax", "Parallax effect") },
  ];

  // Ad slides editor
  const slides = config.adSlides || [];
  const setSlide = (i, patch) => {
    const next = slides.map((sl, idx) => (idx === i ? { ...sl, ...patch } : sl));
    save({ ...config, adSlides: next });
    flash();
  };

  return (
    <>
      <div className={adminStyles.pageHead}>
        <h1 className={adminStyles.pageTitle}>{T("الإعدادات", "Settings")}</h1>
        <p className={adminStyles.pageSub}>
          {T("ألوان الموقع، التأثيرات البصرية، والبانر المتحرك.", "Site colors, visual effects, and the ad banner.")}
        </p>
        {saved && <span className={s.savedFlash}>✓ {T("تم الحفظ", "Saved")}</span>}
      </div>

      <div className={s.grid}>
        {/* ─── Colors ─── */}
        <div className={adminStyles.card}>
          <h3 className={s.secTitle}>{T("🎨 ألوان الموقع", "🎨 Site Colors")}</h3>
          <p className={s.secNote}>{T("غيّر أي لون وشوف التغيير مباشرة.", "Change any color and see it live.")}</p>
          <div className={s.colorGrid}>
            {COLOR_FIELDS.map((cf) => (
              <label key={cf.key} className={s.colorField}>
                <span className={s.colorLabel}>{cf.label}</span>
                <div className={s.colorInputWrap}>
                  <input
                    type="color"
                    className={s.colorPicker}
                    value={colors[cf.key] || "#000000"}
                    onChange={(e) => setColor(cf.key, e.target.value)}
                  />
                  <input
                    type="text"
                    className={s.colorHex}
                    dir="ltr"
                    value={colors[cf.key] || ""}
                    onChange={(e) => setColor(cf.key, e.target.value)}
                    placeholder="#8B1A2B"
                  />
                </div>
              </label>
            ))}
          </div>
          <button className={s.resetColors} onClick={() => { save({ ...config, colors: defaultConfig.colors }); flash(); }}>
            {T("↺ استرجاع الألوان الأصلية", "↺ Reset to default colors")}
          </button>
        </div>

        {/* ─── Effects ─── */}
        <div className={adminStyles.card}>
          <h3 className={s.secTitle}>{T("✨ التأثيرات البصرية", "✨ Visual Effects")}</h3>
          <p className={s.secNote}>{T("فعّل أو أوقف التأثيرات حسب رغبتك.", "Toggle effects on or off.")}</p>
          <div className={s.effectsList}>
            {EFFECT_FIELDS.map((ef) => (
              <div key={ef.key} className={s.effectRow}>
                <div>
                  <span className={s.effectLabel}>{ef.label}</span>
                  {ef.desc && <span className={s.effectDesc}>{ef.desc}</span>}
                </div>
                <button
                  className={`${s.switch} ${effects[ef.key] ? s.switchOn : ""}`}
                  onClick={() => setEffect(ef.key, !effects[ef.key])}
                  role="switch" aria-checked={effects[ef.key]}
                  disabled={ef.key !== "enabled" && !effects.enabled}
                >
                  <span className={s.knob} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Payment Methods ─── */}
        <div className={adminStyles.card}>
          <h3 className={s.secTitle}>{T("💳 طرق الدفع", "💳 Payment Methods")}</h3>
          <p className={s.secNote}>{T("فعّل أو أوقف طرق الدفع اللي تظهر للعميل.", "Enable or disable the payment methods shown at checkout.")}</p>
          <div className={s.effectsList}>
            {[
              { key: "cod", label: T("الدفع عند الاستلام", "Cash on Delivery") },
              { key: "card", label: T("فيزا / ماستركارد", "Visa / Mastercard") },
              { key: "instapay", label: "InstaPay" },
              { key: "vodafone", label: T("فودافون كاش", "Vodafone Cash") },
              { key: "orange", label: T("أورنج كاش", "Orange Cash") },
              { key: "etisalat", label: T("اتصالات كاش", "Etisalat Cash") },
            ].map((pm) => {
              const on = (config.payments || {})[pm.key] !== false;
              return (
                <div key={pm.key} className={s.effectRow}>
                  <span className={s.effectLabel}>{pm.label}</span>
                  <button
                    className={`${s.switch} ${on ? s.switchOn : ""}`}
                    onClick={() => { save({ ...config, payments: { ...(config.payments || {}), [pm.key]: !on } }); flash(); }}
                    role="switch" aria-checked={on}
                  ><span className={s.knob} /></button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Category Cards ─── */}
        <div className={`${adminStyles.card} ${s.fullWidth}`}>
          <h3 className={s.secTitle}>{T("🗂️ خانات الصفحة الرئيسية", "🗂️ Homepage Category Cards")}</h3>
          <p className={s.secNote}>{T("عدّل اسم وصورة كل خانة. الصق رابط صورة من Google Drive.", "Edit each card's name and image. Paste a Google Drive image link.")}</p>
          <div className={s.slidesList}>
            {(config.categories || []).map((cat, i) => (
              <div key={cat.id} className={s.slideCard} style={{ borderInlineStart: `4px solid ${cat.color}` }}>
                <div className={s.slideFields}>
                  <div className={s.sfRow}>
                    <label>{T("الاسم (ع)", "Label (AR)")}</label>
                    <input dir="rtl" value={cat.label} onChange={(e) => {
                      const cats = [...config.categories]; cats[i] = { ...cat, label: e.target.value };
                      save({ ...config, categories: cats });
                    }} />
                  </div>
                  <div className={s.sfRow}>
                    <label>{T("الاسم (EN)", "Label (EN)")}</label>
                    <input dir="ltr" value={cat.labelEn} onChange={(e) => {
                      const cats = [...config.categories]; cats[i] = { ...cat, labelEn: e.target.value };
                      save({ ...config, categories: cats });
                    }} />
                  </div>
                  <div className={s.sfRow} style={{ gridColumn: "1 / -1" }}>
                    <label>{T("رابط الصورة (Drive)", "Image link (Drive)")}</label>
                    <input dir="ltr" value={cat.image} placeholder="https://drive.google.com/file/d/..." onChange={(e) => {
                      const cats = [...config.categories]; cats[i] = { ...cat, image: e.target.value };
                      save({ ...config, categories: cats });
                    }} />
                  </div>
                  <div className={s.sfRow}>
                    <label>{T("لون الخلفية", "Overlay color")}</label>
                    <div className={s.colorInputWrap}>
                      <input type="color" className={s.colorPicker} value={cat.color} onChange={(e) => {
                        const cats = [...config.categories]; cats[i] = { ...cat, color: e.target.value };
                        save({ ...config, categories: cats });
                      }} />
                      <input type="text" dir="ltr" className={s.colorHex} value={cat.color} onChange={(e) => {
                        const cats = [...config.categories]; cats[i] = { ...cat, color: e.target.value };
                        save({ ...config, categories: cats });
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Spin Wheel ─── */}
        <div className={`${adminStyles.card} ${s.fullWidth}`}>
          <h3 className={s.secTitle}>{T("🎡 عجلة الحظ", "🎡 Spin Wheel")}</h3>
          <p className={s.secNote}>{T("العجلة بتتلعب مرة واحدة لكل زائر. عدّل الجوائز والاحتمالات (الوزن الأكبر = فرصة أكبر).", "The wheel is played once per visitor. Edit prizes and weights (higher weight = higher chance).")}</p>

          <div className={s.effectRow}>
            <span className={s.effectLabel}>{T("تفعيل العجلة", "Enable wheel")}</span>
            <button
              className={`${s.switch} ${(config.wheel?.enabled !== false) ? s.switchOn : ""}`}
              onClick={() => save({ ...config, wheel: { ...config.wheel, enabled: !(config.wheel?.enabled !== false) } })}
              role="switch"
            ><span className={s.knob} /></button>
          </div>

          <div className={s.sfRow} style={{ marginTop: "1rem" }}>
            <label>{T("عنوان العجلة (ع)", "Wheel title (AR)")}</label>
            <input dir="rtl" value={config.wheel?.title || ""} onChange={(e) => save({ ...config, wheel: { ...config.wheel, title: e.target.value } })} />
          </div>
          <div className={s.sfRow}>
            <label>{T("عنوان العجلة (EN)", "Wheel title (EN)")}</label>
            <input dir="ltr" value={config.wheel?.titleEn || ""} onChange={(e) => save({ ...config, wheel: { ...config.wheel, titleEn: e.target.value } })} />
          </div>

          <h4 style={{ margin: "1.2rem 0 0.6rem", fontSize: "0.85rem" }}>{T("الجوائز", "Prizes")}</h4>
          <div className={s.slidesList}>
            {(config.wheel?.segments || []).map((seg, i) => (
              <div key={seg.id || i} className={s.slideCard} style={{ borderInlineStart: `4px solid ${seg.color || "#8B1A2B"}` }}>
                <div className={s.slideFields}>
                  <div className={s.sfRow}>
                    <label>{T("الجائزة (ع)", "Prize (AR)")}</label>
                    <input dir="rtl" value={seg.label || ""} onChange={(e) => {
                      const segs = [...config.wheel.segments]; segs[i] = { ...seg, label: e.target.value };
                      save({ ...config, wheel: { ...config.wheel, segments: segs } });
                    }} />
                  </div>
                  <div className={s.sfRow}>
                    <label>{T("الجائزة (EN)", "Prize (EN)")}</label>
                    <input dir="ltr" value={seg.labelEn || ""} onChange={(e) => {
                      const segs = [...config.wheel.segments]; segs[i] = { ...seg, labelEn: e.target.value };
                      save({ ...config, wheel: { ...config.wheel, segments: segs } });
                    }} />
                  </div>
                  <div className={s.sfRow}>
                    <label>{T("كود الخصم", "Coupon code")}</label>
                    <input dir="ltr" value={seg.code || ""} placeholder={T("سيبه فاضي لو مفيش جائزة", "empty = no prize")} onChange={(e) => {
                      const segs = [...config.wheel.segments]; segs[i] = { ...seg, code: e.target.value };
                      save({ ...config, wheel: { ...config.wheel, segments: segs } });
                    }} />
                  </div>
                  <div className={s.sfRow}>
                    <label>{T("الوزن (الاحتمال)", "Weight (chance)")}</label>
                    <input dir="ltr" type="number" value={seg.weight || 1} onChange={(e) => {
                      const segs = [...config.wheel.segments]; segs[i] = { ...seg, weight: Number(e.target.value) || 1 };
                      save({ ...config, wheel: { ...config.wheel, segments: segs } });
                    }} />
                  </div>
                  <div className={s.sfRow}>
                    <label>{T("لون القطاع", "Segment color")}</label>
                    <div className={s.colorInputWrap}>
                      <input type="color" className={s.colorPicker} value={seg.color || "#8B1A2B"} onChange={(e) => {
                        const segs = [...config.wheel.segments]; segs[i] = { ...seg, color: e.target.value };
                        save({ ...config, wheel: { ...config.wheel, segments: segs } });
                      }} />
                      <input type="text" dir="ltr" className={s.colorHex} value={seg.color || "#8B1A2B"} onChange={(e) => {
                        const segs = [...config.wheel.segments]; segs[i] = { ...seg, color: e.target.value };
                        save({ ...config, wheel: { ...config.wheel, segments: segs } });
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Ad Slides ─── */}
        <div className={`${adminStyles.card} ${s.fullWidth}`}>
          <h3 className={s.secTitle}>{T("🖼️ البانر المتحرك", "🖼️ Ad Banner Slides")}</h3>
          <p className={s.secNote}>{T("عدّل محتوى كل شريحة في السلايدر.", "Edit the content of each banner slide.")}</p>
          <div className={s.slidesList}>
            {slides.map((sl, i) => (
              <div key={sl.id} className={s.slideCard} style={{ borderInlineStart: `4px solid ${sl.bg}` }}>
                <strong className={s.slideNum}>{T("شريحة", "Slide")} {i + 1}</strong>
                <div className={s.slideFields}>
                  <div className={s.sfRow}>
                    <label>{T("العنوان (ع)", "Title (AR)")}</label>
                    <input dir="rtl" value={sl.title} onChange={(e) => setSlide(i, { title: e.target.value })} />
                  </div>
                  <div className={s.sfRow}>
                    <label>{T("العنوان (EN)", "Title (EN)")}</label>
                    <input dir="ltr" value={sl.titleEn} onChange={(e) => setSlide(i, { titleEn: e.target.value })} />
                  </div>
                  <div className={s.sfRow}>
                    <label>{T("الوصف (ع)", "Subtitle (AR)")}</label>
                    <input dir="rtl" value={sl.subtitle} onChange={(e) => setSlide(i, { subtitle: e.target.value })} />
                  </div>
                  <div className={s.sfRow}>
                    <label>{T("الوصف (EN)", "Subtitle (EN)")}</label>
                    <input dir="ltr" value={sl.subtitleEn} onChange={(e) => setSlide(i, { subtitleEn: e.target.value })} />
                  </div>
                  <div className={s.sfRow}>
                    <label>{T("نص الزر (ع)", "Button (AR)")}</label>
                    <input dir="rtl" value={sl.cta} onChange={(e) => setSlide(i, { cta: e.target.value })} />
                  </div>
                  <div className={s.sfRow}>
                    <label>{T("الرابط", "Link")}</label>
                    <input dir="ltr" value={sl.href} onChange={(e) => setSlide(i, { href: e.target.value })} />
                  </div>
                  <div className={s.sfRow}>
                    <label>{T("لون الخلفية", "Background")}</label>
                    <div className={s.colorInputWrap}>
                      <input type="color" className={s.colorPicker} value={sl.bg} onChange={(e) => setSlide(i, { bg: e.target.value })} />
                      <input type="text" dir="ltr" className={s.colorHex} value={sl.bg} onChange={(e) => setSlide(i, { bg: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
