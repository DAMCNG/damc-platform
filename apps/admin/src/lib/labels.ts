import type { ExecutiveRole, PostCategory } from "@damc/db";

export const ROLE_ORDER: ExecutiveRole[] = [
  "PRESIDENT",
  "VICE_PRESIDENT",
  "SECRETARY",
  "SOCIAL_SECRETARY",
  "ASSISTANT_SECRETARY",
  "TREASURER",
  "FINANCIAL_SECRETARY",
  "ASSISTANT_FINANCIAL_SECRETARY",
  "CHIEF_PROVOST",
  "LEGAL_ADVISER",
  "WELFARE",
  "PRO",
  "ETHICS_AND_PRIVILEGES_COMMISSION",
];

export const ROLE_LABELS: Record<ExecutiveRole, string> = {
  PRESIDENT: "President",
  VICE_PRESIDENT: "Vice President",
  SECRETARY: "Secretary",
  SOCIAL_SECRETARY: "Social Secretary",
  ASSISTANT_SECRETARY: "Assistant Secretary",
  TREASURER: "Treasurer",
  FINANCIAL_SECRETARY: "Financial Secretary",
  ASSISTANT_FINANCIAL_SECRETARY: "Assistant Financial Secretary",
  CHIEF_PROVOST: "Chief Provost",
  LEGAL_ADVISER: "Legal Adviser",
  WELFARE: "Welfare",
  PRO: "PRO",
  ETHICS_AND_PRIVILEGES_COMMISSION: "Ethics and Privileges Commission",
};

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  NEWS: "News",
  ANNOUNCEMENT: "Announcement",
  EDITORIAL: "Editorial",
  NOTICE: "Notice",
  EVENTS: "Events",
};
