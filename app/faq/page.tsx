import Script from "next/script";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { FaqExplorer } from "@/components/faq/faq-explorer";
import { HelpCta } from "@/components/shared/help-cta";
import { faqs } from "@/lib/faqs";

export const metadata = {
  title: "FAQ | TheRootFood",
  description: "Answers about ordering on WhatsApp, delivery, payment, freshness, custom cakes and bulk orders.",
  alternates: { canonical: "/faq" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-1">
        <PageHero
          eyebrow="Help centre"
          title={
            <>
              Questions? <span className="italic text-primary">We&apos;ve got answers.</span>
            </>
          }
          description="Everything about ordering on WhatsApp, delivery, payment, freshness and cakes — in plain words."
        />
        <FaqExplorer />
        <HelpCta secondary={{ href: "/contact", label: "Other ways to reach us" }} />
      </div>
      <Footer />
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}
