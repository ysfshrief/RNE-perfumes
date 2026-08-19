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

    // Apply each color as a CSS variable override
    const map = {
      "--ink": colors.ink,
      "--amber": colors.accent,
      "--amber-deep": colors.accentDeep,
      "--burgundy": colors.accent,
      "--olive": colors.olive,
      "--line": colors.line,
      "--paper": colors.paper,
      "--success": colors.success,
      "--danger": colors.danger,
    };

    Object.entries(map).forEach(([prop, val]) => {
      if (val) root.style.setProperty(prop, val);
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
