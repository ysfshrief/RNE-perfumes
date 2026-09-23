import { handle, json, body } from "@/lib/server/http";
import { placeOrder } from "@/lib/server/orders";
import { currentUser } from "@/lib/server/session";

export const dynamic = "force-dynamic";

// Anyone can place an order (guest checkout). Prices, stock and discounts
// are computed on the server — see lib/server/orders.js.
export const POST = handle(async (req) => {
  const input = await body(req, 100_000);
  const order = await placeOrder(input, { user: currentUser() });
  return json({ order }, 201);
});
