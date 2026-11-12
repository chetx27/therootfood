import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarHeart, MessageCircleHeart, PackageCheck, Sparkles } from "lucide-react";
import { bakery, brownies, signatureBakes } from "@/lib/bakery-menu";
import { bakeryItemMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { FadeIn } from "@/components/shared/fade-in";
import { MobileCarousel } from "@/components/shared/mobile-carousel";
import { InstagramLogo } from "@/components/ui/instagram-logo";
import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] ${
        light ? "text-[#e8b4c8]" : "text-[#b0537a]"
      }`}
    >
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
      {children}
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
    </p>
  );
}

export function SignatureBakes({ withMenuLink = false }: { withMenuLink?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-[#3d1426] px-4 py-20 md:px-6 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(232,180,200,0.22),transparent_50%),radial-gradient(ellipse_at_90%_100%,rgba(176,83,122,0.35),transparent_45%)]"
      />
      <div className="container relative mx-auto max-w-6xl">
        <FadeIn className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <Eyebrow light>Nitara&apos;s signatures</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-normal tracking-[-0.02em] text-white sm:text-5xl md:text-6xl">
            The bakes everyone <span className="italic text-[#e8b4c8]">asks for.</span>
          </h2>
          <p className="mt-4 text-white/65">The cakes and brownies people order again and again. Each one is baked after you order.</p>
        </FadeIn>

        <MobileCarousel label="Signature bakes" tone="dark" gridClassName="sm:grid-cols-2 lg:grid-cols-4">
          {signatureBakes.map((b, i) => (
            <FadeIn key={b.name} delay={i * 0.06}>
              <a
                href={buildWhatsAppLink(bakeryItemMessage(b.name.includes("Brownie") ? b.name : `${b.name} cake`), bakery.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-[1.75rem] bg-white/5 ring-1 ring-white/10 transition hover:-translate-y-1 hover:ring-[#e8b4c8]/50"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={b.image}
                    alt={b.name}
                    fill
                    quality={90}
                    // Eager: slides waiting off to the side of the phone carousel are never lazy-loaded in time.
                    loading="eager"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3d1426] via-[#3d1426]/20 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#b0537a]">
                    {b.tag}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-heading text-2xl text-white">{b.name}</h3>
                    <p className="mt-1 text-sm text-white/70">{b.note}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-semibold text-[#e8b4c8]">from ₹{b.price.toLocaleString("en-IN")}</span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform group-hover:scale-110">
                        <WhatsAppLogo className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </FadeIn>
          ))}
        </MobileCarousel>

        {withMenuLink && (
          <div className="mt-12 text-center">
            <Link
              href="/cakes"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#3d1426] transition hover:bg-[#fbe4ec]"
            >
              See the full cake &amp; brownie menu
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

const steps = [
  { icon: Sparkles, title: "Pick your bake", body: "Choose from the menu or describe your own idea." },
  { icon: MessageCircleHeart, title: "Message on WhatsApp", body: "Tap any item and the order note is already typed for you." },
  { icon: CalendarHeart, title: "Confirm the date", body: "Give us 3 days for custom cakes. We'll confirm the price." },
  { icon: PackageCheck, title: "Fresh to your door", body: "We bake it and deliver it. The delivery charge depends on where you are." },
];

export function HowToOrderBakes() {
  return (
    <section className="bg-white px-4 py-20 md:px-6 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <FadeIn className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-normal tracking-[-0.02em] text-[#3d1426] sm:text-5xl">
            Ordering is <span className="italic text-[#b0537a]">a piece of cake.</span>
          </h2>
        </FadeIn>
        <ol className="relative grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          <span aria-hidden="true" className="absolute left-[12%] right-[12%] top-7 hidden border-t border-dashed border-[#e8b4c8] lg:block" />
          {steps.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.07}>
              <li className="relative text-center">
                <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fbe4ec] text-[#b0537a] ring-8 ring-white">
                  <s.icon className="h-6 w-6" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#b0537a]">Step {i + 1}</p>
                <h3 className="mt-1 font-heading text-xl font-semibold text-[#3d1426]">{s.title}</h3>
                <p className="mx-auto mt-1.5 max-w-[16rem] text-sm text-slate-600">{s.body}</p>
              </li>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  );
}

const gallery = [
  "/bakery/cake-celebration.webp",
  "/bakery/brownie-lotus-biscoff.webp",
  "/bakery/cake-exotic.webp",
  "/bakery/brownie-box.webp",
  "/bakery/cake-chocolate.webp",
  brownies[4].image,
];

export function InstagramWall() {
  return (
    <section className="bg-[#fdf6f8] px-4 py-20 md:px-6 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <FadeIn className="mx-auto mb-10 max-w-2xl text-center">
          <Eyebrow>Follow the bakes</Eyebrow>
          <h2 className="mt-4 font-heading text-4xl font-normal tracking-[-0.02em] text-[#3d1426] sm:text-5xl">
            Fresh from the oven, <span className="italic text-[#b0537a]">on Instagram.</span>
          </h2>
        </FadeIn>
        <a
          href={bakery.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6"
          aria-label={`Open @${bakery.instagramHandle} on Instagram`}
        >
          {gallery.map((src) => (
            <div key={src} className="relative aspect-square overflow-hidden rounded-2xl">
              <Image src={src} alt="" fill quality={90} className="object-cover transition-transform duration-500 hover:scale-110" sizes="(max-width: 768px) 33vw, 16vw" />
              <div className="absolute inset-0 flex items-center justify-center bg-[#3d1426]/0 opacity-0 transition hover:bg-[#3d1426]/40 hover:opacity-100">
                <InstagramLogo className="h-7 w-7 text-white" />
              </div>
            </div>
          ))}
        </a>
        <div className="mt-8 text-center">
          <a
            href={bakery.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-7 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(221,42,123,0.8)] transition hover:opacity-90"
          >
            <InstagramLogo className="h-5 w-5" />
            Follow @{bakery.instagramHandle}
          </a>
        </div>
      </div>
    </section>
  );
}
