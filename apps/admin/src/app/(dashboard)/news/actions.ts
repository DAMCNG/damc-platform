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

function readPostFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  return {
    title,
    slug: slugify(title),
    excerpt: String(formData.get("excerpt") ?? "") || null,
    content: String(formData.get("content") ?? ""),
    coverImageUrl: String(formData.get("coverImageUrl") ?? "") || null,
    youtubeUrl: String(formData.get("youtubeUrl") ?? "") || null,
    category: formData.get("category") as PostCategory,
    status: formData.get("status") as PostStatus,
    authorName: String(formData.get("authorName") ?? "").trim(),
  };
}

async function revalidatePostPaths(slug?: string) {
  revalidatePath("/news");
  const paths = ["/news", "/"];
  if (slug) paths.push(`/news/${slug}`);
  await revalidateWebPaths(paths);
}

export async function createPost(formData: FormData) {
  await requireContentPermission();
  const data = readPostFields(formData);

  await prisma.post.create({
    data: { ...data, publishedAt: data.status === "PUBLISHED" ? new Date() : null },
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
