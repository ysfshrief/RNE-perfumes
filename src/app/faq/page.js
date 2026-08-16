"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import styles from "./faq.module.css";

const FAQS = [
  { q: "How long does delivery take?", a: "Orders are typically delivered within 2–5 days depending on your governorate. You'll be able to track the status of your order from your account." },
  { q: "What payment methods do you accept?", a: "We accept Cash on Delivery, Visa/Mastercard, InstaPay, Vodafone Cash, Orange Cash, and Etisalat Cash. You choose your method at checkout." },
  { q: "Do I need an account to order?", a: "Yes. Creating an account lets you track orders, save addresses, manage your wishlist, and leave reviews on products you've purchased." },
  { q: "Are your fragrances long-lasting?", a: "Our scents are eau de parfum concentration, formulated for depth and longevity. Performance varies by skin type, but most last well through the day." },
  { q: "Can I return a product?", a: "Please see our Return & Refund Policy for full details on eligibility and how to start a return." },
  { q: "How do I leave a review?", a: "Reviews can be submitted from your account for any product you've purchased. Reviews appear on the product page once approved." },
];

export default function FAQPage() {
  const [open, setOpen] = useState(0);
  return (
    <PageShell eyebrow="Help" title="Frequently asked questions">
      <div className={styles.list}>
        {FAQS.map((f, i) => (
          <div key={i} className={`${styles.item} ${open === i ? styles.itemOpen : ""}`}>
            <button className={styles.q} onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              <span>{f.q}</span>
              <span className={styles.icon}>{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <p className={styles.a}>{f.a}</p>}
          </div>
        ))}
      </div>
    </PageShell>
  );
}
