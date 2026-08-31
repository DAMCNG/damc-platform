"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  // shouldReduceMotion only reflects the real OS preference once mounted on
  // the client (the server always renders its false/default value, since
  // there's no window to read prefers-reduced-motion from). `initial` is
  // baked into the SSR'd inline style, so varying its y/scale on this value
  // - even without branching the returned tree shape - still mismatched the
  // server output for anyone with reduced motion on. Same root cause as
  // PageTransition: keep initial/whileInView constant and only collapse the
  // transition to instant, so the SSR'd style never depends on this value.
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.7,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
