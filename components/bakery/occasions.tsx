"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { bakery, occasions } from "@/lib/bakery-menu";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";
import { cn } from "@/lib/utils";

const ROTATE_MS = 4500;

function occasionMessage(phrase: string, pick?: string) {
  return [
    "Hi Nitara's Fine Bakes!",
    "",
    pick
      ? `I'm planning something for ${phrase} and I'd like the ${pick}.`
      : `I'm planning something for ${phrase}. Could you suggest a cake or brownies?`,
    "Please tell me the price and whether you can do it. Thank you!",
  ].join("\n");
}

export function Occasions() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const current = occasions[active];

  useEffect(() => {
    if (paused || !inView) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % occasions.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [active, paused, inView]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#fdf6f8] px-4 py-20 md:px-6 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#f6c9d8]/40 blur-3xl"
      />
      <div className="container relative mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#b0537a]">For every occasion</p>
            <h2 className="mt-4 max-w-xl font-heading text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-[#3d1426] sm:text-5xl md:text-6xl">
              What are we <span className="italic text-[#b0537a]">celebrating?</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm text-slate-500">Pick the occasion and see what Nitara would bake for it.</p>
        </div>

        <div
          className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <ul className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0 lg:pb-0">
            {occasions.map((o, i) => {
              const isActive = i === active;
              return (
                <li key={o.id} className="snap-start">
                  <button
                    type="button"
                    onClick={() => {
                      setActive(i);
                      setPaused(true);
                    }}
                    onMouseEnter={() => setActive(i)}
                    aria-pressed={isActive}
                    className={cn(
                      "group relative flex w-full items-center gap-4 overflow-hidden whitespace-nowrap rounded-full px-5 py-3 text-left transition-colors lg:rounded-2xl lg:px-6 lg:py-5",
                      isActive ? "text-white" : "bg-white text-[#3d1426] hover:bg-[#fbe4ec] lg:bg-transparent",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="occasion-pill"
                        className="absolute inset-0 rounded-full bg-[#3d1426] lg:rounded-2xl"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className={cn("relative font-heading text-sm tabular-nums", isActive ? "text-[#e8b4c8]" : "text-[#b0537a]/60")}>
                      0{i + 1}
                    </span>
                    <span className="relative flex-1">
                      <span className="block font-heading text-lg lg:text-3xl">{o.title}</span>
                      <span
                        className={cn(
                          "hidden text-sm italic transition-all duration-300 lg:block",
                          isActive ? "max-h-6 text-white/70 opacity-100" : "max-h-0 opacity-0",
                        )}
                      >
                        {o.line}
                      </span>
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "relative hidden h-5 w-5 transition-transform lg:block",
                        isActive ? "rotate-45 text-[#e8b4c8]" : "text-[#3d1426]/30 group-hover:translate-x-0.5",
                      )}
                    />
                    {isActive && !paused && inView && (
                      <motion.span
                        key={`bar-${active}`}
                        className="absolute bottom-0 left-0 hidden h-[2px] bg-[#e8b4c8] lg:block"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#3d1426] shadow-[0_40px_80px_-40px_rgba(61,20,38,0.7)] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[560px]">
            {/* Every photo stays mounted and cross-fades, so a slide never shows up half-loaded. */}
            {occasions.map((o, i) => (
              <Image
                key={o.id}
                src={o.image}
                alt={i === active ? `${o.title} bakes by ${bakery.name}` : ""}
                aria-hidden={i !== active}
                fill
                quality={90}
                className={cn(
                  "object-cover transition-[opacity,transform] duration-700 ease-out",
                  i === active ? "scale-100 opacity-100" : "scale-105 opacity-0",
                )}
                sizes="(max-width: 1024px) 100vw, 600px"
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a0d1a] via-[#2a0d1a]/40 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="font-heading text-3xl italic text-white sm:text-4xl">{current.line}</p>
                  <p className="mt-2 max-w-md text-sm text-white/75 sm:text-base">{current.body}</p>

                  <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#e8b4c8]">Nitara recommends</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {current.picks.map((pick, i) => (
                      <motion.a
                        key={pick}
                        href={buildWhatsAppLink(occasionMessage(current.phrase, pick), bakery.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.07 }}
                        className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-[#3d1426]"
                      >
                        {pick}
                      </motion.a>
                    ))}
                  </div>

                  <a
                    href={buildWhatsAppLink(occasionMessage(current.phrase), bakery.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-white transition hover:bg-[#1ebe5b]"
                  >
                    <WhatsAppLogo className="h-4 w-4" />
                    Plan {current.phrase}
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>

            <span className="absolute right-6 top-6 font-heading text-6xl text-white/15 sm:text-8xl">0{active + 1}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
