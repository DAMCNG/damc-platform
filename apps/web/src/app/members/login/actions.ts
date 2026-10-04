"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@damc/db";
import {
  createMemberSession,
  destroyMemberSession,
  getMemberSession,
  type MemberSessionData,
} from "@/lib/member-session";

export interface LoginResult {
  success: boolean;
  message?: string;
  mustChangePassword?: boolean;
}

export async function loginMember(
  _prevState: LoginResult | undefined,
  formData: FormData
): Promise<LoginResult> {
  const rawNumber = String(formData.get("membershipNumber") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/directory").trim();

  if (!rawNumber || !password) {
    return { success: false, message: "Please enter your articulate number and password." };
  }

  const artMatch = rawNumber.match(/^art\.?\s*(.*)$/i);
  const strippedNumber = artMatch ? artMatch[1].trim() : rawNumber;
  const prefixedNumber = `Art. ${strippedNumber}`;

  const member = await prisma.member.findFirst({
    where: {
      OR: [
        { membershipNumber: { equals: rawNumber, mode: "insensitive" } },
        { membershipNumber: { equals: strippedNumber, mode: "insensitive" } },
        { membershipNumber: { equals: prefixedNumber, mode: "insensitive" } },
      ],
    },
  });

  if (!member || !member.isActive) {
    return { success: false, message: "Invalid articulate number or password." };
  }

  if (!member.passwordHash) {
    return {
      success: false,
      message:
        "No password configured for this articulate number yet. Please contact the club administrator to set up your initial password.",
    };
  }

  const isValidPassword = await bcrypt.compare(password, member.passwordHash);
  if (!isValidPassword) {
    return { success: false, message: "Invalid articulate number or password." };
  }

  const sessionData: MemberSessionData = {
    id: member.id,
    membershipNumber: member.membershipNumber || rawNumber,
    firstName: member.firstName,
    lastName: member.lastName,
    title: member.title,
    slug: member.slug,
  };

  await createMemberSession(sessionData);

  if (member.mustChangePassword) {
    redirect(`/members/portal?changePassword=1${callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`);
  }

  redirect(callbackUrl.startsWith("/") ? callbackUrl : "/directory");
}

export async function logoutMember(): Promise<void> {
  await destroyMemberSession();
  redirect("/members/login");
}

export interface PasswordChangeResult {
  success: boolean;
  message: string;
}

export async function changeMemberPassword(
  _prevState: PasswordChangeResult | undefined,
  formData: FormData
): Promise<PasswordChangeResult> {
  const session = await getMemberSession();
  if (!session) {
    return { success: false, message: "You must be signed in to change your password." };
  }

  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: "New password must be at least 6 characters long." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "New passwords do not match." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.member.update({
    where: { id: session.id },
    data: {
      passwordHash,
      mustChangePassword: false,
    },
  });

  return {
    success: true,
    message: "Your password has been successfully updated.",
  };
}
