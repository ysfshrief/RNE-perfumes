import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { LangProvider } from "@/context/LangContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "RNE — Eau de Parfum",
  description:
    "RNE Perfumes — premium fragrances and bespoke compositions. Discover signature scents for every season. عطور فاخرة من RNE.",
  keywords: ["perfume", "fragrance", "RNE", "eau de parfum", "عطور", "عطر"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&family=Tajawal:wght@400;500;700;800&family=Almarai:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LangProvider>
          <ShopProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </ShopProvider>
        </LangProvider>
      </body>
    </html>
  );
}
