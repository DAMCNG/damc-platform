import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@damc/db";
import { Container, Reveal, Badge, buttonVariants } from "@damc/ui";
import { formatEventDate } from "@/lib/dates";
import { FormattedText } from "@/components/formatted-text";
import { GalleryEngagement } from "@/components/gallery/gallery-engagement";
import { AlbumPhotoGrid } from "@/components/gallery/album-photo-grid";
import { YouTubeEmbed } from "@/components/news/youtube-embed";

export const revalidate = 1800;

export async function generateStaticParams() {
  const albums = await prisma.galleryItem.findMany({ select: { id: true } });
  return albums.map((a) => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const album = await prisma.galleryItem.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
  });
  if (!album) return {};

  return {
    title: album.title,
    description: album.description ?? `${album.title} — DAMC gallery album.`,
    openGraph: {
      title: album.title,
      description: album.description ?? undefined,
      images: album.photos[0] ? [album.photos[0].url] : undefined,
    },
  };
}

export default async function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = await prisma.galleryItem.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { order: "asc" } },
      videos: { orderBy: { order: "asc" } },
    },
  });

  if (!album) notFound();

  const photoUrls = album.photos.map((p) => p.url);

  return (
    <article className="py-16 sm:py-24">
      <Container className="max-w-4xl">
        <Reveal>
          <Link href="/gallery" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            <ArrowLeft size={16} className="mr-1.5" /> Back to gallery
          </Link>

          {album.eventType && (
            <Badge variant="gold" className="mt-6">
              {album.eventType}
            </Badge>
          )}
          <h1 className="mt-4 text-balance font-display text-3xl font-semibold text-ink dark:text-parchment sm:text-4xl">
            {album.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-ink/8 pb-6 dark:border-parchment/10">
            <p className="text-sm text-bronze dark:text-parchment/60">
              {formatEventDate(album.eventDate ?? album.createdAt)}
            </p>
            <GalleryEngagement id={album.id} initialViews={album.views} initialLikes={album.likes} />
          </div>
        </Reveal>

        {album.description && (
          <Reveal delay={0.1}>
            <div className="mt-8">
              <FormattedText text={album.description} className="mb-4 leading-relaxed text-ink dark:text-parchment/90 last:mb-0" />
            </div>
          </Reveal>
        )}

        {album.videos.length > 0 && (
          <Reveal delay={0.15}>
            <div className="mt-8 space-y-6">
              {album.videos.map((video) => (
                <YouTubeEmbed key={video.id} url={video.url} title={album.title} />
              ))}
            </div>
          </Reveal>
        )}

        {photoUrls.length > 0 && (
          <Reveal delay={0.2}>
            <div className="mt-8">
              <AlbumPhotoGrid photoUrls={photoUrls} downloadable={album.downloadable} />
            </div>
          </Reveal>
        )}
      </Container>
    </article>
  );
}
