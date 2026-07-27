import type { CalendarEvent, Post } from "@damc/db";
import { formatEventDate } from "./dates";

export interface TickerItem {
  id: string;
  type: "MEETING" | "DUES" | "HOLIDAY" | "OTHER" | "BIRTHDAY" | "NOTICE";
  label: string;
  href: string;
}

export function buildTickerItems({
  events,
  notices,
  birthdays,
}: {
  events: CalendarEvent[];
  notices: Post[];
  birthdays: { member: { id: string; firstName: string; lastName: string } }[];
}): TickerItem[] {
  const eventItems: TickerItem[] = events.map((e) => ({
    id: `event-${e.id}`,
    type: e.type,
    label: `${e.title} — ${formatEventDate(e.date)}`,
    href: "/news",
  }));

  const noticeItems: TickerItem[] = notices.map((p) => ({
    id: `notice-${p.id}`,
    type: "NOTICE",
    label: p.title,
    href: `/news/${p.slug}`,
  }));

  const birthdayItems: TickerItem[] = birthdays.map(({ member }) => ({
    id: `birthday-${member.id}`,
    type: "BIRTHDAY",
    label: `${member.firstName} ${member.lastName}'s birthday`,
    href: "/members",
  }));

  return [...eventItems, ...noticeItems, ...birthdayItems];
}
