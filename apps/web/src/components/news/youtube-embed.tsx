"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { ImageWithSkeleton } from "@damc/ui";
import { extractYouTubeId } from "@/lib/youtube";

const THUMBNAIL_FALLBACKS = ["hqdefault.jpg", "mqdefault.jpg", "default.jpg"];

export function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = React.useState(false);
  const [thumbnailStep, setThumbnailStep] = React.useState(0);
  const videoId = extractYouTubeId(url);

  if (!videoId) return null;

  const thumbnailSrc =
    thumbnailStep < THUMBNAIL_FALLBACKS.length
      ? `https://i.ytimg.com/vi/${videoId}/${THUMBNAIL_FALLBACKS[thumbnailStep]}`
      : "/placeholders/gallery-photo.svg";

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl2 bg-ink">
      {playing ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="group relative h-full w-full"
          aria-label={`Play video: ${title}`}
        >
          <ImageWithSkeleton
            src={thumbnailSrc}
            alt=""
            className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
            loading="lazy"
            onError={() => setThumbnailStep((s) => s + 1)}
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-ink transition-transform group-hover:scale-110">
              <Play size={26} fill="currentColor" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
