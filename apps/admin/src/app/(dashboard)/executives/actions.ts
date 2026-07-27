"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma, type ExecutiveRole } from "@damc/db";
import { requireContentPermission } from "@/lib/guards";
import { revalidateWebPaths } from "@/lib/revalidate-web";
import { ROLE_ORDER, ROLE_LABELS } from "@/lib/labels";
import { toastUrl } from "@/lib/toast-redirect";

export async function assignExecutive(formData: FormData) {
  await requireContentPermission();
  const role = formData.get("role") as ExecutiveRole;
  const memberId = formData.get("memberId") as string;
  if (!ROLE_ORDER.includes(role) || !memberId) return;

  const [, position] = await prisma.$transaction([
    prisma.executivePosition.updateMany({
      where: { role, isCurrent: true },
      data: { isCurrent: false, termEnd: new Date() },
    }),
    prisma.executivePosition.create({
      data: { role, memberId, termStart: new Date(), isCurrent: true },
      include: { member: true },
    }),
  ]);

  revalidatePath("/executives");
  await revalidateWebPaths(["/executives"]);
  redirect(toastUrl("/executives", `${position.member.firstName} ${position.member.lastName} is now ${ROLE_LABELS[role]}.`));
}

export async function removeExecutive(formData: FormData) {
  await requireContentPermission();
  const positionId = formData.get("positionId") as string;
  if (!positionId) return;

  await prisma.executivePosition.update({
    where: { id: positionId },
    data: { isCurrent: false, termEnd: new Date() },
  });

  revalidatePath("/executives");
  await revalidateWebPaths(["/executives"]);
  redirect(toastUrl("/executives", "Position vacated."));
}
