import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.adminUser = {
          id: user.id as string,
          name: user.name as string,
          email: user.email as string,
          emailVerified: null,
          role: (user as { role: "SUPER_ADMIN" | "CONTENT_MANAGER" }).role,
          canPublishContent: (user as { canPublishContent: boolean }).canPublishContent,
          canViewEnquiries: (user as { canViewEnquiries: boolean }).canViewEnquiries,
          canAssignEnquiries: (user as { canAssignEnquiries: boolean }).canAssignEnquiries,
          canViewAnalytics: (user as { canViewAnalytics: boolean }).canViewAnalytics,
        };
      }
      return token;
    },
    session({ session, token }) {
      if (token.adminUser) session.user = token.adminUser;
      return session;
    },
  },
} satisfies NextAuthConfig;
