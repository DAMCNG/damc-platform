"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn, buttonVariants, BrandMark, ThemeToggle } from "@damc/ui";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/executives", label: "Executives" },
  { href: "/members", label: "Members" },
  { href: "/directory", label: "Directory" },
  { href: "/news", label: "News" },
  { href: "/roster", label: "Roster" },
  { href: "/achievements", label: "Achievements" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-parchment-paper/90 shadow-sm backdrop-blur-md dark:bg-ink/90"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-3.5 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink transition-transform duration-300 hover:scale-[1.02] dark:text-parchment"
        >
          <BrandMark size={44} className="flex-shrink-0" />
          <span className="hidden sm:flex sm:flex-col sm:leading-tight">
            <span className="text-gold-deep dark:text-gold-bright">DAMC</span>
            <span className="text-[10px] font-normal tracking-wide text-bronze">
              Dignified Articulate Men&rsquo;s Club
            </span>
          </span>
        </Link>

        <ul className="hidden items-center justify-center gap-5 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "group relative py-1 text-[13px] font-semibold uppercase tracking-wide text-ink/70 transition-colors hover:text-gold-deep dark:text-parchment/70 dark:hover:text-gold-bright",
                    active && "text-gold-deep dark:text-gold-bright"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-gold-deep transition-transform duration-300 ease-out group-hover:scale-x-100 dark:bg-gold-bright",
                      active && "scale-x-100"
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center lg:flex">
          <ThemeToggle className="mr-4" />
          <span className="mr-4 h-6 w-px bg-ink/10 dark:bg-parchment/15" aria-hidden="true" />
          <Link
            href="/contact"
            className={cn(buttonVariants({ size: "sm" }), "shadow-sm transition-shadow hover:shadow-md")}
          >
            Enquire to join
          </Link>
        </div>

        <div className="col-start-3 flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-full p-2 text-ink hover:bg-ink/5 dark:text-parchment dark:hover:bg-parchment/10"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-ink/10 bg-parchment-paper dark:border-parchment/10 dark:bg-ink lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-gold/10 dark:text-parchment"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href="/contact" className={cn(buttonVariants(), "w-full")}>
                  Enquire to join
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
