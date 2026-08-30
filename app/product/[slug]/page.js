import { getProductBySlug, products } from "@/data/products";
import ProductClient from "./ProductClient";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = getProductBySlug(params.slug);
  return { title: p ? `${p.name} — RNE Perfumes` : "Product — RNE" };
}

// Note: custom (admin-added) products aren't in the static list, so we pass the
// slug and let the client resolve the product from context (localStorage/Firestore).
export default function ProductPage({ params }) {
  const staticProduct = getProductBySlug(params.slug) || null;
  return <ProductClient product={staticProduct} slug={params.slug} />;
}
