"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";
import { FloatingElement } from "@/components/shared/floating-element";

interface InteractiveFloatProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  amplitude?: number;
  sway?: number;
  rotate?: number;
}

/**
 * Gentle float + pointer-tilt — small produce accents that feel 3D / interactive.
 */
export function InteractiveFloat({
  children,
  className,
  duration = 6.5,
  delay = 0,
  amplitude = 12,
  sway = 6,
  rotate = 4,
}: InteractiveFloatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const springX = useSpring(x, { stiffness: 140, damping: 18 });
  const springY = useSpring(y, { stiffness: 140, damping: 18 });
  const rotateX = useTransform(springY, [0, 1], [10, -10]);
  const rotateY = useTransform(springX, [0, 1], [-12, 12]);

  function handlePointerMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  const inner = reduceMotion ? (
    <div className="h-full w-full">{children}</div>
  ) : (
    <div style={{ perspective: 900 }} className="h-full w-full">
      <motion.div
        ref={ref}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="h-full w-full cursor-grab active:cursor-grabbing"
      >
        {children}
      </motion.div>
    </div>
  );

  return (
    <FloatingElement
      className={cn("z-10", className)}
      duration={duration}
      delay={delay}
      amplitude={amplitude}
      sway={sway}
      rotate={rotate}
    >
      {inner}
    </FloatingElement>
  );
}
