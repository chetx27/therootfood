import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { bakery } from "@/lib/bakery-menu";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { InstagramLogo } from "@/components/ui/instagram-logo";
import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";

export function BakeryHero() {
  return (
    <section className="bg-white px-3 pt-3 sm:px-5 sm:pt-4 md:px-8 lg:px-12">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[1.75rem] bg-[#fdf6f8] ring-1 ring-inset ring-[#e8b4c8]/30 sm:rounded-[2.5rem]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,180,200,0.35),transparent_60%)]"
        />
        <Image
          src="/bakery/cake-tier.webp"
          alt=""
          aria-hidden="true"
          width={290}
          height={560}
          priority
          className="pointer-events-none absolute -left-2 bottom-0 hidden w-36 mix-blend-multiply md:block lg:w-48"
        />
        <Image
          src="/bakery/cake-slice.webp"
          alt=""
          aria-hidden="true"
          width={324}
          height={360}
          priority
          className="pointer-events-none absolute -right-2 top-8 hidden w-36 mix-blend-multiply md:block lg:w-52"
        />

        <div className="relative mx-auto max-w-2xl px-6 py-14 text-center sm:py-20">
          <p className="flex items-center justify-center gap-4 text-[11px] font-medium uppercase tracking-[0.35em] text-[#b0537a]">
            <span aria-hidden="true" className="h-px w-8 bg-[#b0537a]/40 sm:w-12" />
            The bakery at TheRootFood
            <span aria-hidden="true" className="h-px w-8 bg-[#b0537a]/40 sm:w-12" />
          </p>
          <h1 className="mt-5 font-heading text-5xl font-normal italic leading-none tracking-[-0.02em] text-[#5a1f38] sm:text-7xl md:text-8xl">
            Nitara&apos;s
          </h1>
          <p className="mt-2 font-heading text-lg uppercase tracking-[0.4em] text-[#5a1f38] sm:text-2xl">Fine Bakes</p>
          <p className="mt-5 text-sm font-medium text-[#b0537a] sm:text-base">{bakery.tagline}</p>
          <p className="mx-auto mt-4 max-w-md text-slate-600">
            Celebration cakes, fudgy brownies and custom bakes, made at home in small batches with eggs from our own
            farm.
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href={bakery.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(221,42,123,0.8)] transition hover:opacity-90"
            >
              <InstagramLogo className="h-5 w-5" />
              @{bakery.instagramHandle}
            </a>
            <a
              href={buildWhatsAppLink("Hi Nitara's Fine Bakes! I found you on TheRootFood and I'd like to order something sweet.", bakery.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white transition hover:bg-[#1ebe5b]"
            >
              <WhatsAppLogo className="h-5 w-5" />
              Order on WhatsApp
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#b0537a]" />{bakery.location}</span>
            <a href={`tel:${bakery.phone}`} className="flex items-center gap-1.5 hover:text-[#5a1f38]">
              <Phone className="h-4 w-4 text-[#b0537a]" />{bakery.phoneDisplay}
            </a>
          </div>

          <nav className="mt-10 flex flex-wrap items-center justify-center gap-1.5 text-xs font-semibold min-[390px]:gap-2 min-[390px]:text-[13px] min-[440px]:text-sm" aria-label="Bakery sections">
            {[
              { href: "#cake-menu", label: "Cake menu" },
              { href: "#brownies", label: "Brownies" },
              { href: "#cakes", label: "Custom cake" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full border border-[#e8b4c8] bg-white/70 px-2.5 text-[#5a1f38] transition hover:bg-white min-[390px]:px-3 min-[440px]:px-4"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
