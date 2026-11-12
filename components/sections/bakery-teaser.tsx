import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { InstagramLogo } from "@/components/ui/instagram-logo";
import { bakery, brownies, cakeMenu } from "@/lib/bakery-menu";

const cakeCount = cakeMenu.reduce((n, c) => n + c.items.length, 0);
const cakeFrom = Math.min(...cakeMenu.flatMap((c) => c.items.map((i) => i.price)));
const brownieFrom = Math.min(...brownies.flatMap((b) => b.prices.map((p) => p.price)));

const highlights = [
  { value: `${cakeCount}+`, label: "cake flavours" },
  { value: `${brownies.length}`, label: "brownie varieties" },
  { value: "Eggless", label: "on request" },
];

const showcase = [
  { src: "/bakery/brownie-lotus-biscoff.webp", alt: "Lotus Biscoff brownie", className: "col-span-2 row-span-2" },
  { src: "/bakery/cake-celebration.webp", alt: "Celebration cake", className: "" },
  { src: "/bakery/brownie-box.webp", alt: "Assorted brownie box", className: "" },
];

export function BakeryTeaser() {
  return (
    <section className="relative overflow-hidden bg-[#fdf6f8] py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_10%,rgba(232,180,200,0.35),transparent_45%)]"
      />
      <div className="container relative mx-auto px-4 md:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <FadeIn>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#b0537a]">
              <span aria-hidden="true" className="h-px w-8 bg-[#b0537a]/40" />
              Our bakery
            </p>
            <h2 className="mt-5 font-heading text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-[#3d1426] sm:text-5xl md:text-6xl">
              <span className="italic">Nitara&apos;s</span> Fine Bakes
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-slate-600">
              The sweet side of TheRootFood. Celebration cakes in classic, exotic and chocolate flavours, fudgy brownies,
              brownie boxes and custom designs. Everything is homemade in small batches with eggs from our farm.
            </p>

            <dl className="mt-8 grid max-w-md grid-cols-3 divide-x divide-[#e8b4c8]/60 border-y border-[#e8b4c8]/60">
              {highlights.map((h) => (
                <div key={h.label} className="px-3 py-4 first:pl-0">
                  <dt className="sr-only">{h.label}</dt>
                  <dd className="font-heading text-2xl font-semibold text-[#3d1426] sm:text-3xl">{h.value}</dd>
                  <dd className="text-xs text-slate-500">{h.label}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-sm text-slate-600">
              Cakes from <span className="font-semibold text-[#b0537a]">₹{cakeFrom}</span> · Brownies from{" "}
              <span className="font-semibold text-[#b0537a]">₹{brownieFrom}</span>
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/cakes"
                className="group inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#5a1f38] px-6 text-sm font-semibold text-white transition hover:bg-[#3d1426]"
              >
                See the full menu
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={bakery.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#e8b4c8] bg-white px-6 text-sm font-semibold text-[#5a1f38] transition hover:border-[#b0537a]"
              >
                <InstagramLogo className="h-4 w-4" />
                @{bakery.instagramHandle}
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative">
              <div className="grid aspect-[4/3] grid-cols-3 grid-rows-2 gap-3 sm:gap-4">
                {showcase.map((img) => (
                  <div key={img.src} className={`relative overflow-hidden rounded-[1.5rem] bg-white shadow-[0_25px_50px_-30px_rgba(90,31,56,0.55)] ${img.className}`}>
                    <Image src={img.src} alt={img.alt} fill quality={90} className="object-cover" sizes="(max-width: 1024px) 60vw, 35vw" />
                  </div>
                ))}
              </div>
              <Image
                src="/bakery/cake-slice.webp"
                alt=""
                aria-hidden="true"
                width={324}
                height={360}
                className="pointer-events-none absolute -bottom-10 -left-8 hidden w-32 mix-blend-multiply sm:block lg:w-40"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
