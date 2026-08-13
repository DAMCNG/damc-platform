import type { Post } from "@damc/db";
import { formatEventDate } from "./dates";
import type { CalendarEntry } from "./calendar";

export interface TickerItem {
  id: string;
  type: "MEETING" | "DUES" | "HOLIDAY" | "OTHER" | "BIRTHDAY" | "EVENT" | "NOTICE";
  label: string;
  href: string;
}

export function buildTickerItems({
  entries,
  notices,
}: {
  entries: CalendarEntry[];
  notices: Post[];
}): TickerItem[] {
  const entryItems: TickerItem[] = entries.map((e) => ({
    id: e.id,
    type: e.type,
    label: `${e.title} · ${formatEventDate(e.date)}`,
    href: e.href ?? "/news",
  }));

  const noticeItems: TickerItem[] = notices.map((p) => ({
    id: `notice-${p.id}`,
    type: "NOTICE",
    label: p.title,
    href: `/news/${p.slug}`,
  }));

  return [...entryItems, ...noticeItems];
}
