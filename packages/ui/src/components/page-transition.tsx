"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // AnimatePresence keeps the outgoing page mounted (full height) during its
  // exit animation, which swallows Next's own scroll-to-top-on-navigate -
  // the new page just inherits whatever offset the old, often taller, page
  // had, clamped to its own height. Restore it ourselves, but only for
  // forward navigation (clicking a link): a back/forward navigation (via the
  // browser's own buttons, or router.back()) fires a native `popstate` event
  // first, and that case should keep the browser's own scroll-restoration
  // for that history entry instead of snapping to the top.
  const isPopNavigation = React.useRef(false);

  React.useEffect(() => {
    function handlePopState() {
      isPopNavigation.current = true;
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  React.useEffect(() => {
    if (isPopNavigation.current) {
      isPopNavigation.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  // shouldReduceMotion only reflects the real OS preference once mounted on
  // the client (the server always renders its false/default value, since
  // there's no window to read prefers-reduced-motion from). Branching the
  // tree shape on it - e.g. returning bare `children` instead of the
  // motion.div wrapper - renders something structurally different from what
  // the server sent, which is a hydration mismatch for anyone whose OS has
  // reduced motion on. Keep the same wrapper either way and just collapse
  // the transition to instant, so the DOM shape never depends on this value.
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.99 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
