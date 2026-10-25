"use client";

import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { generalEnquirySchema, GeneralEnquiryFormValues } from "@/lib/validations";
import { useAnalytics } from "@/lib/analytics";
import { buildWhatsAppLink, defaultEnquiryMessage } from "@/lib/whatsapp";
import { businessInfo } from "@/lib/business-info";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const quickLinks = [
  {
    label: "Call us",
    value: "+91 76194 36055",
    href: `tel:${businessInfo.phone}`,
    icon: Phone,
    hint: "Tap to dial",
  },
  {
    label: "WhatsApp support",
    value: "Chat with the farm",
    href: buildWhatsAppLink(defaultEnquiryMessage()),
    icon: WhatsAppLogo,
    hint: "Fastest reply",
    external: true,
  },
  {
    label: "Email",
    value: businessInfo.email,
    href: `mailto:${businessInfo.email}`,
    icon: Mail,
    hint: "We reply within a day",
  },
];

export function ContactSection({ compact = false }: { compact?: boolean }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formRenderedAt] = useState(() => Date.now());
  const track = useAnalytics();

  const form = useForm<GeneralEnquiryFormValues>({
    resolver: zodResolver(generalEnquirySchema),
    defaultValues: {
      enquiryType: "general",
      name: "",
      phone: "",
      email: "",
      message: "",
      honeypot: "",
    },
  });

  async function onSubmit(data: GeneralEnquiryFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, formRenderedAt }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit enquiry.");
      }

      toast.success("Message sent! We'll get back to you shortly.");
      track("contact_form_submitted");
      form.reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred. Please try WhatsApp directly.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id={compact ? "message" : "contact"}
      className={cn("relative scroll-mt-20 overflow-hidden bg-white text-slate-900", compact ? "py-14 md:py-20" : "py-20 md:py-28")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(232,180,200,0.14),transparent_48%),radial-gradient(ellipse_at_bottom_left,rgba(45,92,66,0.06),transparent_42%)]"
      />

      <div className="container relative mx-auto px-4 md:px-6">
        {!compact && (
        <FadeIn className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-forest/70">
            Easy contact
          </p>
          <h2 className="font-heading font-semibold text-4xl leading-none tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Get in
            <br />
            <span className="highlight-block mt-3 inline-block">touch</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-slate-600">
            Talk to a real person from the farm — WhatsApp is fastest, or leave a note below.
          </p>
        </FadeIn>
        )}

        {!compact && (
        <FadeIn delay={0.05}>
          <div className="mx-auto mb-10 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 md:mb-14">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.3)] transition hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-[0_18px_40px_-24px_rgba(45,92,66,0.3)] sm:flex-col sm:items-start sm:p-5"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-white shadow-md transition group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {item.label}
                    </span>
                    <span className="mt-1 block truncate text-sm font-semibold text-slate-900 sm:text-base">
                      {item.value}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">{item.hint}</span>
                  </span>
                </a>
              );
            })}
          </div>
        </FadeIn>
        )}

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
          <FadeIn delay={0.1}>
            <div className="h-full rounded-[1.75rem] border border-slate-200/90 bg-slate-50/70 p-6 sm:p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-forest/10 text-forest">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-semibold text-2xl tracking-tight text-slate-900">
                Where we deliver
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                Based in Bangalore. Fresh produce (cakes, meat, eggs) delivers locally. Flours, roots,
                and soaps ship across India and internationally.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                <li className="flex gap-2">
                  <span className="text-forest">●</span>
                  Orders processed within 24 hours
                </li>
                <li className="flex gap-2">
                  <span className="text-forest">●</span>
                  Perishables — contact us immediately if anything arrives off
                </li>
                <li className="flex gap-2">
                  <span className="text-forest">●</span>
                  Real farm team on WhatsApp, not a call centre
                </li>
              </ul>
              <a
                href={buildWhatsAppLink(defaultEnquiryMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 min-h-[48px] text-sm font-semibold text-white transition hover:bg-forest-deep sm:w-auto"
                )}
              >
                <WhatsAppLogo className="h-4 w-4" />
                Message support now
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="rounded-[1.75rem] border border-slate-200/90 bg-white p-6 shadow-[0_28px_70px_-40px_rgba(15,23,42,0.3)] sm:p-8 md:p-10">
              <h3 className="font-heading font-semibold text-2xl tracking-tight text-forest sm:text-3xl">
                Leave a note
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Prefer a form? Send details and we&apos;ll reply soon.
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-5">
                  <div
                    className="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 -m-px"
                    aria-hidden="true"
                  >
                    <FormField
                      control={form.control}
                      name="honeypot"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input tabIndex={-1} autoComplete="off" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              className="h-12 rounded-xl border-slate-200 bg-slate-50/80"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="9876543210"
                              type="tel"
                              maxLength={10}
                              className="h-12 rounded-xl border-slate-200 bg-slate-50/80"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@example.com"
                            type="email"
                            className="h-12 rounded-xl border-slate-200 bg-slate-50/80"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How can we help?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ask about an order, delivery, bulk, or cakes…"
                            className="resize-none rounded-xl border-slate-200 bg-slate-50/80 p-4"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[50px] rounded-full bg-forest text-base text-white hover:bg-forest-deep"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send message"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
