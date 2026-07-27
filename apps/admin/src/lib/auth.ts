import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@damc/db";
import { authConfig } from "./auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const admin = await prisma.adminUser.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });
        if (!admin || admin.status !== "ACTIVE") return null;

        const passwordValid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
        if (!passwordValid) return null;

        await prisma.adminUser.update({
          where: { id: admin.id },
          data: { lastActiveAt: new Date() },
        });

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          emailVerified: null,
          role: admin.role,
          canPublishContent: admin.canPublishContent,
          canViewEnquiries: admin.canViewEnquiries,
          canAssignEnquiries: admin.canAssignEnquiries,
          canViewAnalytics: admin.canViewAnalytics,
        };
      },
    }),
  ],
});
