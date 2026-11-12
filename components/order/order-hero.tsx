import Image from "next/image";
import { ArrowDown, Leaf, ShoppingBasket, Truck } from "lucide-react";
import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";

const steps = [
  {
    icon: ShoppingBasket,
    title: "Fill your basket",
    body: "Pick flours, eggs, meat and soap. Change the quantities any time.",
  },
  {
    icon: WhatsAppLogo,
    title: "Send it on WhatsApp",
    body: "One tap sends us the whole list. You can also ask about items one by one.",
  },
  {
    icon: Truck,
    title: "We confirm & deliver",
    body: "A real person confirms stock and total. Pay by UPI, transfer or cash.",
  },
];

const highlights = ["Farm-raised, no middlemen", "Same-day delivery in Bangalore", "Dry goods ship worldwide"];

export function OrderHero() {
  return (
    <section className="bg-white px-3 pt-3 sm:px-5 sm:pt-4 md:px-8 lg:px-12">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[1.75rem] bg-forest text-white sm:rounded-[2.5rem]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_10%,rgba(232,180,200,0.22),transparent_45%),radial-gradient(ellipse_at_0%_100%,rgba(255,255,255,0.07),transparent_45%)]"
        />

        <div className="relative grid items-center gap-10 px-6 pb-10 pt-12 sm:px-10 md:grid-cols-[1.15fr_1fr] md:px-14 md:pb-14 md:pt-16 lg:px-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90">
              <Leaf className="h-3.5 w-3.5 text-primary" />
              Harvested this week
            </span>
            <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Fresh from our farm, <span className="italic text-primary">ordered on WhatsApp.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
              No checkout forms, no card details. Build your basket here and we&apos;ll sort out the rest with you
              personally.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {highlights.map((h) => (
                <li key={h} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85">
                  {h}
                </li>
              ))}
            </ul>
            <a
              href="#products"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
            >
              Start shopping
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>

          <div className="relative mx-auto hidden aspect-square w-full max-w-[420px] md:block">
            <div className="absolute inset-6 rounded-full bg-white/10 blur-2xl" />
            <Image
              src="/hero-farm-box.webp"
              alt="A wooden crate of farm produce"
              fill
              priority
              className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
              sizes="420px"
            />
          </div>
        </div>

        <ol className="relative grid gap-px border-t border-white/10 bg-white/10 lg:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="flex gap-4 bg-forest px-6 py-6 sm:px-8 md:px-10">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-primary">
                  <Icon className="h-5 w-5" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
