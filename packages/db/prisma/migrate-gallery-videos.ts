import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// One-time: copies the old single-video url on any pre-migration VIDEO-type
// GalleryItem into a proper GalleryVideo row, so it keeps showing up now that
// albums read from photos[]/videos[] instead of mediaType/url.
async function main() {
  const items = await prisma.galleryItem.findMany({
    where: { mediaType: "VIDEO", url: { not: null } },
  });

  let migrated = 0;
  for (const item of items) {
    const existing = await prisma.galleryVideo.findFirst({ where: { galleryItemId: item.id } });
    if (existing) continue;
    await prisma.galleryVideo.create({ data: { galleryItemId: item.id, url: item.url!, order: 0 } });
    migrated++;
  }

  console.log(`Migrated ${migrated} of ${items.length} legacy video gallery item(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
