// JOE INDUSTRIES logo — original brand image (background removed), in /public.

const RATIO = 733 / 249;

export default function LogoJoe({ height = 20 }) {
  const width = Math.round(height * RATIO);
  return (
    <span style={{ display: "inline-flex", lineHeight: 0, direction: "ltr" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/joe-logo.png"
        alt="JOE INDUSTRIES"
        width={width}
        height={height}
        style={{ width, height, objectFit: "contain", display: "block" }}
        draggable={false}
      />
    </span>
  );
}
