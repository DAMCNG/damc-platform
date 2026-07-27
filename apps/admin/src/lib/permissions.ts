import type { Session } from "next-auth";

export type AdminSession = Session["user"];

export function isSuperAdmin(user: AdminSession) {
  return user.role === "SUPER_ADMIN";
}

export function canManageContent(user: AdminSession) {
  return isSuperAdmin(user) || user.canPublishContent;
}

export function canSeeEnquiries(user: AdminSession) {
  return isSuperAdmin(user) || user.canViewEnquiries;
}

export function canAssignEnquiries(user: AdminSession) {
  return isSuperAdmin(user) || user.canAssignEnquiries;
}

export function canSeeAnalytics(user: AdminSession) {
  return isSuperAdmin(user) || user.canViewAnalytics;
}
