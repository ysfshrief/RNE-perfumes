"use client";

import React from "react";
import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useLang } from "@/context/LangContext";
import { contact, socials } from "@/data/brand";
import LogoRNE from "@/components/LogoRNE";
import LogoJoe from "@/components/LogoJoe";
import FooterAdminTrigger from "@/components/FooterAdminTrigger";

// Brand marks are inline SVGs: lucide dropped third-party brand icons, and
// this keeps the footer on the same icon system as the rest of the site.
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-[18px]" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.5 14.1c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.5-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2.1.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.1.1.3 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.5.1.3.6 1 1.3 1.6.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.7.8c.2.1.4.2.5.3.1.2.1.7-.1 1.3z" />
    </svg>
  ),
};

/**
 * Site footer with staggered scroll-in animation.
 * All content is the store's real data (links, contact, socials) and the
 * mandatory brand elements — copyright wording, the JOE INDUSTRIES lockup and
 * the hidden admin entry point — are preserved exactly.
 */
export function Footer() {
  const { t } = useLang();

  const sections = [
    {
      label: t("footer.navigation"),
      links: [
        { title: t("footer.home"), href: "/" },
        { title: t("footer.allFragrances"), href: "/shop" },
        { title: t("nav.men"), href: "/shop?category=Men" },
        { title: t("nav.women"), href: "/shop?category=Women" },
      ],
    },
    {
      label: t("footer.customerCare"),
      links: [
        { title: t("footer.aboutRne"), href: "/about" },
        { title: t("footer.faq"), href: "/faq" },
        { title: t("footer.shippingPolicy"), href: "/shipping-policy" },
        { title: t("footer.terms"), href: "/terms" },
      ],
    },
    {
      label: t("footer.contact"),
      links: [
        { title: `${t("footer.callWhatsapp")}: +${contact.whatsapp}`, href: `https://wa.me/${contact.whatsapp}`, external: true },
        { title: contact.email, href: `mailto:${contact.email}`, external: true },
      ],
    },
  ];

  return (
    <footer className="relative mx-auto mt-16 flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden rounded-t-[2rem] border-t border-white/10 bg-[#16130F] px-6 py-12 text-[#FAF8F5] md:rounded-t-[3rem] lg:py-16">
      {/* Soft glow bleeding down from the top edge */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "radial-gradient(35% 128px at 50% 0%, rgba(255,255,255,0.09), transparent)",
        }}
        aria-hidden="true"
      />
      {/* Soft light seam along the top edge */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-1/3 -translate-x-1/2 rounded-full bg-white/30 blur-[1px]" aria-hidden="true" />

      <div className="relative grid w-full gap-10 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-4">
          <LogoRNE light size="lg" />
          <p className="max-w-xs text-sm text-white/70">{t("footer.tag")}</p>

          <div className="flex gap-3 pt-2" aria-label={t("footer.followUs")}>
            {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full border border-white/20 text-white/80 transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#16130F]"
                >
                  {SOCIAL_ICONS[s.id] ?? s.label[0]}
                </a>
            ))}
          </div>
        </AnimatedContainer>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 xl:col-span-2">
          {sections.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <h3 className="text-xs uppercase tracking-[0.18em] text-white/50">{section.label}</h3>
              <ul className="mt-4 list-none space-y-2 p-0 text-sm text-white/75">
                {section.links.map((link: any) => (
                  <li key={link.title}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center transition-colors duration-300 hover:text-white"
                      >
                        {link.title}
                      </a>
                    ) : (
                      <Link href={link.href} className="inline-flex items-center transition-colors duration-300 hover:text-white">
                        {link.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </AnimatedContainer>
          ))}
        </div>
      </div>

      {/* Bottom bar — mandatory brand lockup and copyright, unchanged */}
      <div className="relative mt-12 flex w-full flex-col items-center gap-5 border-t border-white/10 pt-8">
        <div className="flex items-center gap-5">
          {/* Hidden admin entry: tap the RNE mark 3× then enter the code */}
          <FooterAdminTrigger />
          <span className="h-8 w-px bg-white/20" aria-hidden="true" />
          <div aria-label="Developed by JOE INDUSTRIES">
            <LogoJoe height={30} />
          </div>
        </div>

        <div className="text-center">
          <p dir="rtl" className="text-sm text-white/80">{t("footer.copyright")}</p>
          <p dir="ltr" className="mt-1 text-xs text-white/55">{t("footer.developedBy")}</p>
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>["className"];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  // Respect the OS "reduce motion" setting — render the content statically.
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
