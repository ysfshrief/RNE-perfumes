import { handle, json } from "@/lib/server/http";
import { getDb, isDbConfigured } from "@/lib/server/db";

export const dynamic = "force-dynamic";

export const GET = handle(async () => {
  if (!isDbConfigured()) return json({ ok: false, db: "missing DATABASE_URL" }, 503);
  const db = await getDb();
  await db.query("SELECT 1");
  return json({ ok: true, db: "connected" });
});
