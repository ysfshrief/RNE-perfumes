// Small helpers for API route handlers.
import { NextResponse } from "next/server";

export const json = (data, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });

/** Wrap a handler: consistent JSON errors, never leak stack traces. */
export function handle(fn) {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      const status = e.status || 500;
      if (status >= 500) console.error("[api]", e);
      return json({ error: e.code || e.message || "error", detail: e.detail }, status);
    }
  };
}

export async function body(req, maxBytes = 1_000_000) {
  const text = await req.text();
  if (text.length > maxBytes) throw Object.assign(new Error("payloadTooLarge"), { status: 413 });
  try { return text ? JSON.parse(text) : {}; } catch (e) { throw Object.assign(new Error("invalidJson"), { status: 400 }); }
}

export const forbidden = () => json({ error: "forbidden" }, 403);
