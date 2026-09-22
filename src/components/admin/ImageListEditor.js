"use client";

import { Field, ImageInput, OrderControls, moveItem, validUrl, adminUi as u } from "./ui";

/**
 * Ordered list of image links. The first image is the main one (cards,
 * cart, sharing); the rest appear in the product gallery.
 */
export default function ImageListEditor({ images, onChange, T, max = 12 }) {
  const list = images.length ? images : [""];
  const set = (i, v) => onChange(list.map((x, idx) => (idx === i ? v : x)));
  return (
    <div>
      {list.map((img, i) => {
        const bad = img && !validUrl(img);
        return (
          <div key={i} className={u.item}>
            <div className={u.itemHead}>
              <span className={u.itemTitle}>
                <span className={u.itemIndex}>{i + 1}</span>
                {i === 0 ? T("الصورة الرئيسية", "Main image") : `${T("صورة", "Image")} ${i + 1}`}
              </span>
              <OrderControls
                index={i}
                total={list.length}
                T={T}
                onMove={(idx, d) => onChange(moveItem(list, idx, d))}
                onRemove={list.length > 1 ? (idx) => { if (!list[idx] || confirm(T("حذف هذه الصورة؟", "Remove this image?"))) onChange(list.filter((_, k) => k !== idx)); } : null}
              />
            </div>
            <Field error={bad ? T("رابط غير صالح — يجب أن يبدأ بـ https:// أو /", "Invalid link — must start with https:// or /") : null}>
              <ImageInput value={img} onChange={(v) => set(i, v)} T={T} invalid={bad} />
            </Field>
          </div>
        );
      })}
      {list.length < max && (
        <button type="button" className={u.btnGhost} onClick={() => onChange([...list, ""])}>
          + {T("إضافة صورة", "Add image")}
        </button>
      )}
    </div>
  );
}

/** Clean an image list for saving: trimmed, no blanks, no duplicates. */
export function cleanImages(list) {
  const seen = new Set();
  return (list || []).map((x) => String(x || "").trim()).filter((x) => x && !seen.has(x) && seen.add(x));
}

export function imagesInvalid(list) {
  return (list || []).some((x) => x && !validUrl(x));
}
