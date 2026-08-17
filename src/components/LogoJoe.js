// JOE INDUSTRIES logo — official brand image (background removed), in /public.

const RATIO = 732 / 164;

export default function LogoJoe({ height = 26 }) {
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
