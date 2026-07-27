const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatMonthDay(month: number, day: number) {
  return `${MONTH_NAMES[month - 1]} ${day}`;
}

export function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

/** Days from today until the next occurrence of this month/day (0 = today, wraps to next year). */
export function daysUntilAnnual(month: number, day: number, from: Date = new Date()) {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  let next = new Date(from.getFullYear(), month - 1, day);
  if (next < today) next = new Date(from.getFullYear() + 1, month - 1, day);
  return Math.round((next.getTime() - today.getTime()) / 86_400_000);
}

export interface Birthdayish {
  birthMonth: number | null;
  birthDay: number | null;
}

export function withinNextDays<T extends Birthdayish>(members: T[], days: number, from: Date = new Date()) {
  return members
    .filter((m): m is T & { birthMonth: number; birthDay: number } => m.birthMonth != null && m.birthDay != null)
    .map((m) => ({ member: m, daysUntil: daysUntilAnnual(m.birthMonth, m.birthDay, from) }))
    .filter((m) => m.daysUntil <= days)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}
