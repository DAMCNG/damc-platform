import Link from "next/link";
import { Images, Play, Eye, Heart } from "lucide-react";
import { Card, cn } from "@damc/ui";
import { AlbumCoverSlideshow } from "./album-cover-slideshow";
import { albumCoverUrls } from "@/lib/gallery-cover";
import { formatEventDate } from "@/lib/dates";

export interface AlbumListData {
  id: string;
  title: string;
  eventType: string | null;
  eventDate: Date | null;
  createdAt: Date;
  views: number;
  likes: number;
  photos: { url: string }[];
  videos: { url: string }[];
}

function filterHref(type: string | null) {
  return type ? `/gallery?type=${encodeURIComponent(type)}` : "/gallery";
}

function pageHref(page: number, type: string | null) {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/gallery?${qs}` : "/gallery";
}

export function GalleryGrid({
  albums,
  eventTypes,
  activeType,
  page,
  totalPages,
}: {
  albums: AlbumListData[];
  eventTypes: string[];
  activeType: string | null;
  page: number;
  totalPages: number;
}) {
  return (
    <div>
      {eventTypes.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href={filterHref(null)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              activeType === null
                ? "border-gold-deep bg-gold/15 text-gold-deep dark:border-gold-bright dark:bg-gold-bright/15 dark:text-gold-bright"
                : "border-ink/12 text-bronze hover:border-gold-deep dark:border-parchment/15 dark:text-parchment/70"
            )}
          >
            All albums
          </Link>
          {eventTypes.map((type) => (
            <Link
              key={type}
              href={filterHref(type)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                activeType === type
                  ? "border-gold-deep bg-gold/15 text-gold-deep dark:border-gold-bright dark:bg-gold-bright/15 dark:text-gold-bright"
                  : "border-ink/12 text-bronze hover:border-gold-deep dark:border-parchment/15 dark:text-parchment/70"
              )}
            >
              {type}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {albums.map((album) => {
          const photoCount = album.photos.length;
          const videoCount = album.videos.length;
          return (
            <Link key={album.id} href={`/gallery/${album.id}`} className="group">
              <Card className="overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                <div className="relative aspect-square w-full overflow-hidden">
                  <AlbumCoverSlideshow photoUrls={albumCoverUrls(album)} alt={album.title} />
                  {videoCount > 0 && (
                    <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink/60 text-parchment">
                      <Play size={13} fill="currentColor" />
                    </span>
                  )}
                  {photoCount > 1 && (
                    <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-ink/60 px-2 py-1 text-[11px] font-semibold text-parchment">
                      <Images size={12} /> {photoCount}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="truncate font-display text-sm font-semibold text-ink dark:text-parchment">
                    {album.title}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-bronze-soft dark:text-parchment/50">
                    <span>{formatEventDate(album.eventDate ?? album.createdAt)}</span>
                    <span className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5"><Eye size={12} /> {album.views}</span>
                      <span className="flex items-center gap-0.5"><Heart size={12} /> {album.likes}</span>
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p, activeType)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                p === page
                  ? "border-gold-deep bg-gold/15 text-gold-deep dark:border-gold-bright dark:bg-gold-bright/15 dark:text-gold-bright"
                  : "border-ink/12 text-bronze hover:border-gold-deep dark:border-parchment/15 dark:text-parchment/70"
              )}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
