"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type FadeInProps = HTMLMotionProps<"div"> & {
  /** Seconds to wait before animating in. */
  delay?: number;
  /** Initial vertical offset in px (positive = rises up). */
  y?: number;
  /** Seconds the entrance takes. */
  duration?: number;
};

/**
 * Single-element entrance: fade + subtle rise. Drop-in replacement for the
 * ad-hoc `animate-rise` utility. Honors `prefers-reduced-motion`.
 */
export function FadeIn({
  delay = 0,
  y = 12,
  duration = 0.4,
  className,
  children,
  ...props
}: FadeInProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
