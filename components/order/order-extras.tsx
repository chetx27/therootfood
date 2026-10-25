import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

export function BulkPromo() {
  return (
    <section className="bg-white px-4 pb-6 md:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col gap-6 rounded-[2rem] bg-slate-900 p-8 text-white sm:p-10 md:flex-row md:items-center md:justify-between lg:p-12">
          <div className="flex items-start gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <Building2 className="h-6 w-6 text-primary" />
            </span>
            <div>
              <h2 className="font-heading text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                Buying for a café, shop or kitchen?
              </h2>
              <p className="mt-2 max-w-xl text-white/70">
                Regular supply of flour, eggs and meat at wholesale rates, with a fixed delivery schedule.
              </p>
            </div>
          </div>
          <Link
            href="/#bulk"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-slate-900 transition-colors hover:bg-white/90"
          >
            Get a bulk quote
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
