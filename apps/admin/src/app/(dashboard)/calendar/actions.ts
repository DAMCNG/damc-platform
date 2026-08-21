"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma, type EventType } from "@damc/db";
import { requireContentPermission } from "@/lib/guards";
import { revalidateWebPaths } from "@/lib/revalidate-web";
import { toastUrl } from "@/lib/toast-redirect";

async function revalidateCalendar() {
  revalidatePath("/calendar");
  await revalidateWebPaths(["/news", "/news/calendar", "/"]);
}

function readEventFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    type: formData.get("type") as EventType,
    date: new Date(String(formData.get("date") ?? "")),
    description: String(formData.get("description") ?? "") || null,
  };
}

export async function createCalendarEvent(formData: FormData) {
  await requireContentPermission();
  const data = readEventFields(formData);
  if (!data.title || !data.type || Number.isNaN(data.date.getTime())) return;

  await prisma.calendarEvent.create({ data });
  await revalidateCalendar();
  redirect(toastUrl("/calendar", `"${data.title}" was added.`));
}

export async function updateCalendarEvent(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const data = readEventFields(formData);
  if (!id || !data.title || !data.type || Number.isNaN(data.date.getTime())) return;

  await prisma.calendarEvent.update({ where: { id }, data });
  await revalidateCalendar();
  redirect(toastUrl("/calendar", "Changes saved."));
}

export async function deleteCalendarEvent(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));

  const event = await prisma.calendarEvent.delete({ where: { id } });
  await revalidateCalendar();
  redirect(toastUrl("/calendar", `"${event.title}" was removed.`));
}
