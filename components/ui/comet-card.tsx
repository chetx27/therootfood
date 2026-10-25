"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function CometCard({
  rotateDepth = 18,
  translateDepth = 18,
  className,
  children,
}: {
  rotateDepth?: number;
  translateDepth?: number;
  className?: string;
  children: ReactNode;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20, mass: 0.3 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20, mass: 0.3 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`-${rotateDepth}deg`, `${rotateDepth}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`${rotateDepth}deg`, `-${rotateDepth}deg`]);

  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], [`-${translateDepth}px`, `${translateDepth}px`]);
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], [`${translateDepth}px`, `-${translateDepth}px`]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 12%, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0) 72%)`;

  return (
    <div className={cn("group relative isolate", className)}>
      <motion.div
        whileHover={{ scale: 1.03, rotateX: 0, rotateY: 0, y: -8, z: 20, transition: { duration: 0.2 } }}
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
          transformStyle: "preserve-3d",
          boxShadow:
            "rgba(15, 23, 42, 0.12) 0px 20px 45px, rgba(15, 23, 42, 0.08) 0px 8px 20px",
        }}
        onMouseMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const px = (event.clientX - bounds.left) / bounds.width - 0.5;
          const py = (event.clientY - bounds.top) / bounds.height - 0.5;
          x.set(px);
          y.set(py);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/80 backdrop-blur-sm"
      >
        {children}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[24px]"
          style={{ background: glareBackground, opacity: 0.7 }}
        />
      </motion.div>
    </div>
  );
}
