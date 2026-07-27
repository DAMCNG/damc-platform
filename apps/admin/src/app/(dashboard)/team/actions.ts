"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma, type AdminRole } from "@damc/db";
import { requireSuperAdmin } from "@/lib/guards";
import { generateTempPassword } from "@/lib/passwords";
import { toastUrl } from "@/lib/toast-redirect";

export interface ActionResult {
  success: boolean;
  message: string;
  tempPassword?: string;
}

async function sendCredentialsEmail(name: string, email: string, role: AdminRole, tempPassword: string) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "DAMC Admin <notifications@damcng.com>",
      to: email,
      subject: "Your DAMC admin account",
      text: `Hi ${name},\n\nYou've been added as a ${role === "SUPER_ADMIN" ? "Super Admin" : "Content Manager"} on the DAMC admin dashboard.\n\nTemporary password: ${tempPassword}\n\nSign in and consider it shared only with you — change it after your first login.`,
    });
  } catch {
    // Best-effort — the temp password is also shown on-screen to the Super Admin.
  }
}

export async function createTeamMember(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  await requireSuperAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const role = formData.get("role") as AdminRole;

  if (!name || !email) {
    return { success: false, message: "Name and email are required." };
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return { success: false, message: "An admin with this email already exists." };
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  await prisma.adminUser.create({
    data: {
      name,
      email,
      phone,
      role,
      passwordHash,
      canPublishContent: formData.get("canPublishContent") === "on",
      canViewEnquiries: formData.get("canViewEnquiries") === "on",
      canAssignEnquiries: formData.get("canAssignEnquiries") === "on",
      canViewAnalytics: formData.get("canViewAnalytics") === "on",
    },
  });

  await sendCredentialsEmail(name, email, role, tempPassword);
  revalidatePath("/team");

  return { success: true, message: `${name} was added.`, tempPassword };
}

export async function updateTeamMember(formData: FormData) {
  await requireSuperAdmin();
  const id = String(formData.get("id"));

  await prisma.adminUser.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim() || null,
      role: formData.get("role") as AdminRole,
      canPublishContent: formData.get("canPublishContent") === "on",
      canViewEnquiries: formData.get("canViewEnquiries") === "on",
      canAssignEnquiries: formData.get("canAssignEnquiries") === "on",
      canViewAnalytics: formData.get("canViewAnalytics") === "on",
    },
  });

  revalidatePath("/team");
  redirect(toastUrl("/team", "Changes saved."));
}

export async function toggleTeamMemberStatus(formData: FormData) {
  const currentUser = await requireSuperAdmin();
  const id = String(formData.get("id"));

  if (id === currentUser.id) return;

  const member = await prisma.adminUser.findUnique({ where: { id } });
  if (!member) return;

  const nextStatus = member.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  await prisma.adminUser.update({ where: { id }, data: { status: nextStatus } });

  revalidatePath("/team");
  redirect(toastUrl("/team", `${member.name} was ${nextStatus === "ACTIVE" ? "activated" : "deactivated"}.`));
}

export async function resetTeamMemberPassword(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  await requireSuperAdmin();
  const id = String(formData.get("id"));

  const member = await prisma.adminUser.findUnique({ where: { id } });
  if (!member) return { success: false, message: "Member not found." };

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  await prisma.adminUser.update({ where: { id }, data: { passwordHash } });
  await sendCredentialsEmail(member.name, member.email, member.role, tempPassword);

  return { success: true, message: `Password reset for ${member.name}.`, tempPassword };
}
