import type { AdminRole } from "@damc/db";
import "next-auth";
import "next-auth/jwt";

interface AdminSessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  role: AdminRole;
  canPublishContent: boolean;
  canViewEnquiries: boolean;
  canAssignEnquiries: boolean;
  canViewAnalytics: boolean;
}

declare module "next-auth" {
  interface Session {
    user: AdminSessionUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    adminUser?: AdminSessionUser;
  }
}
