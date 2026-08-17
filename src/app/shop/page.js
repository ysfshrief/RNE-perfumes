import { Suspense } from "react";
import ShopClient from "./ShopClient";

export const metadata = { title: "Shop — RNE Perfumes" };

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container section">…</div>}>
      <ShopClient />
    </Suspense>
  );
}
