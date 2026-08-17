"use client";

// RNE logo — official brand image (background removed), files in /public.
// rne-logo.png (dark, for light backgrounds) · rne-logo-light.png (light, for dark)

const RATIO = 480 / 295; // official artwork aspect ratio (with EAU DE PARFUM rule)

export default function LogoRNE({ size = "md", light = false, onClick, className = "" }) {
  // Heights tuned per placement; width derived from the true aspect ratio.
  const heights = { sm: 30, md: 38, lg: 46 };
  const height = heights[size] || heights.md;
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
