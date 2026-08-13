import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@damc/db";
import { Container, Reveal, Badge, buttonVariants } from "@damc/ui";
import { formatEventDate } from "@/lib/dates";
import { POST_CATEGORY_LABELS } from "@/lib/labels";
import { PostEngagement } from "@/components/news/post-engagement";
import { YouTubeEmbed } from "@/components/news/youtube-embed";
import { PostBody } from "@/components/news/post-body";

export const revalidate = 900;

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
  });
  if (!post) return {};

  const cover = post.photos[0]?.url ?? post.coverImageUrl;
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!post || post.status !== "PUBLISHED") notFound();

  const photoUrls = post.photos.length > 0 ? post.photos.map((p) => p.url) : post.coverImageUrl ? [post.coverImageUrl] : [];

  return (
    <article className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <Reveal>
          <Link href="/news" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            <ArrowLeft size={16} className="mr-1.5" /> Back to news
          </Link>

          <Badge variant="gold" className="mt-6">
            {POST_CATEGORY_LABELS[post.category]}
          </Badge>
          <h1 className="mt-4 text-balance font-display text-3xl font-semibold text-ink dark:text-parchment sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-ink/8 pb-6 dark:border-parchment/10">
            <p className="text-sm text-bronze dark:text-parchment/60">
              By {post.authorName}
              {post.publishedAt ? ` · ${formatEventDate(post.publishedAt)}` : ""}
            </p>
            <PostEngagement slug={post.slug} initialViews={post.views} initialLikes={post.likes} />
          </div>
        </Reveal>

        {post.youtubeUrl && (
          <Reveal delay={0.1}>
            <div className="mt-8">
              <YouTubeEmbed url={post.youtubeUrl} title={post.title} />
            </div>
          </Reveal>
        )}

        <Reveal delay={0.15}>
          <div className="mt-8">
            <PostBody
              content={post.content}
              photoUrls={photoUrls}
              paragraphClassName="mb-5 leading-relaxed text-ink dark:text-parchment/90 last:mb-0"
            />
          </div>
        </Reveal>
      </Container>
    </article>
  );
}
