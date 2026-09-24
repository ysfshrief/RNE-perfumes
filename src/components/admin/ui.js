"use client";

import { useState } from "react";
import { normalizeImageUrl, isImageUrl } from "@/lib/media";
import s from "./ui.module.css";

/* Small, consistent building blocks for admin forms. Designed for a
   non-developer: every field has a visible label, optional help text and
   an inline error message. */

export function Section({ title, description, children, actions, id }) {
  return (
    <section className={s.section} id={id} aria-labelledby={id ? `${id}-h` : undefined}>
      <header className={s.sectionHead}>
        <div>
          <h2 id={id ? `${id}-h` : undefined} className={s.sectionTitle}>{title}</h2>
          {description && <p className={s.sectionDesc}>{description}</p>}
        </div>
        {actions && <div className={s.sectionActions}>{actions}</div>}
      </header>
      {children}
    </section>
  );
}

export function Field({ label, help, error, children, full, htmlFor }) {
  return (
    <div className={`${s.field} ${full ? s.full : ""}`}>
      {label && <label className={s.label} htmlFor={htmlFor}>{label}</label>}
      {children}
      {error ? <p className={s.error} role="alert">{error}</p> : help ? <p className={s.help}>{help}</p> : null}
    </div>
  );
}

export function TextInput({ value, onChange, dir, placeholder, type = "text", id, invalid, multiline, rows = 3, ...rest }) {
  const props = {
    id,
    className: `${s.input} ${invalid ? s.inputInvalid : ""}`,
    value: value ?? "",
    dir,
    placeholder,
    "aria-invalid": invalid || undefined,
    onChange: (e) => onChange(e.target.value),
    ...rest,
  };
  return multiline ? <textarea rows={rows} {...props} /> : <input type={type} {...props} />;
}

export function Toggle({ checked, onChange, label, description, disabled }) {
  return (
    <div className={s.toggleRow}>
      <div>
        <span className={s.toggleLabel}>{label}</span>
        {description && <span className={s.toggleDesc}>{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={!!checked}
        aria-label={label}
        disabled={disabled}
        className={`${s.switch} ${checked ? s.switchOn : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span className={s.knob} />
      </button>
    </div>
  );
}

/** Is this something we can save as an image/link value? */
export function validUrl(v, { allowEmpty = true } = {}) {
  const x = String(v || "").trim();
  if (!x) return allowEmpty;
  return /^https?:\/\/\S+$/i.test(x) || x.startsWith("/");
}

/** Image link input with a live preview and a clear broken-link state. */
export function ImageInput({ value, onChange, T, id, invalid, placeholder = "https://drive.google.com/file/d/…" }) {
  const [broken, setBroken] = useState(false);
  const [lastSrc, setLastSrc] = useState("");
  const src = isImageUrl(value) ? normalizeImageUrl(value, 400) : "";
  if (src !== lastSrc) { setLastSrc(src); setBroken(false); }
  return (
    <div className={s.imageInput}>
      <div className={s.preview} aria-hidden="true">
        {src && !broken ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" onError={() => setBroken(true)} />
        ) : (
          <span className={broken ? s.previewBroken : s.previewEmpty}>
            {broken ? T("رابط لا يعمل", "Broken link") : T("لا صورة", "No image")}
          </span>
        )}
      </div>
      <input
        id={id}
        className={`${s.input} ${invalid || broken ? s.inputInvalid : ""}`}
        dir="ltr"
        value={value || ""}
        placeholder={placeholder}
        aria-invalid={invalid || broken || undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/** Up / down / remove controls for ordered lists. */
export function OrderControls({ index, total, onMove, onRemove, T, removeLabel }) {
  return (
    <div className={s.orderControls}>
      <button type="button" className={s.iconBtn} disabled={index === 0} onClick={() => onMove(index, -1)} aria-label={T("تحريك لأعلى", "Move up")}>↑</button>
      <button type="button" className={s.iconBtn} disabled={index === total - 1} onClick={() => onMove(index, 1)} aria-label={T("تحريك لأسفل", "Move down")}>↓</button>
      {onRemove && (
        <button type="button" className={`${s.iconBtn} ${s.iconDanger}`} onClick={() => onRemove(index)} aria-label={removeLabel || T("حذف", "Remove")}>✕</button>
      )}
    </div>
  );
}

export function moveItem(list, index, delta) {
  const next = [...list];
  const to = index + delta;
  if (to < 0 || to >= next.length) return list;
  [next[index], next[to]] = [next[to], next[index]];
  return next;
}

/** Sticky bar shown while a form has unsaved changes. */
export function SaveBar({ dirty, saving, onSave, onDiscard, T, errorCount = 0 }) {
  if (!dirty) return null;
  return (
    <div className={s.saveBar} role="region" aria-label={T("تغييرات غير محفوظة", "Unsaved changes")}>
      <span className={s.saveMsg}>
        {errorCount > 0
          ? T(`صحّح ${errorCount} خطأ قبل الحفظ`, `Fix ${errorCount} error${errorCount > 1 ? "s" : ""} before saving`)
          : T("لديك تغييرات غير محفوظة", "You have unsaved changes")}
      </span>
      <div className={s.saveActions}>
        <button type="button" className={s.btnGhost} onClick={onDiscard} disabled={saving}>{T("تراجع", "Discard")}</button>
        <button type="button" className={s.btnSolid} onClick={onSave} disabled={saving || errorCount > 0}>
          {saving ? T("جارِ الحفظ…", "Saving…") : T("حفظ التغييرات", "Save changes")}
        </button>
      </div>
    </div>
  );
}

export function EmptyState({ children, action }) {
  return (
    <div className={s.empty}>
      <p>{children}</p>
      {action}
    </div>
  );
}

export const adminUi = s;
