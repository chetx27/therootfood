"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileCarouselProps {
  children: ReactNode;
  /** Grid classes applied from `sm` up, e.g. "sm:grid-cols-2 lg:grid-cols-4". */
  gridClassName: string;
  /** Width of each slide on phones. */
  slideClassName?: string;
  tone?: "light" | "dark";
  label: string;
  autoPlayMs?: number;
}

export function MobileCarousel({
  children,
  gridClassName,
  slideClassName = "w-[82%]",
  tone = "light",
  label,
  autoPlayMs = 4500,
}: MobileCarouselProps) {
  const items = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const pausedUntil = useRef(0);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    slides.forEach((s, i) => {
      if (Math.abs(s.offsetLeft + s.offsetWidth / 2 - center) < Math.abs(slides[best].offsetLeft + slides[best].offsetWidth / 2 - center)) best = i;
    });
    setIndex(best);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 });
    io.observe(track);
    const pause = () => (pausedUntil.current = Date.now() + 8000);
    track.addEventListener("pointerdown", pause, { passive: true });
    track.addEventListener("touchstart", pause, { passive: true });
    return () => {
      io.disconnect();
      track.removeEventListener("pointerdown", pause);
      track.removeEventListener("touchstart", pause);
    };
  }, []);

  const indexRef = useRef(0);
  indexRef.current = index;

  useEffect(() => {
    if (!autoPlayMs || !inView || items.length < 2) return;
    if (!window.matchMedia("(max-width: 639px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      if (Date.now() < pausedUntil.current) return;
      const next = indexRef.current + 1;
      go(next >= items.length ? 0 : next);
    }, autoPlayMs);
    return () => window.clearInterval(t);
  }, [autoPlayMs, inView, items.length]);

  function go(to: number) {
    const track = trackRef.current;
    const slide = track?.children[to] as HTMLElement | undefined;
    if (!track || !slide) return;
    track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2, behavior: "smooth" });
  }

  const dark = tone === "dark";
  const arrow = cn(
    "flex h-9 w-9 items-center justify-center rounded-full transition disabled:opacity-30",
    dark ? "bg-white/10 text-white ring-1 ring-white/20" : "bg-white text-[#3d1426] ring-1 ring-[#f1d3df] shadow-sm",
  );

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={trackRef}
        className={cn(
          "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "sm:mx-0 sm:grid sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0",
          gridClassName,
        )}
      >
        {items.map((child, i) => (
          <div key={i} className={cn("shrink-0 snap-center sm:w-auto", slideClassName)}>
            {child}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-4 sm:hidden">
        <button type="button" className={arrow} onClick={() => { pausedUntil.current = Date.now() + 8000; go(index - 1); }} disabled={index === 0} aria-label="Previous">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { pausedUntil.current = Date.now() + 8000; go(i); }}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? (dark ? "w-5 bg-[#f3d6df]" : "w-5 bg-[#3d1426]") : dark ? "w-1.5 bg-white/30" : "w-1.5 bg-[#e8b4c8]",
              )}
            />
          ))}
        </div>
        <button type="button" className={arrow} onClick={() => { pausedUntil.current = Date.now() + 8000; go(index + 1); }} disabled={index === items.length - 1} aria-label="Next">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
