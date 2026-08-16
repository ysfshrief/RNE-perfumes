import PageShell from "@/components/PageShell";

export const metadata = { title: "Return & Refund Policy — RNE Perfumes" };

export default function ReturnPolicyPage() {
  return (
    <PageShell eyebrow="Policies" title="Return & refund policy">
      <h2>Eligibility</h2>
      <p>
        If something isn&apos;t right with your order, contact us as soon as
        possible. Products should be unused and in their original packaging to be
        eligible for a return.
      </p>
      <h2>How to start a return</h2>
      <ul>
        <li>Reach out via our contact page or WhatsApp with your order number.</li>
        <li>Let us know the reason for the return.</li>
        <li>We&apos;ll guide you through the next steps.</li>
      </ul>
      <h2>Refunds</h2>
      <p>
        Once a return is received and approved, your refund is processed to your
        original payment method. Timing depends on your payment provider.
      </p>
      <p>
        Have a question first? <a href="/contact">Contact us</a> — we&apos;re happy
        to help.
      </p>
    </PageShell>
  );
}
