"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, PartyPopper, Wallet, Cake, Star, Sparkles, X, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { formatEventDate } from "@/lib/dates";
import { buttonVariants, cn } from "@damc/ui";
import type { CalendarEntry } from "@/lib/calendar";

const ICONS: Record<CalendarEntry["type"], LucideIcon> = {
  MEETING: Calendar,
  HOLIDAY: PartyPopper,
  DUES: Wallet,
  BIRTHDAY: Cake,
  OTHER: Star,
  EVENT: Sparkles,
};

function monthKey(date: Date) {
  return new Intl.DateTimeFormat("en-NG", { month: "long", year: "numeric" }).format(date);
}

export function CalendarList({ entries }: { entries: CalendarEntry[] }) {
  const [active, setActive] = React.useState<CalendarEntry | null>(null);

  const groups = React.useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    for (const entry of entries) {
      const key = monthKey(entry.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(entry);
    }
    return Array.from(map.entries());
  }, [entries]);

  if (entries.length === 0) {
    return <p className="text-center text-bronze dark:text-parchment/70">Nothing scheduled yet — check back soon.</p>;
  }

  return (
    <div className="space-y-10">
      {groups.map(([month, items]) => (
        <div key={month}>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
            {month}
          </h2>
          <ol className="divide-y divide-ink/8 dark:divide-parchment/10">
            {items.map((entry) => {
              const Icon = ICONS[entry.type];
              return (
                <li key={entry.id}>
                  <button
                    onClick={() => setActive(entry)}
                    className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-gold/5 dark:hover:bg-parchment/5"
                  >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep dark:bg-gold-bright/15 dark:text-gold-bright">
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display font-semibold text-ink dark:text-parchment">{entry.title}</span>
                      <span className="block text-xs text-bronze dark:text-parchment/60">{formatEventDate(entry.date)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      ))}

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-6"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md rounded-xl2 bg-white p-6 shadow-card dark:bg-ink-soft"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute right-4 top-4 text-bronze hover:text-ink dark:text-parchment/60 dark:hover:text-parchment"
              >
                <X size={20} />
              </button>
              <span className="text-xs font-bold uppercase tracking-wide text-gold-deep dark:text-gold-bright">
                {formatEventDate(active.date)}
              </span>
              <h3 className="mt-2 font-display text-xl font-semibold text-ink dark:text-parchment">{active.title}</h3>
              {active.description && (
                <p className="mt-3 text-sm leading-relaxed text-bronze dark:text-parchment/70">{active.description}</p>
              )}
              {active.href && (
                <Link href={active.href} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}>
                  Read more
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
