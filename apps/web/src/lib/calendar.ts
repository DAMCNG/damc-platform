import type { CalendarEvent } from "@damc/db";
import { withinNextDays, type Birthdayish } from "./dates";

export interface CalendarEntry {
  id: string;
  title: string;
  type: "MEETING" | "DUES" | "HOLIDAY" | "OTHER" | "BIRTHDAY" | "EVENT";
  date: Date;
  description: string | null;
  href?: string;
}

export interface EventDatedPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  eventDate: Date | null;
}

export function buildCalendarEntries<T extends Birthdayish & { id: string; firstName: string; lastName: string }>({
  events,
  members,
  posts = [],
  daysAhead = 180,
}: {
  events: CalendarEvent[];
  members: T[];
  posts?: EventDatedPost[];
  daysAhead?: number;
}): CalendarEntry[] {
  const eventEntries: CalendarEntry[] = events.map((e) => ({
    id: `event-${e.id}`,
    title: e.title,
    type: e.type,
    date: e.date,
    description: e.description,
  }));

  const today = new Date();
  const birthdayEntries: CalendarEntry[] = withinNextDays(members, daysAhead, today).map(({ member, daysUntil }) => {
    const date = new Date(today);
    date.setDate(date.getDate() + daysUntil);
    return {
      id: `birthday-${member.id}`,
      title: `${member.firstName} ${member.lastName}'s birthday`,
      type: "BIRTHDAY",
      date,
      description: null,
    };
  });

  const postEntries: CalendarEntry[] = posts
    .filter((p): p is EventDatedPost & { eventDate: Date } => p.eventDate != null)
    .map((p) => ({
      id: `post-${p.id}`,
      title: p.title,
      type: "EVENT",
      date: p.eventDate,
      description: p.excerpt,
      href: `/news/${p.slug}`,
    }));

  return [...eventEntries, ...birthdayEntries, ...postEntries].sort((a, b) => a.date.getTime() - b.date.getTime());
}
