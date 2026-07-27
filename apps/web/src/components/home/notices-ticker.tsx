"use client";

import Link from "next/link";
import { Calendar, Wallet, PartyPopper, Cake, Megaphone, Star, type LucideIcon } from "lucide-react";
import { AutoScrollRow } from "@damc/ui";
import type { TickerItem } from "@/lib/ticker";

const ICONS: Record<TickerItem["type"], LucideIcon> = {
  MEETING: Calendar,
  DUES: Wallet,
  HOLIDAY: PartyPopper,
  BIRTHDAY: Cake,
  NOTICE: Megaphone,
  OTHER: Star,
};

export function NoticesTicker({ items }: { items: TickerItem[] }) {
  if (items.length === 0) return null;

  return (
    <AutoScrollRow ariaLabel="Upcoming notices and events" pxPerSecond={22} gapClassName="gap-3">
      {items.map((item) => {
        const Icon = ICONS[item.type];
        return (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-xs font-semibold text-ink backdrop-blur-sm transition-colors hover:border-gold-deep hover:text-gold-deep dark:border-parchment/15 dark:bg-ink-soft/40 dark:text-parchment dark:hover:text-gold-bright"
          >
            <Icon size={13} className="text-gold-deep dark:text-gold-bright" />
            {item.label}
          </Link>
        );
      })}
    </AutoScrollRow>
  );
}
