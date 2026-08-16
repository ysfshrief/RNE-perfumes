import PageShell from "@/components/PageShell";

export const metadata = { title: "Terms & Conditions — RNE Perfumes" };

export default function TermsPage() {
  return (
    <PageShell eyebrow="Legal" title="Terms & conditions">
      <p>
        By using this website and placing an order with RNE Perfumes, you agree to
        the terms below. Please read them carefully.
      </p>
      <h2>Orders</h2>
      <p>
        All orders are subject to acceptance and availability. Prices and product
        details are shown on each product page and may be updated over time.
      </p>
      <h2>Accounts</h2>
      <p>
        You are responsible for keeping your account details secure. An account is
        required to complete a purchase.
      </p>
      <h2>Pricing & payment</h2>
      <p>
        Prices are listed in Egyptian Pounds (EGP). Accepted payment methods are
        shown at checkout. Any promotions or discounts apply as described at the
        time of purchase.
      </p>
      <h2>Content</h2>
      <p>
        All brand content on this site belongs to RNE Perfumes and may not be
        reproduced without permission.
      </p>
    </PageShell>
  );
}
