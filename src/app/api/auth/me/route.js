import { handle, json } from "@/lib/server/http";
import { currentUser } from "@/lib/server/session";

export const dynamic = "force-dynamic";

export const GET = handle(async () => json({ user: currentUser() }));
