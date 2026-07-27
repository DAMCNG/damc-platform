"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { optimizedImageUrl } from "@/lib/cloudinary";

export interface HeroSlideData {
  id: string;
  imageUrl: string;
  caption: string | null;
}

export function HeroCarousel({ slides }: { slides: HeroSlideData[] }) {
  const [index, setIndex] = React.useState(0);
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (slides.length < 2 || shouldReduceMotion) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length, shouldReduceMotion]);

  if (slides.length === 0) return null;

  const active = slides[index]!;
  // Preload the slide that's coming up next so its crossfade doesn't stall on a fresh fetch.
  const next = slides.length > 1 ? slides[(index + 1) % slides.length]! : null;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence mode="sync">
        <motion.img
          key={active.id}
          src={optimizedImageUrl(active.imageUrl, 1920)}
          alt=""
          // The first slide is almost always this page's Largest Contentful Paint element.
          fetchPriority={index === 0 ? "high" : "auto"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-parchment-paper/85 via-parchment-paper/70 to-parchment-paper dark:from-ink/85 dark:via-ink/75 dark:to-ink" />
      {next && <link rel="preload" as="image" href={optimizedImageUrl(next.imageUrl, 1920)} />}
    </div>
  );
}
