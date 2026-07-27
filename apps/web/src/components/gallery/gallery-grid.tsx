"use client";

import * as React from "react";
import { Play, Images } from "lucide-react";
import { cn, ImageWithSkeleton } from "@damc/ui";
import { youtubeThumbnailUrl } from "@/lib/youtube";
import { optimizedImageUrl } from "@/lib/cloudinary";
import { GalleryLightbox } from "./gallery-lightbox";

export interface GalleryItemData {
  id: string;
  title: string;
  mediaType: "PHOTO" | "VIDEO";
  url: string | null;
  thumbnailUrl: string | null;
  eventType: string | null;
  downloadable: boolean;
  photos: { id: string; url: string }[];
}

export function coverImage(item: GalleryItemData) {
  if (item.mediaType === "VIDEO") {
    return item.thumbnailUrl ?? (item.url ? youtubeThumbnailUrl(item.url) : null) ?? "/placeholders/gallery-photo.svg";
  }
  return item.thumbnailUrl ?? item.photos[0]?.url ?? "/placeholders/gallery-photo.svg";
}

export function GalleryGrid({ items }: { items: GalleryItemData[] }) {
  const [activeType, setActiveType] = React.useState<string | null>(null);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const eventTypes = React.useMemo(
    () => Array.from(new Set(items.map((i) => i.eventType).filter(Boolean))) as string[],
    [items]
  );

  const filtered = activeType ? items.filter((i) => i.eventType === activeType) : items;

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActiveType(null)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
            activeType === null
              ? "border-gold-deep bg-gold/15 text-gold-deep dark:border-gold-bright dark:bg-gold-bright/15 dark:text-gold-bright"
              : "border-ink/12 text-bronze hover:border-gold-deep dark:border-parchment/15 dark:text-parchment/70"
          )}
        >
          All
        </button>
        {eventTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              activeType === type
                ? "border-gold-deep bg-gold/15 text-gold-deep dark:border-gold-bright dark:bg-gold-bright/15 dark:text-gold-bright"
                : "border-ink/12 text-bronze hover:border-gold-deep dark:border-parchment/15 dark:text-parchment/70"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-xl2"
          >
            <ImageWithSkeleton
              src={optimizedImageUrl(coverImage(item), 600)}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/placeholders/gallery-photo.svg";
              }}
            />
            {item.mediaType === "VIDEO" && (
              <span className="absolute inset-0 flex items-center justify-center bg-ink/20">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-ink">
                  <Play size={18} fill="currentColor" />
                </span>
              </span>
            )}
            {item.mediaType === "PHOTO" && item.photos.length > 1 && (
              <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-ink/60 px-2 py-1 text-[11px] font-semibold text-parchment">
                <Images size={12} /> {item.photos.length}
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 text-left text-xs font-medium text-parchment opacity-0 transition-opacity group-hover:opacity-100">
              {item.title}
            </span>
          </button>
        ))}
      </div>

      <GalleryLightbox items={filtered} activeIndex={activeIndex} onClose={() => setActiveIndex(null)} />
    </div>
  );
}
