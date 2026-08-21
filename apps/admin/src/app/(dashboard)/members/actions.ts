"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma, MaritalStatus } from "@damc/db";
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
  const yearJoined = formData.get("yearJoined");
  const maritalStatus = String(formData.get("maritalStatus") ?? "");

  return {
    firstName,
    lastName,
    slug: slugify(firstName, lastName),
    title: String(formData.get("title") ?? "") || null,
    nickname: String(formData.get("nickname") ?? "") || null,
    photoUrl: String(formData.get("photoUrl") ?? "") || null,
    bio: String(formData.get("bio") ?? "") || null,
    phone: String(formData.get("phone") ?? "") || null,
    email: String(formData.get("email") ?? "") || null,
    whatsapp: String(formData.get("whatsapp") ?? "") || null,
    birthMonth: birthMonth ? Number(birthMonth) : null,
    birthDay: birthDay ? Number(birthDay) : null,
    membershipNumber: String(formData.get("membershipNumber") ?? "") || null,
    occupation: String(formData.get("occupation") ?? "") || null,
    stateOfOrigin: String(formData.get("stateOfOrigin") ?? "") || null,
    yearJoined: yearJoined ? Number(yearJoined) : null,
    maritalStatus: maritalStatus ? (maritalStatus as MaritalStatus) : null,
    isLegalTeam: formData.get("isLegalTeam") === "on",
    legalTeamTitle: String(formData.get("legalTeamTitle") ?? "") || null,
    isActive: formData.get("isActive") === "on",
  };
}

async function revalidateMemberPaths(slug?: string) {
  revalidatePath("/members");
  if (slug) revalidatePath(`/members/${slug}`);
  const paths = ["/members", "/directory", "/", "/executives"];
  if (slug) paths.push(`/members/${slug}`);
  await revalidateWebPaths(paths);
}

export async function createMember(formData: FormData) {
  await requireContentPermission();
  const data = readMemberFields(formData);

  await prisma.member.create({ data: { ...data, joinedDate: new Date() } });
  await revalidateMemberPaths(data.slug);
  redirect(toastUrl("/members", `${data.firstName} ${data.lastName} was added.`));
}

export async function updateMember(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const data = readMemberFields(formData);

  await prisma.member.update({ where: { id }, data });
  await revalidateMemberPaths(data.slug);
  redirect(toastUrl("/members", "Changes saved."));
}

export async function deleteMember(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));

  const member = await prisma.member.delete({ where: { id } });
  await revalidateMemberPaths(member.slug);
  redirect(toastUrl("/members", `${member.firstName} ${member.lastName} was removed.`));
}

// ---- Businesses (a member can run more than one) ----

export async function createBusiness(formData: FormData) {
  await requireContentPermission();
  const memberId = String(formData.get("memberId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  if (!memberId || !name || !category) return;

  const [, member] = await prisma.$transaction([
    prisma.business.create({
      data: {
        memberId,
        name,
        category,
        description: String(formData.get("description") ?? "") || null,
        phone: String(formData.get("phone") ?? "") || null,
        website: String(formData.get("website") ?? "") || null,
      },
    }),
    prisma.member.findUniqueOrThrow({ where: { id: memberId }, select: { slug: true } }),
  ]);

  revalidatePath(`/members/${memberId}`);
  await revalidateMemberPaths(member.slug);
  redirect(toastUrl(`/members/${memberId}`, `${name} was added.`));
}

export async function updateBusiness(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const memberId = String(formData.get("memberId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  if (!id || !memberId || !name || !category) return;

  const [, member] = await prisma.$transaction([
    prisma.business.update({
      where: { id },
      data: {
        name,
        category,
        description: String(formData.get("description") ?? "") || null,
        phone: String(formData.get("phone") ?? "") || null,
        website: String(formData.get("website") ?? "") || null,
      },
    }),
    prisma.member.findUniqueOrThrow({ where: { id: memberId }, select: { slug: true } }),
  ]);

  revalidatePath(`/members/${memberId}`);
  await revalidateMemberPaths(member.slug);
  redirect(toastUrl(`/members/${memberId}`, `${name} was updated.`));
}

export async function deleteBusiness(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const memberId = String(formData.get("memberId"));

  const [, member] = await prisma.$transaction([
    prisma.business.delete({ where: { id } }),
    prisma.member.findUniqueOrThrow({ where: { id: memberId }, select: { slug: true } }),
  ]);

  revalidatePath(`/members/${memberId}`);
  await revalidateMemberPaths(member.slug);
  redirect(toastUrl(`/members/${memberId}`, "Business removed."));
}
