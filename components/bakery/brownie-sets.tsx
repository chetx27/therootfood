"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { bakery, brownieAddOns, brownieBox, brownieTub } from "@/lib/bakery-menu";
import { bakeryItemMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { FadeIn } from "@/components/shared/fade-in";
import { MobileCarousel } from "@/components/shared/mobile-carousel";
import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";
import { cn } from "@/lib/utils";

type SetItem = typeof brownieTub | typeof brownieBox;

function optionParts(label: string) {
  const tub = label.match(/^(\w+) tub \((.+)\)$/);
  if (tub) return { title: tub[1], sub: tub[2] };
  const box = label.match(/^Box of (\d+)/);
  if (box) return { title: box[1], sub: "pcs" };
  return { title: label, sub: "" };
}

function SetCard({ item, eyebrow, defaultIndex }: { item: SetItem; eyebrow: string; defaultIndex: number }) {
  const [selected, setSelected] = useState(defaultIndex);
  const option = item.prices[selected];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-[#f1d3df] shadow-[0_24px_50px_-36px_rgba(90,31,56,0.45)] sm:flex-row">
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden sm:aspect-auto sm:min-h-[260px] sm:w-[42%]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          quality={90}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 280px"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b0537a]">{eyebrow}</p>
        <h3 className="mt-1.5 font-heading text-2xl font-semibold tracking-tight text-[#3d1426]">{item.name}</h3>
        <p className="mt-1 text-sm text-slate-500">{item.description}</p>

        <div
          className={cn("mt-5 grid gap-1.5", item.prices.length > 3 ? "grid-cols-5" : "grid-cols-2")}
          role="radiogroup"
          aria-label={`${item.name} size`}
        >
          {item.prices.map((p, i) => {
            const { title, sub } = optionParts(p.label);
            const active = i === selected;
            return (
              <button
                key={p.label}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={`${p.label}, ₹${p.price}`}
                onClick={() => setSelected(i)}
                className={cn(
                  "rounded-xl border px-1 py-2 text-center transition",
                  active
                    ? "border-[#3d1426] bg-[#3d1426] text-white"
                    : "border-[#f1d3df] bg-[#fffafc] text-[#3d1426] hover:border-[#e8b4c8]",
                )}
              >
                <span className="block text-sm font-semibold leading-tight">{title}</span>
                <span className={cn("block text-[10px]", active ? "text-white/65" : "text-slate-400")}>{sub}</span>
              </button>
            );
          })}
        </div>

        <a
          href={buildWhatsAppLink(bakeryItemMessage(item.name, option.label), bakery.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex h-12 items-center justify-between rounded-full bg-[#25D366] pl-5 pr-1.5 text-sm font-semibold text-white transition hover:bg-[#1ebe5b] sm:mt-auto"
        >
          <span className="inline-flex items-center gap-2">
            <WhatsAppLogo className="h-4 w-4" />
            Order<span className="hidden min-[380px]:inline"> on WhatsApp</span>
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={option.price}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="rounded-full bg-white px-3.5 py-1.5 tabular-nums text-[#128C4B]"
            >
              ₹{option.price.toLocaleString("en-IN")}
            </motion.span>
          </AnimatePresence>
        </a>
      </div>
    </article>
  );
}

export function BrownieSets() {
  return (
    <section className="bg-white px-4 py-16 md:px-6 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <FadeIn className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#b0537a]">Tubs &amp; boxes</p>
          <h2 className="mt-3 font-heading text-4xl font-normal tracking-[-0.02em] text-[#3d1426] sm:text-5xl">
            Made for <span className="italic text-[#b0537a]">sharing.</span>
          </h2>
        </FadeIn>

        <MobileCarousel label="Brownie tubs and boxes" gridClassName="sm:mx-auto sm:max-w-2xl sm:grid-cols-1 sm:gap-6 xl:max-w-none xl:grid-cols-2">
          <SetCard item={brownieTub} eyebrow="To share" defaultIndex={1} />
          <SetCard item={brownieBox} eyebrow="To gift" defaultIndex={1} />
        </MobileCarousel>

        <FadeIn delay={0.1}>
          <div className="mt-10 rounded-[2rem] bg-[#fdf6f8] p-6 sm:p-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-heading text-2xl font-semibold text-[#3d1426]">Make them special</h3>
              <p className="font-heading text-sm italic text-[#b0537a]">Custom flavours &amp; designs on request</p>
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {brownieAddOns.map((a) => (
                <li key={a.name} className="rounded-2xl bg-white p-4 text-center ring-1 ring-[#f1d3df]">
                  <p className="font-heading text-xl font-semibold text-[#b0537a]">
                    +₹{a.price}
                    <span className="text-xs font-normal text-slate-400"> / pc</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-700">{a.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
