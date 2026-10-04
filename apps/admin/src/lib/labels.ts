import type { PostCategory } from "@damc/db";

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  NEWS: "News",
  ANNOUNCEMENT: "Announcement",
  EDITORIAL: "Editorial",
  NOTICE: "Notice",
  EVENTS: "Events",
};

export function formatArticulateNumber(value: string | null | undefined): string {
  if (!value) return "";
  const trimmed = value.trim();
  const match = trimmed.match(/^art\.?\s*(.*)$/i);
  if (match) {
    return `Art. ${match[1].trim()}`;
  }
  const noMatch = trimmed.match(/^no\.?:?\s*(.*)$/i);
  if (noMatch) {
    return `Art. ${noMatch[1].trim()}`;
  }
  return `Art. ${trimmed}`;
}

