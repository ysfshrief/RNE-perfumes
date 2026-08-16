import PageShell from "@/components/PageShell";

export const metadata = { title: "Shipping Policy — RNE Perfumes" };

export default function ShippingPolicyPage() {
  return (
    <PageShell eyebrow="Policies" title="Shipping policy">
      <h2>Delivery times</h2>
      <p>
        Orders are typically delivered within 2–5 days depending on your
        governorate. Delivery timing and coverage are finalized with our shipping
        partner and will be confirmed as your order is processed.
      </p>
      <h2>Order tracking</h2>
      <p>
        Once your order is confirmed, you can follow its status from your account:
        New, Confirmed, Preparing, Out for Delivery, and Delivered.
      </p>
      <h2>Shipping fees</h2>
      <p>
        Shipping fees depend on your location and are shown before you place your
        order. Specific rates by region are being finalized with our courier.
      </p>
      <p>
        For any delivery question, reach us via <a href="/contact">contact</a> or
        WhatsApp.
      </p>
    </PageShell>
  );
}
