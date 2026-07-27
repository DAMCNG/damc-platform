"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma, type EnquiryStatus } from "@damc/db";
import { requireEnquiryAssignPermission, requireEnquiryViewPermission } from "@/lib/guards";
import { toastUrl } from "@/lib/toast-redirect";

export async function updateEnquiryStatus(formData: FormData) {
  await requireEnquiryAssignPermission();
  const id = String(formData.get("id"));
  const status = formData.get("status") as EnquiryStatus;

  await prisma.enquiry.update({ where: { id }, data: { status } });
  revalidatePath("/enquiries");
  revalidatePath(`/enquiries/${id}`);
}

export async function assignEnquiry(formData: FormData) {
  await requireEnquiryAssignPermission();
  const id = String(formData.get("id"));
  const assignedToId = String(formData.get("assignedToId") ?? "") || null;

  await prisma.enquiry.update({ where: { id }, data: { assignedToId } });
  revalidatePath("/enquiries");
  revalidatePath(`/enquiries/${id}`);
}

/** Called client-side on mount when the detail view opens — not tied to page render/prefetch. */
export async function markEnquiryRead(id: string) {
  await requireEnquiryViewPermission();
  await prisma.enquiry.updateMany({
    where: { id, readAt: null },
    data: { readAt: new Date() },
  });
  revalidatePath("/enquiries");
}

export async function archiveEnquiry(formData: FormData) {
  await requireEnquiryAssignPermission();
  const id = String(formData.get("id"));
  await prisma.enquiry.update({ where: { id }, data: { archived: true } });
  revalidatePath("/enquiries");
  redirect(toastUrl("/enquiries", "Enquiry archived."));
}

export async function unarchiveEnquiry(formData: FormData) {
  await requireEnquiryAssignPermission();
  const id = String(formData.get("id"));
  await prisma.enquiry.update({ where: { id }, data: { archived: false } });
  revalidatePath("/enquiries");
  redirect(toastUrl("/enquiries?view=archived", "Enquiry restored to inbox."));
}

export async function deleteEnquiry(formData: FormData) {
  await requireEnquiryAssignPermission();
  const id = String(formData.get("id"));
  const view = String(formData.get("view") ?? "");
  await prisma.enquiry.delete({ where: { id } });
  revalidatePath("/enquiries");
  redirect(toastUrl(view === "archived" ? "/enquiries?view=archived" : "/enquiries", "Enquiry deleted."));
}
