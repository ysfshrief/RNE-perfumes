export default function Logo({ compact = false, light = false }) {
  const color = light ? "var(--paper)" : "var(--ink)";
  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        lineHeight: 1,
        userSelect: "none",
      }}
      aria-label="RNE Eau de Parfum"
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: compact ? "1.5rem" : "1.85rem",
          letterSpacing: "0.02em",
          color,
        }}
      >
        RNE
      </span>
      {!compact && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginTop: "0.25rem",
          }}
        >
          <span style={{ width: 16, height: 1, background: color, opacity: 0.7 }} />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.52rem",
              letterSpacing: "0.32em",
              fontWeight: 600,
              color,
              opacity: 0.85,
            }}
          >
            EAU DE PARFUM
          </span>
          <span style={{ width: 16, height: 1, background: color, opacity: 0.7 }} />
        </span>
      )}
    </span>
  );
}
