import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/data/products";
import ProductClient from "./ProductClient";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = getProductBySlug(params.slug);
  return { title: p ? `${p.name} — RNE Perfumes` : "Product — RNE" };
}

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();
  return <ProductClient product={product} />;
}
