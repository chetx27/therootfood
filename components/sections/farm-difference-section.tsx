import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";

const rows = [
  { label: "Where it comes from", us: "Our own farm and partners we know by name", them: "Multiple wholesalers and warehouses" },
  { label: "Eggs", us: "Free-roaming country hens, collected daily", them: "Caged layers, often weeks in cold storage" },
  { label: "Flour", us: "Stone-ground in small weekly batches", them: "Roller-milled in bulk, long shelf life" },
  { label: "Preservatives", us: "None", them: "Common in packaged staples" },
  { label: "Who you talk to", us: "The people who grow it, on WhatsApp", them: "A helpline, if any" },
];

export function FarmDifferenceSection() {
  return (
    <section className="relative overflow-hidden bg-[#f6f3ec] py-20 text-slate-900 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <FadeIn>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-forest/70">
              <span aria-hidden="true" className="h-px w-8 bg-forest/40" />
              The difference
            </p>
            <h2 className="mt-5 font-heading text-4xl font-normal leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl">
              Not all food is <span className="italic text-forest">made equal.</span>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-slate-600">
              Supermarket shelves are built for shelf life. Our farm is built for flavour. Here&apos;s what that means for
              what lands on your plate.
            </p>

            <div className="relative mt-10 hidden aspect-[4/3] max-w-sm overflow-hidden rounded-[1.75rem] lg:block">
              <Image src="/products/country-eggs.webp" alt="Country eggs from the farm" fill className="object-cover" sizes="384px" />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/90 px-4 py-3 text-sm backdrop-blur">
                <p className="font-semibold text-slate-900">Richer, deeper-coloured yolks</p>
                <p className="text-slate-500">The tell-tale sign of hens that roam free.</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_40px_80px_-50px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/5">
              <div className="grid grid-cols-[1fr_1fr] sm:grid-cols-[0.8fr_1fr_1fr]">
                <div className="hidden sm:block" />
                <div className="bg-forest px-5 py-5 text-white">
                  <p className="font-heading text-lg font-semibold tracking-tight">TheRootFood</p>
                  <p className="text-xs text-white/60">Farm-direct</p>
                </div>
                <div className="px-5 py-5">
                  <p className="font-heading text-lg font-semibold tracking-tight text-slate-400">Typical store</p>
                  <p className="text-xs text-slate-400">Supermarket</p>
                </div>

                {rows.map((row) => (
                  <div key={row.label} className="contents">
                    <div className="col-span-2 border-t border-slate-100 px-5 pt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:col-span-1 sm:py-5 sm:text-xs sm:normal-case sm:tracking-normal sm:text-slate-700">
                      {row.label}
                    </div>
                    <div className="flex gap-2 bg-forest/[0.04] px-5 pb-4 pt-2 text-sm font-medium text-slate-900 sm:border-t sm:border-slate-100 sm:py-5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={2.5} />
                      {row.us}
                    </div>
                    <div className="flex gap-2 px-5 pb-4 pt-2 text-sm text-slate-400 sm:border-t sm:border-slate-100 sm:py-5">
                      <Minus className="mt-0.5 h-4 w-4 shrink-0" />
                      {row.them}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-100 bg-slate-50/60 px-5 py-5 sm:flex-row sm:items-center">
                <p className="text-sm text-slate-600">Taste the difference for yourself.</p>
                <Link
                  href="/order"
                  className="group inline-flex h-11 items-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-white transition-colors hover:bg-forest-deep"
                >
                  Start your first order
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
