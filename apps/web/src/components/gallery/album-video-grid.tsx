"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { ImageWithSkeleton } from "@damc/ui";
import { youtubeThumbnailUrl, isYouTubeShort } from "@/lib/youtube";
import { AlbumVideoLightbox } from "./album-video-lightbox";

export interface AlbumVideo {
  id: string;
  url: string;
}

export function AlbumVideoGrid({ videos, title }: { videos: AlbumVideo[]; title: string }) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {videos.map((video, i) => {
          const thumbnail = youtubeThumbnailUrl(video.url) ?? "/placeholders/gallery-photo.svg";
          const short = isYouTubeShort(video.url);
          return (
            <button
              key={video.id}
              onClick={() => setActiveIndex(i)}
              className="group relative aspect-square overflow-hidden rounded-xl2 bg-ink"
            >
              <ImageWithSkeleton
                src={thumbnail}
                alt=""
                className="h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-50"
                loading="lazy"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-ink transition-transform group-hover:scale-110">
                  <Play size={18} fill="currentColor" />
                </span>
              </span>
              {short && (
                <span className="absolute left-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-parchment">
                  Shorts
                </span>
              )}
            </button>
          );
        })}
      </div>
      <AlbumVideoLightbox videos={videos} activeIndex={activeIndex} title={title} onClose={() => setActiveIndex(null)} />
    </>
  );
}
