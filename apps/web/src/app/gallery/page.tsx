import type { Metadata } from "next";
import { prisma } from "@damc/db";
import { Container, Reveal } from "@damc/ui";
import { GalleryGrid, type GalleryItemData } from "@/components/gallery/gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos and videos from DAMC meetings, ceremonies and events.",
};

export const revalidate = 1800;

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
    include: { photos: { orderBy: { order: "asc" } } },
  });

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
              Photos and videos from meetings, ceremonies and celebrations.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          {items.length === 0 ? (
            <p className="text-center text-bronze dark:text-parchment/70">
              Photos and videos will appear here once uploaded in the admin dashboard.
            </p>
          ) : (
            <GalleryGrid items={items as GalleryItemData[]} />
          )}
        </Container>
      </section>
    </>
  );
}
