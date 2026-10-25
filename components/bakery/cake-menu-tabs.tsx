"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ROTATE_MS = 5000;

export function CakeMenuTabs({ titles, children }: { titles: string[]; children: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const pausedUntil = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const count = titles.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (!window.matchMedia("(max-width: 1023px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      if (Date.now() < pausedUntil.current) return;
      setActive((i) => (i + 1) % count);
    }, ROTATE_MS);
    return () => window.clearInterval(t);
  }, [inView, count]);

  function select(i: number) {
    pausedUntil.current = Date.now() + 10000;
    setActive((i + count) % count);
  }

  const arrow =
    "flex h-9 w-9 shrink-0 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#e8b4c8] bg-white text-[#5a1f38] shadow-[0_8px_20px_-12px_rgba(90,31,56,0.6)] transition hover:bg-[#3d1426] hover:text-white active:scale-95";

  return (
    <div ref={ref} onPointerDown={() => (pausedUntil.current = Date.now() + 10000)}>
      <div className="mb-6 lg:hidden">
        <div className="flex items-center justify-center gap-1.5 sm:gap-3">
          <button type="button" className={arrow} onClick={() => select(active - 1)} aria-label="Previous category">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex rounded-full bg-[#fbe4ec]/70 p-1" role="tablist" aria-label="Cake categories">
            {titles.map((t, i) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => select(i)}
                className={cn(
                  "relative overflow-hidden rounded-full px-2.5 py-2 text-[13px] font-medium transition min-[380px]:px-3.5 min-[380px]:text-sm sm:px-5",
                  i === active ? "bg-[#3d1426] text-white shadow" : "text-[#5a1f38]",
                )}
              >
                {t.split(" ")[0]}
                {i === active && inView && (
                  <span
                    key={`${active}-bar`}
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-[2px] bg-[#f3d6df]"
                    style={{ animation: `slider-progress ${ROTATE_MS}ms linear forwards`, width: "100%", transformOrigin: "left" }}
                  />
                )}
              </button>
            ))}
          </div>
          <button type="button" className={arrow} onClick={() => select(active + 1)} aria-label="Next category">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {children.map((child, i) => (
          <div
            key={titles[i]}
            className={cn(
              "mx-auto w-full max-w-2xl lg:max-w-none",
              i === active ? "animate-in fade-in duration-500" : "hidden lg:block",
            )}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
