"use client";

import { useLang } from "@/context/LangContext";
import { useConfig, defaultConfig } from "@/context/ConfigContext";
import adminStyles from "../admin.module.css";
import { useToast } from "@/components/admin/Toast";
import { useState } from "react";
import { Field, TextInput, adminUi as u } from "@/components/admin/ui";
import { contact as defaultContact, socials as defaultSocials, SOCIAL_PLATFORMS } from "@/data/brand";
import s from "./settings.module.css";

export default function AdminSettings() {
  const { lang } = useLang();
  const { config, save, reset } = useConfig();
  const { toast } = useToast();
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
  const flash = () => toast(T("تم الحفظ", "Saved"));

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

  return (
    <>
      <div className={adminStyles.pageHead}>
        <h1 className={adminStyles.pageTitle}>{T("الإعدادات", "Settings")}</h1>
        <p className={adminStyles.pageSub}>
          {T("الألوان، التأثيرات، طرق الدفع، الخصائص، وعجلة الحظ. التغييرات هنا تُحفظ فورًا.", "Colours, effects, payment methods, features and the spin wheel. Changes here save instantly.")}
        </p>
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
          <button className={s.resetColors} onClick={() => { if (confirm(T("استرجاع كل الألوان الأصلية؟", "Reset all colours to default?"))) { save({ ...config, colors: defaultConfig.colors }); flash(); } }}>
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

        {/* ─── Cinematic media (hero + brand story) ─── */}
        <div className={`${adminStyles.card} ${s.fullWidth}`}>
          <h3 className={s.secTitle}>{T("🎬 صور إضافية", "🎬 Other media")}</h3>
          <p className={s.secNote}>
            {T("قصة البراند وخلفية صفحات الدخول. صور الهيرو والبانر والتصنيفات أصبحت في صفحة «الصفحة الرئيسية».",
               "Brand story and sign-in background. Hero, banner and category images now live on the “Homepage” page.")}
          </p>

          <div className={s.slidesList}>
            <div className={s.slideCard} style={{ borderInlineStart: "4px solid var(--olive)" }}>
              <strong className={s.slideNum}>{T("خلفية صفحات الدخول/التسجيل", "Login / Register background")}</strong>
              <div className={s.slideFields}>
                <div className={s.sfRow} style={{ gridColumn: "1 / -1" }}>
                  <label>{T("رابط الصورة (Drive)", "Image link (Drive)")}</label>
                  <input dir="ltr" value={config.authBackground?.image || ""} placeholder="https://drive.google.com/file/d/..."
                    onChange={(e) => { save({ ...config, authBackground: { ...config.authBackground, image: e.target.value } }); flash(); }} />
                </div>
              </div>
            </div>

            <div className={s.slideCard} style={{ borderInlineStart: "4px solid var(--olive)" }}>
              <strong className={s.slideNum}>{T("قصة البراند", "Brand story")}</strong>
              <div className={s.slideFields}>
                <div className={s.sfRow}>
                  <label>{T("الصورة", "Image")}</label>
                  <input dir="ltr" value={config.brandStory?.image || ""} placeholder="https://drive.google.com/file/d/..."
                    onChange={(e) => { save({ ...config, brandStory: { ...config.brandStory, image: e.target.value } }); flash(); }} />
                </div>
                <div className={s.sfRow}>
                  <label>{T("الفيديو (اختياري)", "Video (optional)")}</label>
                  <input dir="ltr" value={config.brandStory?.video || ""} placeholder="https://…/clip.mp4"
                    onChange={(e) => { save({ ...config, brandStory: { ...config.brandStory, video: e.target.value } }); flash(); }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Contact & social ─── */}
        <div className={`${adminStyles.card} ${s.fullWidth}`}>
          <ContactSettings config={config} save={save} T={T} toast={toast} />
        </div>

        {/* ─── Feature flags ─── */}
        <div className={`${adminStyles.card} ${s.fullWidth}`}>
          <h3 className={s.secTitle}>{T("🧩 الخصائص", "🧩 Features")}</h3>
          <p className={s.secNote}>{T("تشغيل أو إيقاف أجزاء كاملة من الموقع بدون حذفها.", "Turn whole parts of the site on or off without deleting them.")}</p>
          <div className={s.effectRow}>
            <div>
              <span className={s.effectLabel}>{T("عجلة الحظ", "Spin wheel")}</span>
              <span className={s.effectDesc}>{T("موقوفة حاليًا. تفعيلها يُظهر زر العجلة في الصفحة الرئيسية بنفس الجوائز المحفوظة بالأسفل.", "Currently paused. Turning it on shows the wheel button on the homepage with the prizes saved below.")}</span>
            </div>
            <button
              className={`${s.switch} ${config.features?.spinWheel ? s.switchOn : ""}`}
              onClick={() => { save({ ...config, features: { ...(config.features || {}), spinWheel: !config.features?.spinWheel } }); flash(); }}
              role="switch" aria-checked={!!config.features?.spinWheel}
              aria-label={T("عجلة الحظ", "Spin wheel")}
            ><span className={s.knob} /></button>
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
              onClick={() => { save({ ...config, wheel: { ...config.wheel, enabled: !(config.wheel?.enabled !== false) } }); flash(); }}
              role="switch" aria-checked={config.wheel?.enabled !== false}
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

      </div>
    </>
  );
}

/** Contact details + social links used by the footer, contact page and WhatsApp buttons. */
function ContactSettings({ config, save, T, toast }) {
  const initial = () => {
    const socials = {};
    SOCIAL_PLATFORMS.forEach((p) => {
      socials[p.id] = config.socials ? config.socials[p.id] || "" : (defaultSocials.find((x) => x.id === p.id)?.url || "");
    });
    return {
      whatsapp: config.contact?.whatsapp || defaultContact.whatsapp,
      email: config.contact?.email || defaultContact.email,
      socials,
    };
  };
  const [form, setForm] = useState(initial);
  const [clean, setClean] = useState(() => JSON.stringify(initial()));
  const dirty = JSON.stringify(form) !== clean;
  const errors = {};
  if (!/^\d{10,15}$/.test(String(form.whatsapp).replace(/\D/g, "")) ) errors.whatsapp = T("رقم دولي بدون + (مثال: 201012345678)", "International number without + (e.g. 201012345678)");
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) errors.email = T("إيميل غير صالح", "Invalid email");
  SOCIAL_PLATFORMS.forEach((p) => { if (form.socials[p.id] && !/^https?:\/\//.test(form.socials[p.id])) errors[p.id] = T("الرابط يبدأ بـ https://", "Link must start with https://"); });
  const onSave = () => {
    if (Object.keys(errors).length) return;
    save({ ...config, contact: { whatsapp: String(form.whatsapp).replace(/\D/g, ""), email: form.email.trim() }, socials: form.socials });
    setClean(JSON.stringify(form));
    toast(T("تم حفظ بيانات التواصل", "Contact details saved"));
  };
  return (
    <>
      <h3 className={s.secTitle}>{T("📞 التواصل والسوشيال ميديا", "📞 Contact & social media")}</h3>
      <p className={s.secNote}>{T("تظهر في الفوتر، صفحة التواصل، وأزرار واتساب. اترك رابط المنصة فارغًا لإخفائها.", "Used in the footer, contact page and WhatsApp buttons. Leave a platform empty to hide it.")}</p>
      <div className={u.grid}>
        <Field label={T("رقم واتساب", "WhatsApp number")} error={errors.whatsapp}>
          <TextInput dir="ltr" value={form.whatsapp} onChange={(v) => setForm((f) => ({ ...f, whatsapp: v }))} invalid={!!errors.whatsapp} />
        </Field>
        <Field label={T("الإيميل", "Email")} error={errors.email}>
          <TextInput dir="ltr" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} invalid={!!errors.email} />
        </Field>
        {SOCIAL_PLATFORMS.map((p) => (
          <Field key={p.id} label={p.label} error={errors[p.id]}>
            <TextInput dir="ltr" value={form.socials[p.id]} placeholder="https://…" onChange={(v) => setForm((f) => ({ ...f, socials: { ...f.socials, [p.id]: v } }))} invalid={!!errors[p.id]} />
          </Field>
        ))}
      </div>
      {dirty && (
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "1rem" }}>
          <button type="button" className={u.btnGhost} onClick={() => setForm(initial())}>{T("تراجع", "Discard")}</button>
          <button type="button" className={u.btnSolid} onClick={onSave} disabled={Object.keys(errors).length > 0}>{T("حفظ", "Save")}</button>
        </div>
      )}
    </>
  );
}
