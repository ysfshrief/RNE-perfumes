import { randomBytes } from "node:crypto";
import { handle, json, body } from "@/lib/server/http";
import { getDb } from "@/lib/server/db";
import { hashPassword, setUserSession } from "@/lib/server/session";

export const dynamic = "force-dynamic";

export const POST = handle(async (req) => {
  const { email, password, name } = await body(req, 5_000);
  const e = String(email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return json({ error: "auth/invalid-email" }, 400);
  if (String(password || "").length < 6) return json({ error: "auth/weak-password" }, 400);
  const db = await getDb();
  const exists = await db.query("SELECT 1 FROM rne_users WHERE email = $1", [e]);
  if (exists.length) return json({ error: "auth/email-already-in-use" }, 409);
  const user = { id: `u_${Date.now().toString(36)}${randomBytes(4).toString("hex")}`, email: e, name: String(name || "").trim().slice(0, 80) || e.split("@")[0] };
  await db.query("INSERT INTO rne_users (id, email, name, password_hash) VALUES ($1, $2, $3, $4)", [user.id, user.email, user.name, hashPassword(password)]);
  const res = json({ user: { uid: user.id, email: user.email, name: user.name } }, 201);
  setUserSession(res, user);
  return res;
});
