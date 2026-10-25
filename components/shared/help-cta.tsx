import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";
import { buildWhatsAppLink, defaultEnquiryMessage } from "@/lib/whatsapp";
import { businessInfo } from "@/lib/business-info";

export function HelpCta({ title = "Still have a question?", secondary }: { title?: string; secondary?: { href: string; label: string } }) {
  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-forest px-6 py-12 text-center text-white sm:rounded-[2.5rem] sm:px-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,180,200,0.25),transparent_55%)]"
        />
        <div className="relative">
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/75">
            A real person from the farm replies — usually within a few hours. No call centres, no bots on the other end.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href={buildWhatsAppLink(defaultEnquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white shadow-[0_10px_25px_-10px_rgba(37,211,102,0.9)] transition hover:bg-[#1ebe5b]"
            >
              <WhatsAppLogo className="h-5 w-5" />
              Chat on WhatsApp
            </a>
            <a
              href={`tel:${businessInfo.phone}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10"
            >
              <Phone className="h-4 w-4" />
              Call +91 76194 36055
            </a>
            {secondary && (
              <Link
                href={secondary.href}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10"
              >
                {secondary.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
