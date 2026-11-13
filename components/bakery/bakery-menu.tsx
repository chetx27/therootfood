import Image from "next/image";
import { CakeSlice, Clock, CreditCard, Sparkles, Truck } from "lucide-react";
import {
  bakery,
  bakeryInfo,
  brownies,
  cakeMenu,
  cakeNotes,
} from "@/lib/bakery-menu";
import { cakeItemId } from "@/lib/bakery-basket";
import { CakeRowBasketControl } from "@/components/bakery/add-to-basket";
import { StickyBasketBar } from "@/components/cart/sticky-basket-bar";
import { FadeIn } from "@/components/shared/fade-in";
import { BrownieSets } from "@/components/bakery/brownie-sets";
import { BrownieCard } from "@/components/bakery/brownie-card";
import { CakeMenuTabs } from "@/components/bakery/cake-menu-tabs";
import { MobileCarousel } from "@/components/shared/mobile-carousel";

const infoIcons = [Truck, Clock, CreditCard];

function SectionTitle({ eyebrow, title, accent }: { eyebrow: string; title: string; accent: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#b0537a]">{eyebrow}</p>
      <h2 className="mt-3 font-heading text-4xl font-normal tracking-[-0.02em] text-[#3d1426] sm:text-5xl">
        {title} <span className="italic text-[#b0537a]">{accent}</span>
      </h2>
    </div>
  );
}

export function BakeryMenu() {
  return (
    <>
      <section id="cake-menu" className="scroll-mt-20 bg-white px-4 py-16 md:px-6 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <SectionTitle eyebrow="Celebration cakes" title="The cake" accent="menu." />

          <CakeMenuTabs titles={cakeMenu.map((c) => c.title)}>
            {cakeMenu.map((cat) => (
              <FadeIn key={cat.id} className="h-full">
                <div className="h-full overflow-hidden rounded-[1.75rem] border border-[#f1d3df] bg-[#fffafc]">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={cat.image}
                      alt={`${cat.title} from ${bakery.name}`}
                      fill
                      quality={90}
                      // Hidden tabs on phones never trigger lazy loading, so the photo would pop in late.
                      loading="eager"
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 380px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3d1426]/75 via-[#3d1426]/10 to-transparent" />
                    <p className="absolute bottom-4 left-5 right-5 font-heading text-lg italic text-white">{cat.tagline}</p>
                  </div>
                  <div className="p-6 sm:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fbe4ec] text-[#b0537a]">
                      <CakeSlice className="h-5 w-5" />
                    </span>
                    <h3 className="font-heading text-2xl font-semibold tracking-tight text-[#3d1426]">{cat.title}</h3>
                  </div>
                  <ul className="space-y-1">
                    {cat.items.map((item) => (
                      <li
                        key={item.name}
                        className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-[#fbe4ec]/60"
                      >
                        {item.image && (
                          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md">
                            <Image src={item.image} alt="" fill className="object-cover" sizes="36px" />
                          </span>
                        )}
                        <span className="text-[15px] text-slate-800">{item.name}</span>
                        <span aria-hidden="true" className="mt-2 flex-1 border-b border-dotted border-[#e8b4c8]" />
                        <span className="font-semibold tabular-nums text-[#b0537a]">₹{item.price.toLocaleString("en-IN")}</span>
                        <CakeRowBasketControl itemId={cakeItemId(item.name)} />
                      </li>
                    ))}
                  </ul>
                  </div>
                </div>
              </FadeIn>
            ))}
          </CakeMenuTabs>

          <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#e8b4c8] bg-[#fffafc] px-6 py-5 text-center sm:flex-row sm:gap-8">
            {cakeNotes.map((n) => (
              <p key={n} className="flex items-center gap-2 font-heading text-lg italic text-[#5a1f38]">
                <Sparkles className="h-4 w-4 text-[#b0537a]" />
                {n}
              </p>
            ))}
          </div>
          <p className="mt-3 text-center text-sm text-slate-500">Tap <span className="font-semibold text-[#5a1f38]">Add</span> next to the cakes you want, then send your whole basket to Nitara on WhatsApp in one message.</p>
        </div>
      </section>

      <section id="brownies" className="scroll-mt-20 bg-[#fdf6f8] px-4 py-16 md:px-6 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <SectionTitle eyebrow="Rich · Premium · Homemade" title="Fudgy" accent="brownies." />

          <MobileCarousel label="Brownies" gridClassName="sm:grid-cols-2 xl:grid-cols-4">
            {brownies.map((b) => (
              <BrownieCard key={b.name} item={b} />
            ))}
          </MobileCarousel>

          <p className="mt-6 text-center text-sm text-slate-500">
            Pick a size, tap <span className="font-semibold text-[#5a1f38]">Add to basket</span> on each brownie you want,
            then send the whole order to Nitara in one WhatsApp message.
          </p>
        </div>
      </section>

      <BrownieSets />

      <section className="bg-white px-4 pb-16 md:px-6 md:pb-24">
        <div className="container mx-auto max-w-5xl">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[2.25rem] bg-[#fbe4ec] px-6 pb-10 pt-12 sm:px-10 md:px-14">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-4 bg-[radial-gradient(circle_at_12px_0,#ffffff_10px,transparent_11px)] bg-[length:24px_16px] bg-repeat-x"
              />
              <span aria-hidden="true" className="absolute -left-6 bottom-10 h-24 w-24 rounded-full bg-[#f6c9d8]/70" />
              <span aria-hidden="true" className="absolute -right-8 top-16 h-32 w-32 rounded-full bg-white/40" />

              <div className="relative text-center">
                <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b0537a] shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  Good to know
                </p>
                <h2 className="mt-4 font-heading text-3xl font-normal tracking-[-0.02em] text-[#3d1426] sm:text-4xl">
                  Before you <span className="italic text-[#b0537a]">order.</span>
                </h2>
              </div>

              <div className="relative mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5">
                {bakeryInfo.map((info, i) => {
                  const Icon = infoIcons[i];
                  return (
                    <div
                      key={info.title}
                      className={`group rounded-[1.75rem] bg-white p-6 text-center shadow-[0_18px_40px_-28px_rgba(90,31,56,0.55)] transition duration-300 hover:-translate-y-1 hover:rotate-0 ${
                        i === 0 ? "sm:-rotate-2" : i === 2 ? "sm:rotate-2" : ""
                      }`}
                    >
                      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3d1426] text-[#f3d6df] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                        <Icon className="h-6 w-6" strokeWidth={1.75} />
                      </span>
                      <p className="mt-4 font-heading text-xl font-semibold text-[#3d1426]">{info.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">{info.body}</p>
                    </div>
                  );
                })}
              </div>

              <p className="relative mt-10 text-center font-heading text-lg italic text-[#5a1f38]">
                Thank you for supporting our small business <span className="text-[#dd2a7b]">♥</span>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <StickyBasketBar tone="bakery" />
    </>
  );
}
