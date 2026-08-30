"use client";

import { isPhoto } from "@/data/products";
import { normalizeImageUrl } from "@/context/ProductContext";

// Renders a real product photo when `image` is a URL,
// otherwise an elegant placeholder "bottle" using the color.
export default function ProductImage({ product, index = 0, className = "", showLabel = true, fit }) {
  const raw = product.images?.[index] ?? product.image;
  const val = isPhoto(raw) ? normalizeImageUrl(raw) : raw;
  // Isolated bottle renders should never be cropped; campaign/scene imagery may
  // fill the frame. Products can opt in via `imageFit: "cover"`.
  const resolvedFit = fit || product.imageFit || "contain";
  const alt = product.inspiredBy
    ? `${product.name} — inspired by ${product.inspiredBy}`
    : product.name;

  if (isPhoto(val)) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={val}
        alt={alt}
        className={className}
        data-fit={resolvedFit}
        loading="lazy"
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: resolvedFit, display: "block" }}
        draggable={false}
      />
    );
  }

  // Placeholder bottle
  return (
    <div className={className} style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "linear-gradient(160deg, #1a1a1e 0%, #0c0c0e 100%)" }}>
      <div style={{ position: "relative", width: "40%", aspectRatio: "0.62 / 1", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* cap */}
        <div style={{ width: "34%", height: "16%", background: "#15130f", borderRadius: "2px 2px 0 0" }} />
        {/* neck */}
        <div style={{ width: "20%", height: "5%", background: "#2a251c" }} />
        {/* body */}
        <div style={{ flex: 1, width: "100%", background: val, borderRadius: "5px", boxShadow: "inset 0 -24px 40px -18px rgba(0,0,0,0.5), inset 0 12px 20px -12px rgba(255,255,255,0.35), 0 14px 26px -14px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          {/* label */}
          {showLabel && (
            <div style={{ background: "rgba(247,245,241,0.92)", width: "62%", padding: "10% 0", borderRadius: 2, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}>
              <span className="keep-latin" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(0.6rem, 2.2vw, 1rem)", letterSpacing: "0.04em", color: "#15130f", display: "block", lineHeight: 1 }}>{product.name}</span>
              <span className="keep-latin" style={{ fontFamily: "var(--font-display)", fontSize: "0.42rem", letterSpacing: "0.16em", color: "#6b6a5e", display: "block", marginTop: 3 }}>EAU DE PARFUM</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
