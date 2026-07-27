"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@damc/db";
import { requireContentPermission } from "@/lib/guards";
import { revalidateWebPaths } from "@/lib/revalidate-web";
import { toastUrl } from "@/lib/toast-redirect";

function slugify(first: string, last: string) {
  return `${first}-${last}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readMemberFields(formData: FormData) {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const birthMonth = formData.get("birthMonth");
  const birthDay = formData.get("birthDay");

  return {
    firstName,
    lastName,
    slug: slugify(firstName, lastName),
    photoUrl: String(formData.get("photoUrl") ?? "") || null,
    bio: String(formData.get("bio") ?? "") || null,
    phone: String(formData.get("phone") ?? "") || null,
    email: String(formData.get("email") ?? "") || null,
    whatsapp: String(formData.get("whatsapp") ?? "") || null,
    birthMonth: birthMonth ? Number(birthMonth) : null,
    birthDay: birthDay ? Number(birthDay) : null,
    isActive: formData.get("isActive") === "on",
  };
}

async function revalidateMemberPaths() {
  revalidatePath("/members");
  await revalidateWebPaths(["/members", "/directory", "/", "/executives"]);
}

export async function createMember(formData: FormData) {
  await requireContentPermission();
  const data = readMemberFields(formData);

  await prisma.member.create({ data: { ...data, joinedDate: new Date() } });
  await revalidateMemberPaths();
  redirect(toastUrl("/members", `${data.firstName} ${data.lastName} was added.`));
}

export async function updateMember(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const data = readMemberFields(formData);

  await prisma.member.update({ where: { id }, data });
  await revalidateMemberPaths();
  redirect(toastUrl("/members", "Changes saved."));
}

export async function deleteMember(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));

  const member = await prisma.member.delete({ where: { id } });
  await revalidateMemberPaths();
  redirect(toastUrl("/members", `${member.firstName} ${member.lastName} was removed.`));
}

// ---- Businesses (a member can run more than one) ----

export async function createBusiness(formData: FormData) {
  await requireContentPermission();
  const memberId = String(formData.get("memberId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  if (!memberId || !name || !category) return;

  await prisma.business.create({
    data: {
      memberId,
      name,
      category,
      description: String(formData.get("description") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
      website: String(formData.get("website") ?? "") || null,
    },
  });

  revalidatePath(`/members/${memberId}`);
  await revalidateMemberPaths();
  redirect(toastUrl(`/members/${memberId}`, `${name} was added.`));
}

export async function deleteBusiness(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const memberId = String(formData.get("memberId"));

  await prisma.business.delete({ where: { id } });

  revalidatePath(`/members/${memberId}`);
  await revalidateMemberPaths();
  redirect(toastUrl(`/members/${memberId}`, "Business removed."));
}
