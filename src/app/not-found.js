import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "1.2rem",
        padding: "4rem var(--gutter)",
      }}
    >
      <p className="eyebrow">Error 404</p>
      <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}>Page not found</h1>
      <p style={{ color: "var(--olive)", maxWidth: "42ch" }}>
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="btn btn--solid">Back to home</Link>
    </div>
  );
}
