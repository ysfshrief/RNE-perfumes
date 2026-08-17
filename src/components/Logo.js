"use client";

import LogoRNE from "./LogoRNE";

// Thin wrapper so existing imports keep working.
export default function Logo({ compact = false, light = false }) {
  return <LogoRNE compact={compact} light={light} />;
}
