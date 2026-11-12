"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { FloatingElement } from "@/components/shared/floating-element";
import { bakery } from "@/lib/bakery-menu";
import { buildWhatsAppLink, customBakeMessage } from "@/lib/whatsapp";
import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";

const IDEAS = [
  "A 2-tier floral cake for my mom's 60th",
  "Unicorn theme cake for a 5 year old",
  "Brownie box with 'Happy Anniversary' on top",
  "A minimal white cake with gold leaf",
];

export function CakeEnquirySection() {
  const [idea, setIdea] = useState("");
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (idea.trim().length < 5) {
      toast.error("Tell us a little about what you'd like.");
      return;
    }
    window.open(
      buildWhatsAppLink(customBakeMessage(idea, name.trim() || undefined), bakery.whatsapp),
      "_blank",
      "noopener,noreferrer",
    );
    toast.success("Opening WhatsApp with your note.");
  }

  return (
    <section id="cakes" className="relative scroll-mt-20 overflow-hidden bg-[#3d1426] py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(232,180,200,0.16),transparent_45%),radial-gradient(ellipse_at_80%_70%,rgba(255,255,255,0.06),transparent_40%)]"
      />

      <FloatingElement className="pointer-events-none absolute top-16 left-[3%] z-10 hidden lg:block" duration={7} amplitude={16} rotate={6}>
        <div className="relative h-36 w-36 overflow-hidden rounded-full border-[5px] border-[#e8b4c8]/70 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]">
          <Image src="/bakery/cake-celebration.webp" alt="" aria-hidden="true" fill quality={90} className="object-cover" sizes="144px" />
        </div>
      </FloatingElement>
      <FloatingElement className="pointer-events-none absolute bottom-20 right-[4%] z-10 hidden md:block" duration={6.5} delay={0.6} amplitude={14} rotate={5}>
        <div className="relative h-28 w-28 overflow-hidden rounded-full border-[5px] border-[#e8b4c8]/70 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] lg:h-40 lg:w-40">
          <Image src="/bakery/brownie-nutella.webp" alt="" aria-hidden="true" fill quality={90} className="object-cover" sizes="160px" />
        </div>
      </FloatingElement>

      <div className="container relative z-20 mx-auto max-w-3xl px-4 md:px-6">
        <FadeIn className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#e8b4c8]">Customise</p>
          <h2 className="mt-4 font-heading text-4xl font-semibold leading-none tracking-tight text-white sm:text-5xl md:text-6xl">
            Make it <span className="italic text-[#e8b4c8]">your way.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/70">
            Want something that isn&apos;t on the menu? Tell us the occasion, the theme and how many people it&apos;s
            for, and Nitara&apos;s team will bake it for you.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="relative mt-10 rounded-[2rem] bg-[#fffaf5] p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] sm:p-10"
          >
            <label htmlFor="bake-idea" className="flex items-center gap-2 font-heading text-xl italic text-[#5a1f38]">
              <Sparkles className="h-5 w-5 text-[#b0537a]" />
              Dear Nitara&apos;s Fine Bakes…
            </label>
            <textarea
              id="bake-idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={5}
              maxLength={800}
              placeholder="I'd love a…"
              className="mt-4 w-full resize-none border-0 bg-[repeating-linear-gradient(transparent,transparent_35px,#f1d3df_35px,#f1d3df_36px)] bg-local font-heading text-lg leading-9 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {IDEAS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdea(i)}
                  className="rounded-full border border-[#f1d3df] bg-white px-3 py-1.5 text-xs text-[#5a1f38] transition-colors hover:border-[#b0537a] hover:bg-[#fbe4ec]"
                >
                  {i}
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label htmlFor="bake-name" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Your name <span className="font-normal normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  id="bake-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                  className="mt-2 h-12 w-full rounded-full border border-[#f1d3df] bg-white px-5 text-slate-800 focus:border-[#b0537a] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(37,211,102,0.8)] transition hover:bg-[#1ebe5b]"
              >
                <WhatsAppLogo className="h-5 w-5" />
                Send my note
              </button>
            </div>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}
