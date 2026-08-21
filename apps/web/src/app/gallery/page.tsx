import type { Metadata } from "next";
import { prisma } from "@damc/db";
import { Container, Reveal } from "@damc/ui";
import { GalleryGrid, type AlbumListData } from "@/components/gallery/gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photo and video albums from DAMC meetings, ceremonies and events.",
};

export const revalidate = 1800;

const PAGE_SIZE = 10;

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const { type, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const albums = await prisma.galleryItem.findMany({
    where: type ? { eventType: type } : undefined,
    include: { photos: { orderBy: { order: "asc" } }, videos: true },
  });

  // Most recent first, using the event date when set, falling back to when
  // it was uploaded - Prisma can't express that fallback in a single
  // orderBy, and the dataset is small enough to sort in memory.
  albums.sort((a, b) => (b.eventDate ?? b.createdAt).getTime() - (a.eventDate ?? a.createdAt).getTime());

  const allTypes = await prisma.galleryItem.findMany({
    where: { eventType: { not: null } },
    select: { eventType: true },
    distinct: ["eventType"],
  });
  const eventTypes = allTypes.map((t) => t.eventType).filter((t): t is string => Boolean(t)).sort();

  const totalPages = Math.max(1, Math.ceil(albums.length / PAGE_SIZE));
  const pageAlbums = albums.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <section className="border-b border-ink/8 bg-parchment/60 py-20 dark:border-parchment/10 dark:bg-ink-soft/30 sm:py-28">
        <Container className="max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
              Moments
            </span>
            <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-ink dark:text-parchment sm:text-5xl">
              Gallery
            </h1>
            <p className="mt-5 text-lg text-bronze dark:text-parchment/70">
              Photo and video albums from meetings, ceremonies and celebrations.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          {albums.length === 0 ? (
            <p className="text-center text-bronze dark:text-parchment/70">
              Albums will appear here once added in the admin dashboard.
            </p>
          ) : (
            <GalleryGrid
              albums={pageAlbums as AlbumListData[]}
              eventTypes={eventTypes}
              activeType={type ?? null}
              page={page}
              totalPages={totalPages}
            />
          )}
        </Container>
      </section>
    </>
  );
}
