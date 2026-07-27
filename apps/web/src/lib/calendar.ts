import type { CalendarEvent } from "@damc/db";
import { withinNextDays, type Birthdayish } from "./dates";

export interface CalendarEntry {
  id: string;
  title: string;
  type: "MEETING" | "DUES" | "HOLIDAY" | "OTHER" | "BIRTHDAY";
  date: Date;
  description: string | null;
}

export function buildCalendarEntries<T extends Birthdayish & { id: string; firstName: string; lastName: string }>({
  events,
  members,
  daysAhead = 180,
}: {
  events: CalendarEvent[];
  members: T[];
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

  return [...eventEntries, ...birthdayEntries].sort((a, b) => a.date.getTime() - b.date.getTime());
}
