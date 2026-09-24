import { handle, json, body } from "@/lib/server/http";
import { getDb } from "@/lib/server/db";
import { verifyPassword, setUserSession } from "@/lib/server/session";

export const dynamic = "force-dynamic";

export const POST = handle(async (req) => {
  const { email, password } = await body(req, 5_000);
  const e = String(email || "").trim().toLowerCase();
  const db = await getDb();
  const [row] = await db.query("SELECT id, email, name, password_hash FROM rne_users WHERE email = $1", [e]);
  if (!row || !verifyPassword(password, row.password_hash)) {
    await new Promise((r) => setTimeout(r, 400));
    return json({ error: "auth/invalid-credential" }, 401);
  }
  const res = json({ user: { uid: row.id, email: row.email, name: row.name } });
  setUserSession(res, row);
  return res;
});
