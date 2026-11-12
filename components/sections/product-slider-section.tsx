"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { products } from "@/data/products";
import { formatMoney, type CurrencyOption } from "@/lib/currency";
import { useCurrency } from "@/lib/use-currency";
import { cn } from "@/lib/utils";

/** One-liners for the showcase; images, names, and prices come from the product listing. */
const stories: Record<string, string> = {
  "ragi-flour":
    "Finger millet ground slowly on stone. Naturally gluten free, with plenty of calcium and iron. Good for rotis, dosas and porridge.",
  "vetiver-powder":
    "Vetiver root, dried and ground fine. People stir it into cooling summer drinks and mix it into face packs and bath powders.",
  "vetiver-roots":
    "Whole dried vetiver roots with a clean, earthy smell. Drop a bundle into your drinking water pot or use them for sherbet.",
  "country-eggs":
    "Laid by country hens that roam the farm all day. The yolks are a deeper colour and they taste the way eggs should.",
  "goat-meat":
    "Raised on open pasture with no hormones and no antibiotics. Cut fresh on the day we deliver, in the cut you ask for.",
  "country-chicken":
    "Slow grown country chicken. The meat is firmer and has far more flavour than a broiler.",
  "goat-milk-soap":
    "Cold process soap made by hand with fresh goat milk. Gentle on skin, with no harsh chemicals.",
};

function priceLabel(product: (typeof products)[number], currency: CurrencyOption): string {
  if (product.priceType === "fixed" && product.price) {
    return `${formatMoney(product.price, currency)} ${product.unit ?? ""}`.trim();
  }
  if (product.priceType === "custom-form") return "Custom pricing";
  return "Price on request";
}

const AUTOPLAY_MS = 5000;

export function ProductSliderSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const { currency } = useCurrency();
  const count = products.length;

  const go = useCallback((delta: number) => setActiveSlide((c) => (c + delta + count) % count), [count]);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [isPaused, activeSlide, go]);

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  }

  return (
    <section className="relative overflow-hidden py-20 md:py-28 text-white" aria-label="Featured products">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 15% 20%, rgba(232,180,200,0.22), transparent 55%),
            radial-gradient(ellipse 70% 50% at 85% 15%, rgba(93,170,120,0.3), transparent 50%),
            linear-gradient(160deg, #1a3d2e 0%, #0f281e 45%, #1e4a35 100%)
          `,
        }}
      />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-primary">The harvest</p>
          <h2 className="font-heading font-semibold text-4xl leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Straight from <span className="highlight-block">the farm</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/70">
            Grown, ground and raised on the farm. Swipe through what we have right now.
          </p>
        </div>

        <div
          className="relative mx-auto max-w-6xl"
          role="region"
          aria-roledescription="carousel"
          tabIndex={0}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
            setIsPaused(true);
          }}
          onTouchEnd={(e) => {
            handleTouchEnd(e);
            setIsPaused(false);
          }}
        >
          <div className="relative grid overflow-hidden rounded-[2rem] border border-white/15 bg-[#163528] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.55)] sm:rounded-[2.5rem]">
            {products.map((product, index) => {
              const active = index === activeSlide;
              return (
                <div
                  key={product.id}
                  aria-hidden={!active}
                  className={cn(
                    "col-start-1 row-start-1 grid grid-cols-1 sm:min-h-[420px] items-stretch transition-opacity duration-500 ease-out md:grid-cols-2",
                    active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
                  )}
                >
                  <div className="relative h-44 overflow-hidden sm:h-80 md:h-auto">
                    <Image
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      fill
                      className={cn(
                        "object-cover transition-transform duration-[1200ms] ease-out",
                        active ? "scale-100" : "scale-105"
                      )}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index < 2}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f281e]/50 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0f281e]/25" />
                  </div>

                  <div
                    className={cn(
                      "flex flex-col justify-center gap-3 p-5 pb-6 text-left sm:gap-6 transition-all duration-500 ease-out sm:p-10 md:p-12",
                      active ? "translate-y-0 opacity-100 delay-100" : "translate-y-3 opacity-0"
                    )}
                  >
                    <span className="inline-flex self-start rounded-full border border-primary/40 bg-primary/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary sm:px-4 sm:py-1.5 sm:text-xs">
                      {priceLabel(product, currency)}
                    </span>
                    <h3 className="font-heading text-2xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl">
                      {product.name}
                    </h3>
                    <p className="line-clamp-3 max-w-md text-sm leading-relaxed text-white/75 sm:line-clamp-none sm:text-base">{stories[product.id]}</p>
                    <Link
                      href={product.priceType === "custom-form" ? "/cakes" : "/order"}
                      tabIndex={active ? 0 : -1}
                      className="inline-flex min-h-[40px] items-center justify-center self-start rounded-full bg-primary px-5 sm:min-h-[44px] sm:px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
                    >
                      {product.priceType === "custom-form" ? "Design your cake" : "Order now"}
                    </Link>
                  </div>
                </div>
              );
            })}

            <div className="absolute inset-x-0 bottom-0 z-20 h-1 bg-white/10">
              <div
                key={`${activeSlide}-${isPaused}`}
                className="h-full origin-left bg-primary"
                style={{
                  animation: isPaused ? "none" : `slider-progress ${AUTOPLAY_MS}ms linear forwards`,
                  transform: isPaused ? "scaleX(0)" : undefined,
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white shadow-lg transition hover:scale-105 hover:bg-primary hover:text-primary-foreground sm:-left-5 sm:flex"
            aria-label="Previous product"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white shadow-lg transition hover:scale-105 hover:bg-primary hover:text-primary-foreground sm:-right-5 sm:flex"
            aria-label="Next product"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 sm:mt-7">
            <button
              type="button"
              onClick={() => go(-1)}
              className="mr-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white sm:hidden"
              aria-label="Previous product"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {products.map((p, index) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 sm:h-2.5",
                  index === activeSlide ? "w-6 bg-primary sm:w-8" : "w-2 bg-white/30 hover:bg-white/55 sm:w-2.5"
                )}
                aria-label={`Show ${p.name}`}
                aria-current={index === activeSlide}
              />
            ))}
            <button
              type="button"
              onClick={() => go(1)}
              className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white sm:hidden"
              aria-label="Next product"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
