import PageShell from "@/components/PageShell";

export const metadata = { title: "About — RNE Perfumes" };

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="Our Story"
      title="About RNE"
      lead="A fragrance house built on the belief that scent is the most personal thing you wear."
    >
      <p>
        RNE Perfumes creates premium eau de parfum compositions for those who
        treat fragrance as identity. Every scent in our collection is built note
        by note — top, heart, and base — to unfold gracefully through the day.
      </p>
      <h2>What we stand for</h2>
      <p>
        We focus on concentrated formulas, considered ingredients, and honest
        presentation. No inflated claims, no shortcuts — just fragrances we&apos;re
        proud to put our name on.
      </p>
      <h2>Made for every season</h2>
      <p>
        From bright summer citrus to deep winter amber, our range is designed to
        follow you through the year. Whether you prefer something fresh and light
        or warm and enveloping, there&apos;s an RNE scent for the moment.
      </p>
      <p>
        Have a question or want a recommendation? Reach us any time on{" "}
        <a href="/contact">our contact page</a>.
      </p>
    </PageShell>
  );
}
