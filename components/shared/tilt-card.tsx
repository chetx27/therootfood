"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt angle in degrees. */
  maxTilt?: number;
  /** Soft light that follows the cursor. */
  glare?: boolean;
}

const spring = { stiffness: 400, damping: 32, mass: 0.5 };

/**
 * 3D perspective tilt that follows the pointer. Inert on touch devices and with reduced motion.
 * Avoid backdrop-filter inside — it forces a full repaint every frame while rotating.
 */
export function TiltCard({ children, className, maxTilt = 7, glare = false }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);
  const rotateX = useTransform(springY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [0, 1], [-maxTilt, maxTilt]);
  const glareX = useTransform(springX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(springY, [0, 1], ["0%", "100%"]);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.18), transparent 55%)`;

  function handlePointerEnter(e: React.PointerEvent) {
    if (e.pointerType === "mouse") rect.current = ref.current?.getBoundingClientRect() ?? null;
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const r = rect.current ?? ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  }

  function handlePointerLeave() {
    rect.current = null;
    x.set(0.5);
    y.set(0.5);
  }

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div style={{ perspective: 900 }} className={cn(className)}>
      <motion.div
        ref={ref}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX, rotateY }}
        className="relative h-full w-full will-change-transform"
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden="true"
            style={{ background: glareBg }}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
          />
        )}
      </motion.div>
    </div>
  );
}
