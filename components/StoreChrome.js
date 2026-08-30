"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import { Footer } from "./ui/footer-section";

/**
 * Renders the storefront header/footer everywhere except the admin, which has
 * its own sidebar and topbar — showing both produced two competing menus on
 * mobile and pushed the dashboard down the page.
 */
export default function StoreChrome({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <main>{children}</main>;

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
