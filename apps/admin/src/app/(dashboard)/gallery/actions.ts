"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma, type GalleryMediaType } from "@damc/db";
import { requireContentPermission } from "@/lib/guards";
import { revalidateWebPaths } from "@/lib/revalidate-web";
import { toastUrl } from "@/lib/toast-redirect";

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

async function revalidateGallery() {
  revalidatePath("/gallery");
  await revalidateWebPaths(["/gallery", "/"]);
}

export async function createGalleryItem(formData: FormData) {
  await requireContentPermission();
  const title = String(formData.get("title") ?? "").trim();
  const mediaType = formData.get("mediaType") as GalleryMediaType;
  if (!title) return;

  if (mediaType === "VIDEO") {
    const url = String(formData.get("url") ?? "").trim();
    if (!url) return;
    await prisma.galleryItem.create({
      data: {
        title,
        mediaType,
        url,
        eventType: String(formData.get("eventType") ?? "") || null,
        downloadable: false,
      },
    });
  } else {
    const photoUrls = splitLines(String(formData.get("photoUrls") ?? ""));
    if (photoUrls.length === 0) return;
    await prisma.galleryItem.create({
      data: {
        title,
        mediaType,
        eventType: String(formData.get("eventType") ?? "") || null,
        downloadable: formData.get("downloadable") === "on",
        photos: { create: photoUrls.map((url, i) => ({ url, order: i })) },
      },
    });
  }

  await revalidateGallery();
  redirect(toastUrl("/gallery", `"${title}" was added.`));
}

export async function deleteGalleryItem(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const item = await prisma.galleryItem.delete({ where: { id } });
  await revalidateGallery();
  redirect(toastUrl("/gallery", `"${item.title}" was removed.`));
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
      eventType: String(formData.get("eventType") ?? "") || null,
      downloadable: formData.get("downloadable") === "on",
    },
  });

  await revalidateGallery();
  redirect(toastUrl(`/gallery/${id}`, "Changes saved."));
}

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

  await revalidateGallery();
  redirect(toastUrl(`/gallery/${galleryItemId}`, "Photo added."));
}

export async function deleteGalleryPhoto(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const galleryItemId = String(formData.get("galleryItemId"));
  await prisma.galleryPhoto.delete({ where: { id } });
  await revalidateGallery();
  redirect(toastUrl(`/gallery/${galleryItemId}`, "Photo removed."));
}
