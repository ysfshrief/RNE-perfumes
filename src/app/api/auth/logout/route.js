import { handle, json } from "@/lib/server/http";
import { clearUserSession } from "@/lib/server/session";

export const dynamic = "force-dynamic";

export const POST = handle(async () => {
  const res = json({ ok: true });
  clearUserSession(res);
  return res;
});
