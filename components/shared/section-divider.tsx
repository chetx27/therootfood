"use client";

import { cn } from "@/lib/utils";
import { FloatingElement } from "@/components/shared/floating-element";
import { SquigglyText } from "@/components/ui/squiggly-text";

/**
 * Brand seal between Bulk → Contact.
 * Custom farm-sprout mark + pink blotch — not a line, not a logo disc.
 */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-white py-10 md:py-14",
        className
      )}
    >
      {/* Soft brand atmosphere under the seal */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-24 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(232,180,200,0.28),transparent_70%)]" />

      <FloatingElement duration={6.5} amplitude={6} sway={4} rotate={2}>
        <div className="relative flex flex-col items-center gap-3">
          {/* Pink organic blotch — same language as highlight-block headlines */}
          <div className="relative">
            <span
              className="absolute left-1/2 top-1/2 h-[4.75rem] w-[5.5rem] -translate-x-1/2 -translate-y-1/2 rounded-[42%_58%_48%_52%/55%_42%_58%_45%] bg-primary md:h-[5.25rem] md:w-[6.25rem]"
            />
            <span
              className="absolute left-1/2 top-1/2 h-[3.5rem] w-[4rem] -translate-x-[42%] -translate-y-[55%] rounded-[50%_50%_45%_55%/48%_52%_48%_52%] bg-primary/55 blur-[1px] md:h-16 md:w-[4.5rem]"
            />

            {/* Hand-drawn farm sprout (logo DNA, not the raster mark) */}
            <svg
              viewBox="0 0 64 72"
              className="relative z-10 h-14 w-12 text-forest md:h-16 md:w-14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Soil mound */}
              <path
                d="M10 54c4-7 12-11 22-11s18 4 22 11c-3 5-12 8-22 8s-19-3-22-8Z"
                fill="currentColor"
                fillOpacity="0.14"
              />
              <path
                d="M14 53.5c3.5-4.5 10-7 18-7s14.5 2.5 18 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M18 56.5c2.5-2.2 7-3.5 14-3.5s11.5 1.3 14 3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.55"
              />

              {/* Stem */}
              <path
                d="M32 52V22"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Left leaf */}
              <path
                d="M32 34c-7-1-12-6-13-12 7 0 12 4 13 12Z"
                fill="currentColor"
              />
              {/* Right leaf outline */}
              <path
                d="M32 30c6-2 11-7 12-13-7 1-11 6-12 13Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              {/* Tiny fork tip — food cue */}
              <path
                d="M40 24v10M37.5 24v5.5M42.5 24v5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Cake crumb / berry */}
              <circle cx="36" cy="42" r="2.2" fill="currentColor" opacity="0.35" />
            </svg>
          </div>

          <SquigglyText
            className="font-heading font-semibold text-sm tracking-[0.35em] text-forest/80 md:text-base md:tracking-[0.4em]"
            scale={[3, 5]}
            stepDuration={110}
          >
            root to table
          </SquigglyText>
        </div>
      </FloatingElement>
    </div>
  );
}
