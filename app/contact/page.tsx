import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, MessageSquareText, Phone, Sparkles, Truck } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/shared/page-hero";
import { ContactSection } from "@/components/sections/contact-section";
import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";
import { buildWhatsAppLink, defaultEnquiryMessage } from "@/lib/whatsapp";
import { businessInfo } from "@/lib/business-info";
import { faqs } from "@/lib/faqs";

export const metadata = {
  title: "Contact Us | TheRootFood",
  description: "Talk to the farm — WhatsApp, call, email, or visit us in Bangalore. A real person always replies.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: Phone,
    label: "Call us",
    value: "+91 76194 36055",
    hint: "Tap to dial",
    href: `tel:${businessInfo.phone}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: businessInfo.email,
    hint: "We reply within a day",
    href: `mailto:${businessInfo.email}`,
  },
  {
    icon: MapPin,
    label: "Visit or pick up",
    value: "Bangalore, Karnataka",
    hint: "Message us for directions",
    href: buildWhatsAppLink(
      "Hi TheRootFood team! I'd love to visit the farm / pick up an order. Could you share directions and a good time to come?"
    ),
    external: true,
  },
];

const steps = [
  { icon: MessageSquareText, title: "You message us", body: "On WhatsApp, by phone, email or the form below." },
  { icon: Clock, title: "We reply personally", body: "Someone from the farm gets back to you, usually within a few hours." },
  { icon: Truck, title: "Sorted & delivered", body: "We confirm the details and get your order to your door." },
];

const popular = faqs.filter((f) =>
  ["How do I place an order?", "Do you deliver outside Bangalore?", "How do I pay?", "How much notice do you need?"].includes(f.question)
);

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-1">
        <PageHero
          eyebrow="Contact"
          title={
            <>
              Talk to the <span className="italic text-primary">farm.</span>
            </>
          }
          description="Questions about an order, a cake, or bulk supply? A real person from TheRootFood will get back to you — no call centres."
        />

        <section className="relative z-10 -mt-14 px-4 md:px-6">
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <a
              href={buildWhatsAppLink(defaultEnquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#25D366] p-6 text-white shadow-[0_25px_50px_-25px_rgba(37,211,102,0.9)] transition hover:-translate-y-1"
            >
              <span className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/15" />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#25D366]">
                <WhatsAppLogo className="h-6 w-6" />
              </span>
              <span className="relative mt-8 block">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                  <Sparkles className="h-3.5 w-3.5" /> Fastest reply
                </span>
                <span className="mt-1 flex items-center gap-2 text-xl font-semibold">
                  Chat on WhatsApp
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </a>
            {channels.map((c) => {
              const Icon = c.icon;
              return (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 hover:border-forest/30"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest/10 text-forest transition group-hover:bg-forest group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="mt-8 block min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{c.label}</span>
                    <span className="mt-1 block truncate font-semibold text-slate-900">{c.value}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{c.hint}</span>
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        <section className="px-4 pt-16 md:px-6 md:pt-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-heading text-3xl font-semibold tracking-tight sm:text-4xl">What happens next</h2>
            <ol className="relative mt-10 grid gap-6 md:grid-cols-3">
              <span aria-hidden="true" className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-gradient-to-r from-forest/0 via-forest/30 to-forest/0 md:block" />
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <li key={s.title} className="relative flex flex-col items-center text-center">
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white shadow-lg ring-8 ring-white">
                      <Icon className="h-6 w-6" />
                      <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                    </span>
                    <p className="mt-4 font-semibold text-slate-900">{s.title}</p>
                    <p className="mt-1 max-w-xs text-sm text-slate-500">{s.body}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <ContactSection compact />

        <section className="px-4 pb-20 md:px-6 md:pb-28">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#f6f3ec] p-6 sm:p-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-forest">Quick answers</p>
                <h2 className="mt-1 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                  You might not need to wait
                </h2>
              </div>
              <Link href="/faq" className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline">
                See all FAQs <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {popular.map((f) => (
                <div key={f.question} className="rounded-2xl bg-white p-5">
                  <p className="font-semibold text-slate-900">{f.question}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
