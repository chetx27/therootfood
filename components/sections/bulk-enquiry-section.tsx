"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, ChefHat, Loader2, Store, Truck, UtensilsCrossed } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { FloatingElement } from "@/components/shared/floating-element";
import { SquigglyText } from "@/components/ui/squiggly-text";
import { bulkEnquirySchema, BulkEnquiryFormValues } from "@/lib/validations";
import { products } from "@/data/products";
import { useAnalytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const audiences = [
  { icon: ChefHat, label: "Restaurants & cafés" },
  { icon: UtensilsCrossed, label: "Caterers & events" },
  { icon: Store, label: "Retail & wellness brands" },
];

const steps = [
  { title: "Share your needs", copy: "Products, volumes, frequency." },
  { title: "Tailored quote", copy: "Usually within a day." },
  { title: "Taste a sample", copy: "Try it in your kitchen." },
  { title: "Steady supply", copy: "On a schedule you can plan around." },
];

const inkWords = [
  { text: "wholesale", className: "left-[4%] top-[12%] -rotate-12 text-forest/15", duration: 8, sway: 10 },
  { text: "farm fresh", className: "right-[5%] top-[18%] rotate-6 text-forest/12", duration: 9, sway: -8 },
  { text: "supply", className: "left-[8%] bottom-[22%] rotate-[-8deg] text-forest/10", duration: 7.5, sway: 7 },
  { text: "bulk", className: "right-[7%] bottom-[28%] rotate-10 text-forest/14", duration: 8.5, sway: -6 },
] as const;

export function BulkEnquirySection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formRenderedAt] = useState(() => Date.now());
  const track = useAnalytics();

  const form = useForm<BulkEnquiryFormValues>({
    resolver: zodResolver(bulkEnquirySchema),
    defaultValues: {
      enquiryType: "bulk",
      businessName: "",
      contactName: "",
      phone: "",
      email: "",
      productInterest: "",
      estimatedVolume: "",
      message: "",
      honeypot: "",
    },
  });

  async function onSubmit(data: BulkEnquiryFormValues) {
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

      toast.success("Bulk enquiry received! We will get back to you shortly.");
      track("bulk_enquiry_submitted");
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
      id="bulk"
      className="relative scroll-mt-20 overflow-hidden bg-white py-20 text-slate-900 md:py-28"
    >
      {/* Soft atmosphere — not a flat white void */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(45,92,66,0.07),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(232,180,200,0.12),transparent_45%)]"
      />

      {/* Floating inky words */}
      {inkWords.map((word, i) => (
        <FloatingElement
          key={word.text}
          className={cn(
            "pointer-events-none absolute z-10 hidden select-none md:block",
            word.className
          )}
          duration={word.duration}
          delay={i * 0.35}
          amplitude={8 + i}
          sway={word.sway}
          rotate={3}
        >
          <SquigglyText
            className="font-heading font-semibold text-3xl tracking-tight lg:text-4xl"
            scale={[4, 6]}
            stepDuration={100}
          >
            {word.text}
          </SquigglyText>
        </FloatingElement>
      ))}

      {/* Subtle floating accents — truck / culinary / retail */}
      <FloatingElement
        className="pointer-events-none absolute left-[2%] top-24 z-10 hidden md:block"
        duration={7}
        amplitude={10}
        sway={8}
        rotate={4}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-forest/15 bg-white text-forest shadow-[0_16px_40px_-18px_rgba(45,92,66,0.45)] lg:h-16 lg:w-16">
          <Truck className="h-7 w-7 lg:h-8 lg:w-8" strokeWidth={1.5} />
        </div>
      </FloatingElement>

      <FloatingElement
        className="pointer-events-none absolute right-[3%] top-28 z-10 hidden md:block"
        duration={6.5}
        delay={0.5}
        amplitude={12}
        sway={-7}
        rotate={5}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-forest/15 bg-white text-forest shadow-[0_16px_40px_-18px_rgba(45,92,66,0.4)] lg:h-14 lg:w-14">
          <ChefHat className="h-6 w-6 lg:h-7 lg:w-7" strokeWidth={1.5} />
        </div>
      </FloatingElement>

      <FloatingElement
        className="pointer-events-none absolute bottom-24 left-[5%] z-10 hidden lg:block"
        duration={8}
        delay={1}
        amplitude={9}
        sway={6}
        rotate={3}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-forest/15 bg-white text-forest/90 shadow-[0_16px_40px_-18px_rgba(45,92,66,0.35)]">
          <Store className="h-6 w-6" strokeWidth={1.5} />
        </div>
      </FloatingElement>

      <FloatingElement
        className="pointer-events-none absolute bottom-36 right-[6%] z-10 hidden lg:block"
        duration={7.5}
        delay={1.4}
        amplitude={11}
        sway={-5}
        rotate={4}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-forest/15 bg-white text-forest/90 shadow-[0_16px_40px_-18px_rgba(45,92,66,0.35)]">
          <UtensilsCrossed className="h-5 w-5" strokeWidth={1.5} />
        </div>
      </FloatingElement>

      <div className="container relative z-20 mx-auto px-4 md:px-6">
        <FadeIn className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-forest/70">
            Wholesale &amp; supply
          </p>
          <h2 className="font-heading font-semibold text-4xl leading-none tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Bulk orders
            <br />
            <span className="highlight-block mt-3 inline-block">for business</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-slate-600">
            Flour, eggs and meat for restaurants, caterers and shops at wholesale rates. We quote in
            INR, USD or EUR.
          </p>
        </FadeIn>

        {/* Quote form */}
        <FadeIn delay={0.1}>
          <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-slate-200/90 bg-white p-6 shadow-[0_28px_70px_-40px_rgba(15,23,42,0.35)] sm:p-8 md:p-10">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading font-semibold text-2xl tracking-tight text-forest sm:text-3xl">
                  Request a quote
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Tell us what you need and we&apos;ll reply with volume pricing.
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {audiences.map((a) => (
                    <li
                      key={a.label}
                      className="inline-flex items-center gap-1.5 rounded-full bg-forest/[0.07] px-3 py-1 text-xs font-medium text-forest"
                    >
                      <a.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                      {a.label}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest/10 text-forest sm:inline-flex">
                <Truck className="h-6 w-6" />
              </span>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your café, shop or kitchen"
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
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact person</FormLabel>
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
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="contact@yourcompany.com"
                            type="email"
                            className="h-12 rounded-xl border-slate-200 bg-slate-50/80"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="productInterest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product interest</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/80">
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p.id} value={p.name}>
                                {p.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="Other">Other / Multiple</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estimatedVolume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated volume (optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 10 kg per week"
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
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more about your requirements..."
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
                      Submitting...
                    </>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-2">
                      Request bulk quote
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <p className="text-center text-sm text-slate-500">
                  Prefer email?{" "}
                  <a href="mailto:therootfoodsupport@gmail.com" className="font-medium text-forest hover:underline">
                    therootfoodsupport@gmail.com
                  </a>
                </p>
              </form>
            </Form>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mx-auto mt-10 max-w-3xl">
            <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              How it works
            </p>
            <ol className="relative grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
              <span
                aria-hidden="true"
                className="absolute left-[12.5%] right-[12.5%] top-4 hidden border-t border-dashed border-forest/25 sm:block"
              />
              {steps.map((step, i) => (
                <li key={step.title} className="relative text-center">
                  <span className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-white font-heading text-sm italic text-forest ring-1 ring-forest/25">
                    {i + 1}
                  </span>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{step.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{step.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
