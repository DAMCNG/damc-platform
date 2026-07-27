"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@damc/db";
import { requireContentPermission } from "@/lib/guards";
import { revalidateWebPaths } from "@/lib/revalidate-web";
import { toastUrl } from "@/lib/toast-redirect";

async function revalidateAchievements() {
  revalidatePath("/achievements");
  await revalidateWebPaths(["/achievements"]);
}

export async function createAchievement(formData: FormData) {
  await requireContentPermission();
  const title = String(formData.get("title") ?? "").trim();
  const year = Number(formData.get("year"));
  if (!title || !year) return;

  await prisma.achievement.create({
    data: {
      title,
      year,
      description: String(formData.get("description") ?? "") || null,
      imageUrl: String(formData.get("imageUrl") ?? "") || null,
    },
  });
  await revalidateAchievements();
  redirect(toastUrl("/achievements", `"${title}" was added.`));
}

export async function deleteAchievement(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const achievement = await prisma.achievement.delete({ where: { id } });
  await revalidateAchievements();
  redirect(toastUrl("/achievements", `"${achievement.title}" was removed.`));
}
