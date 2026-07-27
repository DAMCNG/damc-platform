import "server-only";
import { auth } from "@/lib/auth";
import {
  canAssignEnquiries,
  canManageContent,
  canSeeEnquiries,
  isSuperAdmin,
  type AdminSession,
} from "@/lib/permissions";

async function requireSession(): Promise<AdminSession> {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated.");
  return session.user;
}

export async function requireContentPermission() {
  const user = await requireSession();
  if (!canManageContent(user)) throw new Error("You don't have permission to manage content.");
  return user;
}

export async function requireEnquiryViewPermission() {
  const user = await requireSession();
  if (!canSeeEnquiries(user)) throw new Error("You don't have permission to view enquiries.");
  return user;
}

export async function requireEnquiryAssignPermission() {
  const user = await requireSession();
  if (!canAssignEnquiries(user)) throw new Error("You don't have permission to assign enquiries.");
  return user;
}

export async function requireSuperAdmin() {
  const user = await requireSession();
  if (!isSuperAdmin(user)) throw new Error("Only Super Admins can do this.");
  return user;
}
