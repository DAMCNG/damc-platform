"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@damc/db";
import { requireContentPermission } from "@/lib/guards";
import { revalidateWebPaths } from "@/lib/revalidate-web";
import { toastUrl } from "@/lib/toast-redirect";

// ---- Hero carousel ----

export async function createHeroSlide(formData: FormData) {
  await requireContentPermission();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  if (!imageUrl) return;

  const maxOrder = await prisma.heroSlide.aggregate({ _max: { order: true } });
  await prisma.heroSlide.create({
    data: {
      imageUrl,
      caption: String(formData.get("caption") ?? "") || null,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  revalidatePath("/content");
  await revalidateWebPaths(["/"]);
  redirect(toastUrl("/content", "Slide added."));
}

export async function deleteHeroSlide(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  await prisma.heroSlide.delete({ where: { id } });

  revalidatePath("/content");
  await revalidateWebPaths(["/"]);
  redirect(toastUrl("/content", "Slide removed."));
}

export async function updateHomeHero(formData: FormData) {
  await requireContentPermission();

  const content = {
    heading: String(formData.get("heading") ?? ""),
    subheading: String(formData.get("subheading") ?? ""),
    ctaLabel: String(formData.get("ctaLabel") ?? ""),
  };

  await prisma.siteContent.upsert({
    where: { page_section: { page: "HOME", section: "hero" } },
    update: { content },
    create: { page: "HOME", section: "hero", content },
  });

  revalidatePath("/content");
  await revalidateWebPaths(["/"]);
  redirect(toastUrl("/content", "Homepage hero saved."));
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function updateWhoWeAre(formData: FormData) {
  await requireContentPermission();

  const content = {
    heading: String(formData.get("heading") ?? ""),
    description: String(formData.get("description") ?? ""),
    aims: splitLines(String(formData.get("aims") ?? "")),
  };

  await prisma.siteContent.upsert({
    where: { page_section: { page: "HOME", section: "who-we-are" } },
    update: { content },
    create: { page: "HOME", section: "who-we-are", content },
  });

  revalidatePath("/content");
  await revalidateWebPaths(["/"]);
  redirect(toastUrl("/content", "\"Who we are\" section saved."));
}

export async function updateAboutContent(formData: FormData) {
  await requireContentPermission();

  const content = {
    vision: String(formData.get("vision") ?? ""),
    mission: String(formData.get("mission") ?? ""),
    motto: String(formData.get("motto") ?? ""),
  };

  await prisma.siteContent.upsert({
    where: { page_section: { page: "ABOUT", section: "vision-mission" } },
    update: { content },
    create: { page: "ABOUT", section: "vision-mission", content },
  });

  revalidatePath("/content");
  await revalidateWebPaths(["/about"]);
  redirect(toastUrl("/content", "Vision, mission & motto saved."));
}

export async function updateContactContent(formData: FormData) {
  await requireContentPermission();

  const content = {
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    instagram: String(formData.get("instagram") ?? ""),
    facebook: String(formData.get("facebook") ?? ""),
    tiktok: String(formData.get("tiktok") ?? ""),
  };

  await prisma.siteContent.upsert({
    where: { page_section: { page: "CONTACT", section: "details" } },
    update: { content },
    create: { page: "CONTACT", section: "details", content },
  });

  revalidatePath("/content");
  await revalidateWebPaths(["/contact", "/"]);
  redirect(toastUrl("/content", "Contact details saved."));
}

// ---- Founders ----

export async function createFounder(formData: FormData) {
  await requireContentPermission();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.founder.create({
    data: {
      name,
      title: String(formData.get("title") ?? "") || null,
      photoUrl: String(formData.get("photoUrl") ?? "") || null,
    },
  });

  revalidatePath("/content");
  await revalidateWebPaths(["/about"]);
  redirect(toastUrl("/content", `${name} was added.`));
}

export async function updateFounder(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;

  await prisma.founder.update({
    where: { id },
    data: {
      name,
      title: String(formData.get("title") ?? "") || null,
      photoUrl: String(formData.get("photoUrl") ?? "") || null,
    },
  });

  revalidatePath("/content");
  await revalidateWebPaths(["/about"]);
  redirect(toastUrl("/content", `${name} was updated.`));
}

export async function deleteFounder(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const founder = await prisma.founder.delete({ where: { id } });

  revalidatePath("/content");
  await revalidateWebPaths(["/about"]);
  redirect(toastUrl("/content", `${founder.name} was removed.`));
}

// ---- Milestones ----

export async function createMilestone(formData: FormData) {
  await requireContentPermission();
  const title = String(formData.get("title") ?? "").trim();
  const year = Number(formData.get("year"));
  if (!title || !year) return;

  await prisma.milestone.create({
    data: {
      title,
      year,
      description: String(formData.get("description") ?? "") || null,
    },
  });

  revalidatePath("/content");
  await revalidateWebPaths(["/about"]);
  redirect(toastUrl("/content", `"${title}" was added.`));
}

export async function deleteMilestone(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const milestone = await prisma.milestone.delete({ where: { id } });

  revalidatePath("/content");
  await revalidateWebPaths(["/about"]);
  redirect(toastUrl("/content", `"${milestone.title}" was removed.`));
}
