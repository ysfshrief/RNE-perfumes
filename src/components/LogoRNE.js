"use client";

// RNE logo — uses the original brand image (background removed).
// Files live in /public: rne-logo.png (dark) and rne-logo-light.png (light).

const RATIO = 767 / 470; // original artwork aspect ratio

export default function LogoRNE({ compact = false, light = false, onClick, className = "" }) {
  const height = compact ? 40 : 58;
  const width = Math.round(height * RATIO);
  const src = light ? "/rne-logo-light.png" : "/rne-logo.png";

  return (
    <span
      className={className}
      onClick={onClick}
      style={{
        display: "inline-flex",
        lineHeight: 0,
        userSelect: "none",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="RNE Eau de Parfum"
        width={width}
        height={height}
        style={{ width, height, objectFit: "contain", display: "block" }}
        draggable={false}
      />
    </span>
  );
}
