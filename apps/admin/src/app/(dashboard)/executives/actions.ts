"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@damc/db";
import { requireContentPermission } from "@/lib/guards";
import { revalidateWebPaths } from "@/lib/revalidate-web";
import { toastUrl } from "@/lib/toast-redirect";

async function revalidateExecutives() {
  revalidatePath("/executives");
  await revalidateWebPaths(["/executives"]);
}

// ---- Categories ----

export async function createExecutiveCategory(formData: FormData) {
  await requireContentPermission();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const maxOrder = await prisma.executiveCategory.aggregate({ _max: { order: true } });
  await prisma.executiveCategory.create({
    data: { name, order: (maxOrder._max.order ?? -10) + 10 },
  });

  await revalidateExecutives();
  redirect(toastUrl("/executives", `"${name}" was added.`));
}

export async function updateExecutiveCategory(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const order = Number(formData.get("order"));
  if (!id || !name || Number.isNaN(order)) return;

  await prisma.executiveCategory.update({ where: { id }, data: { name, order } });

  await revalidateExecutives();
  redirect(toastUrl("/executives", "Changes saved."));
}

export async function deleteExecutiveCategory(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));

  const category = await prisma.executiveCategory.delete({ where: { id } });

  await revalidateExecutives();
  redirect(toastUrl("/executives", `"${category.name}" was removed, along with its position history.`));
}

// ---- Positions ----

export async function assignExecutive(formData: FormData) {
  await requireContentPermission();
  const categoryId = String(formData.get("categoryId") ?? "");
  const memberId = String(formData.get("memberId") ?? "");
  if (!categoryId || !memberId) return;

  const position = await prisma.executivePosition.create({
    data: { categoryId, memberId, termStart: new Date(), isCurrent: true },
    include: { member: true, category: true },
  });

  await revalidateExecutives();
  redirect(
    toastUrl(
      "/executives",
      `${position.member.firstName} ${position.member.lastName} is now ${position.category?.name}.`
    )
  );
}

export async function removeExecutive(formData: FormData) {
  await requireContentPermission();
  const positionId = String(formData.get("positionId") ?? "");
  if (!positionId) return;

  await prisma.executivePosition.update({
    where: { id: positionId },
    data: { isCurrent: false, termEnd: new Date() },
  });

  await revalidateExecutives();
  redirect(toastUrl("/executives", "Position vacated."));
}
