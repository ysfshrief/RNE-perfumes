import { handle, json } from "@/lib/server/http";
import { listRecords } from "@/lib/server/db";
import { currentUser } from "@/lib/server/session";

export const dynamic = "force-dynamic";

// A signed-in customer's own orders.
export const GET = handle(async () => {
  const user = currentUser();
  if (!user) return json({ items: [] });
  return json({ items: await listRecords("orders", { userId: user.uid, limit: 100 }) });
});
