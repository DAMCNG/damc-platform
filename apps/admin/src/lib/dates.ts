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

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
