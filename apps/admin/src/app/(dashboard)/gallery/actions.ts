"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@damc/db";
import { requireContentPermission } from "@/lib/guards";
import { revalidateWebPaths } from "@/lib/revalidate-web";
import { toastUrl } from "@/lib/toast-redirect";

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

async function revalidateGallery(id?: string) {
  revalidatePath("/gallery");
  const paths = ["/gallery", "/"];
  if (id) paths.push(`/gallery/${id}`);
  await revalidateWebPaths(paths);
}

function readEventDate(formData: FormData) {
  const raw = String(formData.get("eventDate") ?? "");
  return raw ? new Date(raw) : null;
}

export async function createGalleryItem(formData: FormData) {
  await requireContentPermission();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const photoUrls = splitLines(String(formData.get("photoUrls") ?? ""));
  const videoUrls = splitLines(String(formData.get("videoUrls") ?? ""));

  const item = await prisma.galleryItem.create({
    data: {
      title,
      description: String(formData.get("description") ?? "") || null,
      eventType: String(formData.get("eventType") ?? "") || null,
      eventDate: readEventDate(formData),
      downloadable: formData.get("downloadable") === "on",
      photos: { create: photoUrls.map((url, i) => ({ url, order: i })) },
      videos: { create: videoUrls.map((url, i) => ({ url, order: i })) },
    },
  });

  await revalidateGallery(item.id);
  redirect(toastUrl("/gallery", `"${title}" was added.`));
}

export async function updateGalleryItem(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  if (!id || !title) return;

  await prisma.galleryItem.update({
    where: { id },
    data: {
      title,
      description: String(formData.get("description") ?? "") || null,
      eventType: String(formData.get("eventType") ?? "") || null,
      eventDate: readEventDate(formData),
      downloadable: formData.get("downloadable") === "on",
    },
  });

  await revalidateGallery(id);
  redirect(toastUrl(`/gallery/${id}`, "Changes saved."));
}

export async function deleteGalleryItem(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const item = await prisma.galleryItem.delete({ where: { id } });
  await revalidateGallery();
  redirect(toastUrl("/gallery", `"${item.title}" was removed.`));
}

// ---- Photos ----

export async function addGalleryPhoto(formData: FormData) {
  await requireContentPermission();
  const galleryItemId = String(formData.get("galleryItemId") ?? "");
  const url = String(formData.get("url") ?? "").trim();
  if (!galleryItemId || !url) return;

  const maxOrder = await prisma.galleryPhoto.aggregate({
    where: { galleryItemId },
    _max: { order: true },
  });
  await prisma.galleryPhoto.create({
    data: { galleryItemId, url, order: (maxOrder._max.order ?? -1) + 1 },
  });

  await revalidateGallery(galleryItemId);
  redirect(toastUrl(`/gallery/${galleryItemId}`, "Photo added."));
}

export async function deleteGalleryPhoto(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const galleryItemId = String(formData.get("galleryItemId"));
  await prisma.galleryPhoto.delete({ where: { id } });
  await revalidateGallery(galleryItemId);
  redirect(toastUrl(`/gallery/${galleryItemId}`, "Photo removed."));
}

// ---- Videos ----

export async function addGalleryVideo(formData: FormData) {
  await requireContentPermission();
  const galleryItemId = String(formData.get("galleryItemId") ?? "");
  const url = String(formData.get("url") ?? "").trim();
  if (!galleryItemId || !url) return;

  const maxOrder = await prisma.galleryVideo.aggregate({
    where: { galleryItemId },
    _max: { order: true },
  });
  await prisma.galleryVideo.create({
    data: { galleryItemId, url, order: (maxOrder._max.order ?? -1) + 1 },
  });

  await revalidateGallery(galleryItemId);
  redirect(toastUrl(`/gallery/${galleryItemId}`, "Video added."));
}

export async function deleteGalleryVideo(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const galleryItemId = String(formData.get("galleryItemId"));
  await prisma.galleryVideo.delete({ where: { id } });
  await revalidateGallery(galleryItemId);
  redirect(toastUrl(`/gallery/${galleryItemId}`, "Video removed."));
}
