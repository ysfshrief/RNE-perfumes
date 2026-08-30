/** @type {import('tailwindcss').Config} */
module.exports = {
  // Preflight is Tailwind's global CSS reset. The existing pages are styled
  // with CSS Modules that assume the browser defaults, so enabling it would
  // silently restyle every page that hasn't been migrated yet.
  corePlugins: { preflight: false },
  // Tailwind runs alongside the existing CSS Modules. It only emits classes
  // that are actually used, so adding it does not affect pages that haven't
  // been migrated yet.
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Bound to the same CSS variables the rest of the site already uses,
      // so Tailwind and CSS Modules can never drift into two palettes.
      colors: {
        bg: "var(--bg)",
        surface: "var(--bg-2)",
        recessed: "var(--bg-3)",
        ink: {
          DEFAULT: "var(--ink)",
          dim: "var(--ink-dim)",
          faint: "var(--ink-faint)",
        },
        "on-ink": "var(--on-ink)",
        burgundy: {
          DEFAULT: "var(--burgundy)",
          deep: "var(--amber-deep)",
        },
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        success: "var(--success)",
        danger: "var(--danger)",
        // shadcn-compatible aliases
        primary: {
          DEFAULT: "var(--ink)",
          foreground: "var(--on-ink)",
        },
        "primary-foreground": "var(--on-ink)",
        border: "var(--line)",
        input: "var(--line)",
        ring: "var(--burgundy)",
        background: "var(--bg)",
        foreground: "var(--ink)",
        muted: {
          DEFAULT: "var(--bg-3)",
          foreground: "var(--ink-faint)",
        },
        accent: {
          DEFAULT: "var(--bg-3)",
          foreground: "var(--ink)",
        },
        destructive: {
          DEFAULT: "var(--danger)",
          foreground: "#fff",
        },
        secondary: {
          DEFAULT: "var(--bg-3)",
          foreground: "var(--ink)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        ar: ["var(--font-ar)"],
        "ar-display": ["var(--font-ar-display)"],
      },
      borderRadius: {
        card: "var(--radius-card)",
        pill: "var(--radius-pill)",
      },
      backdropBlur: {
        glass: "var(--glass-blur)",
      },
    },
  },
  plugins: [],
};
