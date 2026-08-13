import type { MaritalStatus, PostCategory } from "@damc/db";

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  NEWS: "News",
  ANNOUNCEMENT: "Announcement",
  EDITORIAL: "Editorial",
  NOTICE: "Notice",
  EVENTS: "Events",
};

export const MARITAL_STATUS_LABELS: Record<MaritalStatus, string> = {
  SINGLE: "Single",
  MARRIED: "Married",
  DIVORCED: "Divorced",
  WIDOWED: "Widowed",
};
