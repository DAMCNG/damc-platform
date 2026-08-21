"use client";

import * as React from "react";
import { ImageWithSkeleton } from "@damc/ui";
import { AlbumPhotoLightbox } from "./album-photo-lightbox";
import { optimizedImageUrl } from "@/lib/cloudinary";

export function AlbumPhotoGrid({ photoUrls, downloadable }: { photoUrls: string[]; downloadable: boolean }) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photoUrls.map((url, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-xl2"
          >
            <ImageWithSkeleton
              src={optimizedImageUrl(url, 500)}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
      </div>
      <AlbumPhotoLightbox
        photoUrls={photoUrls}
        activeIndex={activeIndex}
        downloadable={downloadable}
        onClose={() => setActiveIndex(null)}
      />
    </>
  );
}
