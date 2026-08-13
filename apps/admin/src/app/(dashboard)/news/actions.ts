"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma, type PostCategory, type PostStatus } from "@damc/db";
import { requireContentPermission } from "@/lib/guards";
import { revalidateWebPaths } from "@/lib/revalidate-web";
import { toastUrl } from "@/lib/toast-redirect";

function slugify(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function readPostFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "");
  return {
    title,
    slug: slugify(title),
    excerpt: String(formData.get("excerpt") ?? "") || null,
    content: String(formData.get("content") ?? ""),
    youtubeUrl: String(formData.get("youtubeUrl") ?? "") || null,
    category: formData.get("category") as PostCategory,
    status: formData.get("status") as PostStatus,
    authorName: String(formData.get("authorName") ?? "").trim(),
    // The real-world date this post is about (e.g. a wedding) - when set, it
    // also surfaces on the club calendar. Distinct from publishedAt.
    eventDate: eventDate ? new Date(eventDate) : null,
  };
}

async function revalidatePostPaths(slug?: string) {
  revalidatePath("/news");
  const paths = ["/news", "/news/calendar", "/"];
  if (slug) paths.push(`/news/${slug}`);
  await revalidateWebPaths(paths);
}

export async function createPost(formData: FormData) {
  await requireContentPermission();
  const data = readPostFields(formData);
  const photoUrls = splitLines(String(formData.get("photoUrls") ?? ""));

  await prisma.post.create({
    data: {
      ...data,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      photos: { create: photoUrls.map((url, i) => ({ url, order: i })) },
    },
  });
  await revalidatePostPaths(data.slug);
  redirect(toastUrl("/news", `"${data.title}" was ${data.status === "PUBLISHED" ? "published" : "saved as a draft"}.`));
}

export async function updatePost(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const data = readPostFields(formData);

  const existing = await prisma.post.findUnique({ where: { id } });
  const publishedAt =
    data.status === "PUBLISHED" ? existing?.publishedAt ?? new Date() : existing?.publishedAt ?? null;

  await prisma.post.update({ where: { id }, data: { ...data, publishedAt } });
  await revalidatePostPaths(data.slug);
  redirect(toastUrl("/news", "Changes saved."));
}

export async function deletePost(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const post = await prisma.post.delete({ where: { id } });
  await revalidatePostPaths(post.slug);
  redirect(toastUrl("/news", `"${post.title}" was deleted.`));
}

// ---- Photos (a post can carry more than one image) ----

export async function addPostPhoto(formData: FormData) {
  await requireContentPermission();
  const postId = String(formData.get("postId") ?? "");
  const url = String(formData.get("url") ?? "").trim();
  if (!postId || !url) return;

  const maxOrder = await prisma.postPhoto.aggregate({
    where: { postId },
    _max: { order: true },
  });
  await prisma.postPhoto.create({
    data: { postId, url, order: (maxOrder._max.order ?? -1) + 1 },
  });

  const post = await prisma.post.findUnique({ where: { id: postId } });
  await revalidatePostPaths(post?.slug);
  redirect(toastUrl(`/news/${postId}`, "Photo added."));
}

export async function deletePostPhoto(formData: FormData) {
  await requireContentPermission();
  const id = String(formData.get("id"));
  const postId = String(formData.get("postId"));
  await prisma.postPhoto.delete({ where: { id } });

  const post = await prisma.post.findUnique({ where: { id: postId } });
  await revalidatePostPaths(post?.slug);
  redirect(toastUrl(`/news/${postId}`, "Photo removed."));
}
