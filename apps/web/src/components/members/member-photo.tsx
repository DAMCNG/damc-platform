"use client";

import * as React from "react";
import { ImageWithSkeleton } from "@damc/ui";
import { ImageLightbox } from "@/components/image-lightbox";
import { optimizedImageUrl, squareAvatarUrl } from "@/lib/cloudinary";

export function MemberPhoto({ photoUrl, alt }: { photoUrl: string | null; alt: string }) {
  const [open, setOpen] = React.useState(false);
  const src = photoUrl ?? "/placeholders/member-avatar.svg";

  return (
    <>
      <button
        type="button"
        onClick={() => photoUrl && setOpen(true)}
        aria-label={photoUrl ? `View full photo of ${alt}` : alt}
        className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full transition-opacity hover:opacity-90"
      >
        <ImageWithSkeleton src={squareAvatarUrl(src, 400)} alt={alt} className="h-full w-full object-cover" />
      </button>
      {photoUrl && (
        <ImageLightbox src={optimizedImageUrl(photoUrl, 1600)} alt={alt} open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
