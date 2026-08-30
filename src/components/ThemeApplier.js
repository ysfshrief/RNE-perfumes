"use client";

import { useEffect } from "react";
import { useConfig } from "@/context/ConfigContext";

// Applies admin-configured colors as CSS custom properties on <html>,
// and adds/removes a `no-effects` class to toggle animations.
export default function ThemeApplier() {
  const { config } = useConfig();
  const colors = config.colors;
  const effects = config.effects;

  useEffect(() => {
    const root = document.documentElement;
    if (!colors) return;

    // Values saved before the dark redesign. If a stored config still carries
    // them, ignore that key and fall back to the stylesheet token rather than
    // painting dark text on dark surfaces.
    // Palettes from previous design iterations. A stored config carrying any
    // of these would repaint the current system with stale colours, so the key
    // is ignored and the stylesheet token wins.
    const LEGACY = {
      ink: ["#0a0a0a", "#f4f2ef"],
      paper: ["#fafaf8", "#f7f5f1", "#080809"],
      olive: ["#8a8880", "#a8a5a0"],
      line: ["#e0ddd6", "rgba(255,255,255,0.10)"],
      success: ["#4b6f4a", "#6a9268"],
      danger: ["#a23b2d", "#c4533f"],
    };
    const usable = (key, val) =>
      val && !(LEGACY[key] || []).some((v) => v.toLowerCase() === String(val).toLowerCase());

    // Apply each color as a CSS variable override
    const map = {
      "--ink": usable("ink", colors.ink) ? colors.ink : null,
      "--amber": colors.accent,
      "--amber-deep": colors.accentDeep,
      "--burgundy": colors.accent,
      "--olive": usable("olive", colors.olive) ? colors.olive : null,
      "--line": usable("line", colors.line) ? colors.line : null,
      "--bg": usable("paper", colors.paper) ? colors.paper : null,
      "--success": usable("success", colors.success) ? colors.success : null,
      "--danger": usable("danger", colors.danger) ? colors.danger : null,
    };

    Object.entries(map).forEach(([prop, val]) => {
      if (val) root.style.setProperty(prop, val);
      else root.style.removeProperty(prop);
    });

    // Effects toggle
    if (!effects?.enabled) {
      root.classList.add("no-effects");
    } else {
      root.classList.remove("no-effects");
      root.classList.toggle("no-fade", !effects.fadeOnScroll);
      root.classList.toggle("no-hover-lift", !effects.hoverLift);
      root.classList.toggle("no-image-zoom", !effects.imageZoom);
      root.classList.toggle("no-transitions", !effects.smoothTransitions);
      root.classList.toggle("no-parallax", !effects.parallax);
    }
  }, [colors, effects]);

  return null; // no UI — just side effects
}
