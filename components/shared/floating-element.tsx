import { type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  /** Vertical float distance in px. */
  amplitude?: number;
  /** Horizontal sway distance in px. */
  sway?: number;
  /** Seconds for one full float cycle. */
  duration?: number;
  /** Stagger the animation start. */
  delay?: number;
  /** Max rotation in degrees while floating. */
  rotate?: number;
}

/**
 * Gently levitates its children. Pure CSS (runs on the compositor, no per-frame JS);
 * the keyframes in globals.css honour prefers-reduced-motion.
 */
export function FloatingElement({
  children,
  className,
  amplitude = 14,
  sway = 0,
  duration = 5,
  delay = 0,
  rotate = 3,
}: FloatingElementProps) {
  const style = {
    "--float-amp": `${-amplitude}px`,
    "--float-sway": `${sway}px`,
    "--float-rot": `${rotate}deg`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  } as CSSProperties;

  return (
    <div className={cn("float-element", className)} style={style}>
      {children}
    </div>
  );
}
