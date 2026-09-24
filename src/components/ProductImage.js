"use client";

import { useState } from "react";
import { normalizeImageUrl, isImageUrl, productImages } from "@/lib/media";

/**
 * Product photo with graceful fallbacks.
 *  - URL / local path  → the photo (Drive links normalised)
 *  - colour value      → an elegant placeholder bottle
 *  - broken link       → the same placeholder, never a broken-image icon
 */
export default function ProductImage({
  product,
  index = 0,
  className = "",
  showLabel = true,
  fit,
  width = 1000,
  priority = false,
  alt,
}) {
  const [failed, setFailed] = useState(false);
  const list = productImages(product);
  const raw = list[index] ?? list[0] ?? product.image;
  const src = isImageUrl(raw) ? normalizeImageUrl(raw, width) : null;
  const resolvedFit = fit || product.imageFit || "cover";
  const altText =
    alt ?? (product.inspiredBy ? `${product.name} — inspired by ${product.inspiredBy}` : product.name);

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={altText}
        className={className}
        data-fit={resolvedFit}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        onError={() => setFailed(true)}
        style={{ width: "100%", height: "100%", objectFit: resolvedFit, display: "block" }}
        draggable={false}
      />
    );
  }

  // Colour placeholders keep their colour; failed photos get a neutral tone.
  const colour = !src && typeof raw === "string" && raw.trim().startsWith("#") ? raw : "#3a332c";
  return (
    <div
      className={className}
      role="img"
      aria-label={altText}
      style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "linear-gradient(160deg, #1a1a1e 0%, #0c0c0e 100%)" }}
    >
      <div style={{ position: "relative", width: "40%", aspectRatio: "0.62 / 1", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "34%", height: "16%", background: "#15130f", borderRadius: "2px 2px 0 0" }} />
        <div style={{ width: "20%", height: "5%", background: "#2a251c" }} />
        <div style={{ flex: 1, width: "100%", background: colour, borderRadius: "5px", boxShadow: "inset 0 -24px 40px -18px rgba(0,0,0,0.5), inset 0 12px 20px -12px rgba(255,255,255,0.35), 0 14px 26px -14px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          {showLabel && (
            <div style={{ background: "rgba(247,245,241,0.92)", width: "62%", padding: "10% 0", borderRadius: 2, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}>
              <span className="keep-latin" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(0.6rem, 2.2vw, 1rem)", letterSpacing: "0.04em", color: "#15130f", display: "block", lineHeight: 1 }}>{product.name}</span>
              <span className="keep-latin" style={{ fontFamily: "var(--font-ui)", fontSize: "0.42rem", letterSpacing: "0.16em", color: "#6b6a5e", display: "block", marginTop: 3 }}>EAU DE PARFUM</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
