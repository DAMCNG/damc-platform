"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { AutoScrollRow, ImageWithSkeleton } from "@damc/ui";
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import { coverImage, type GalleryItemData } from "@/components/gallery/gallery-grid";
import { optimizedImageUrl } from "@/lib/cloudinary";

export function GalleryScroller({ items }: { items: GalleryItemData[] }) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  if (items.length === 0) return null;

  return (
    <>
      <AutoScrollRow ariaLabel="Recent photos and videos">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(index)}
            className="group relative h-48 w-64 flex-shrink-0 overflow-hidden rounded-xl2"
          >
            <ImageWithSkeleton
              src={optimizedImageUrl(coverImage(item), 500)}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/placeholders/gallery-photo.svg";
              }}
            />
            {item.mediaType === "VIDEO" && (
              <span className="absolute inset-0 flex items-center justify-center bg-ink/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-ink">
                  <Play size={16} fill="currentColor" />
                </span>
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-2.5 text-left text-xs font-medium text-parchment opacity-0 transition-opacity group-hover:opacity-100">
              {item.title}
            </span>
          </button>
        ))}
      </AutoScrollRow>

      <GalleryLightbox items={items} activeIndex={activeIndex} onClose={() => setActiveIndex(null)} />
    </>
  );
}
