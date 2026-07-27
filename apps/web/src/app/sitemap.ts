import type { MetadataRoute } from "next";
import { prisma } from "@damc/db";

const BASE_URL = "https://www.damcng.com";

const STATIC_ROUTES = [
  "",
  "/about",
  "/executives",
  "/members",
  "/directory",
  "/news",
  "/news/calendar",
  "/roster",
  "/achievements",
  "/gallery",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
    })),
    ...posts.map((post) => ({
      url: `${BASE_URL}/news/${post.slug}`,
      lastModified: post.updatedAt,
    })),
  ];
}
