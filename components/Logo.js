"use client";

import LogoRNE from "./LogoRNE";

// Back-compat wrapper. compact -> smaller size.
export default function Logo({ compact = false, light = false }) {
  return <LogoRNE size={compact ? "sm" : "md"} light={light} />;
}
