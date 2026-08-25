import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { AuthProvider } from "@/context/AuthContext";
import { LangProvider } from "@/context/LangContext";
import { ConfigProvider } from "@/context/ConfigContext";
import { ProductProvider } from "@/context/ProductContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeApplier from "@/components/ThemeApplier";

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
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Jost:wght@400;500;600&family=Cairo:wght@400;600;700;800&family=Rubik:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LangProvider>
          <ConfigProvider>
            <ProductProvider>
              <AuthProvider>
                <ShopProvider>
                <ThemeApplier />
              <Header />
                <main>{children}</main>
                <Footer />
              </ShopProvider>
              </AuthProvider>
            </ProductProvider>
          </ConfigProvider>
        </LangProvider>
      </body>
    </html>
  );
}
