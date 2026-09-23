import { handle, json, body } from "@/lib/server/http";
import { checkAdminCode, setAdminSession, clearAdminSession, isAdminRequest } from "@/lib/server/session";

export const dynamic = "force-dynamic";

export const GET = handle(async () => json({ admin: isAdminRequest() }));

// The footer gate (tap the logo 3×, enter the code) — verified here, on the
// server, and turned into an httpOnly cookie the browser can't forge.
export const POST = handle(async (req) => {
  const { code } = await body(req, 1_000);
  if (!checkAdminCode(code)) {
    await new Promise((r) => setTimeout(r, 600));
    return json({ ok: false }, 401);
  }
  const res = json({ ok: true });
  setAdminSession(res);
  return res;
});

export const DELETE = handle(async () => {
  const res = json({ ok: true });
  clearAdminSession(res);
  return res;
});
