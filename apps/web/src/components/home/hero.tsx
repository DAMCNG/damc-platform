"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container, Reveal, buttonVariants, BrandMark, cn } from "@damc/ui";
import { NoticesTicker } from "./notices-ticker";
import { HeroCarousel, type HeroSlideData } from "./hero-carousel";
import { useHeroLogo } from "@/components/hero-logo-context";
import type { TickerItem } from "@/lib/ticker";

export function Hero({
  heading,
  subheading,
  ctaLabel,
  tickerItems,
  slides,
}: {
  heading: string;
  subheading: string;
  ctaLabel: string;
  tickerItems: TickerItem[];
  slides: HeroSlideData[];
}) {
  const { heroLogoVisible, setHeroLogoVisible } = useHeroLogo();
  const shouldReduceMotion = useReducedMotion();
  const logoRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    // -80px top margin accounts for the sticky header's height, so the swap
    // happens right as the hero logo would otherwise disappear behind it.
    const observer = new IntersectionObserver(
      ([entry]) => setHeroLogoVisible(entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [setHeroLogoVisible]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-parchment to-parchment-paper dark:from-ink dark:to-ink">
      {slides.length > 0 ? (
        <HeroCarousel slides={slides} />
      ) : (
        <div
          aria-hidden
          className="animate-pulse-glow absolute left-1/2 top-0 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gold/20 blur-3xl dark:bg-gold-bright/10"
        />
      )}
      <Container className="relative py-14 text-center sm:py-20">
        <Reveal>
          <div ref={logoRef} className="mx-auto mb-5 h-[150px] w-[150px]">
            {heroLogoVisible && (
              <motion.div
                layoutId="brand-logo"
                transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28 }}
              >
                <BrandMark size={150} />
              </motion.div>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="text-balance font-display text-3xl font-semibold leading-tight text-ink dark:text-parchment sm:text-5xl">
            {heading}
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-bronze dark:text-parchment/70 sm:text-xl">
            {subheading}
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className={buttonVariants({ size: "lg" })}>
              {ctaLabel}
            </Link>
            <Link href="/about" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              Learn about us
            </Link>
          </div>
        </Reveal>
      </Container>

      {tickerItems.length > 0 && (
        <Reveal delay={0.4}>
          <div className="relative border-t border-ink/8 py-4 dark:border-parchment/10">
            <NoticesTicker items={tickerItems} />
          </div>
        </Reveal>
      )}
    </section>
  );
}
