"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

export interface SquigglyTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  steps?: number;
  stepDuration?: number;
  scale?: number | [number, number];
  baseFrequency?: number;
  numOctaves?: number;
  as?: "span" | "div";
}

/**
 * Hand-drawn wobble via SVG displacement. The filter is costly, so it only runs on
 * large pointer devices, while on screen, and steps the filter without React re-renders.
 */
export function SquigglyText({
  children,
  steps = 5,
  stepDuration = 80,
  scale = [6, 8],
  baseFrequency = 0.02,
  numOctaves = 2,
  as = "span",
  className,
  style,
}: SquigglyTextProps) {
  const reactId = useId();
  const safeId = reactId.replace(/[:_]/g, "");
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const capable =
      window.matchMedia("(hover: hover) and (min-width: 1024px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!capable) return;

    let step = 0;
    let timer: number | undefined;
    const tick = () => {
      step = (step + 1) % steps;
      el.style.filter = `url(#squiggly-${safeId}-${step})`;
    };
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (entry.isIntersecting) timer = window.setInterval(tick, stepDuration);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [safeId, stepDuration, steps]);

  const filters = useMemo(
    () =>
      Array.from({ length: steps }, (_, i) => (
        <filter id={`squiggly-${safeId}-${i}`} key={i}>
          <feTurbulence baseFrequency={baseFrequency} numOctaves={numOctaves} seed={i} result="noise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={Array.isArray(scale) ? scale[i % scale.length] : scale}
          />
        </filter>
      )),
    [baseFrequency, numOctaves, scale, steps, safeId],
  );

  const Tag = as;

  return (
    <Tag
      ref={ref as React.RefObject<HTMLSpanElement & HTMLDivElement>}
      style={style}
      className={cn("relative inline-block", className)}
    >
      <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg">
        <defs>{filters}</defs>
      </svg>
      {children}
    </Tag>
  );
}
