"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@damc/db";
import { requireContentPermission } from "@/lib/guards";
import { revalidateWebPaths } from "@/lib/revalidate-web";
import { toastUrl } from "@/lib/toast-redirect";

async function revalidateRoster() {
  revalidatePath("/roster");
  await revalidateWebPaths(["/roster"]);
}

export async function createRosterEntry(formData: FormData) {
  await requireContentPermission();
  const hostIds = formData.getAll("hostIds").map(String).filter(Boolean);
  const meetingDate = String(formData.get("meetingDate") ?? "");
  const notes = String(formData.get("notes") ?? "") || null;
  if (hostIds.length === 0 || !meetingDate) return;

  await prisma.rosterEntry.create({
    data: {
      meetingDate: new Date(meetingDate),
      notes,
      hosts: { connect: hostIds.map((id) => ({ id })) },
    },
  });
  await revalidateRoster();
  redirect(toastUrl("/roster", "Roster entry added."));
}

export async function updateRosterEntry(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const hostIds = formData.getAll("hostIds").map(String).filter(Boolean);
  const meetingDate = String(formData.get("meetingDate") ?? "");
  const notes = String(formData.get("notes") ?? "") || null;
  if (!id || hostIds.length === 0 || !meetingDate) return;

  await prisma.rosterEntry.update({
    where: { id },
    data: {
      meetingDate: new Date(meetingDate),
      notes,
      hosts: { set: hostIds.map((hostId) => ({ id: hostId })) },
    },
  });
  await revalidateRoster();
  redirect(toastUrl("/roster", "Roster entry updated."));
}

export async function deleteRosterEntry(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  await prisma.rosterEntry.delete({ where: { id } });
  await revalidateRoster();
  redirect(toastUrl("/roster", "Roster entry removed."));
}
