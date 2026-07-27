"use client";

import * as React from "react";
import { Download, X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageWithSkeleton } from "@damc/ui";
import { YouTubeEmbed } from "@/components/news/youtube-embed";
import { optimizedImageUrl } from "@/lib/cloudinary";
import type { GalleryItemData } from "./gallery-grid";

export function GalleryLightbox({
  items,
  activeIndex,
  onClose,
}: {
  items: GalleryItemData[];
  activeIndex: number | null;
  onClose: () => void;
}) {
  const open = activeIndex !== null;
  const [index, setIndex] = React.useState(activeIndex ?? 0);
  const [photoIndex, setPhotoIndex] = React.useState(0);

  React.useEffect(() => {
    if (activeIndex !== null) setIndex(activeIndex);
  }, [activeIndex]);

  React.useEffect(() => {
    setPhotoIndex(0);
  }, [index]);

  const item = open ? items[index] : null;
  const photos = item?.photos ?? [];
  const hasMultiplePhotos = photos.length > 1;
  const currentUrl = photos[photoIndex]?.url ?? item?.url ?? null;
  const canStepItems = items.length > 1;

  const goToItem = React.useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + items.length) % items.length);
    },
    [items.length]
  );

  const goNext = React.useCallback(() => {
    if (item?.mediaType === "PHOTO" && photoIndex < photos.length - 1) {
      setPhotoIndex((i) => i + 1);
    } else if (canStepItems) {
      goToItem(1);
    }
  }, [item, photoIndex, photos.length, canStepItems, goToItem]);

  const goPrev = React.useCallback(() => {
    if (item?.mediaType === "PHOTO" && photoIndex > 0) {
      setPhotoIndex((i) => i - 1);
    } else if (canStepItems) {
      goToItem(-1);
    }
  }, [item, photoIndex, canStepItems, goToItem]);

  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, goNext, goPrev]);

  const canGoNext = (item?.mediaType === "PHOTO" && photoIndex < photos.length - 1) || canStepItems;
  const canGoPrev = (item?.mediaType === "PHOTO" && photoIndex > 0) || canStepItems;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-12 right-0 text-parchment hover:text-gold-bright"
            >
              <X size={26} />
            </button>

            <div className="relative min-h-[40vh]">
              {item.mediaType === "VIDEO" ? (
                <YouTubeEmbed url={item.url ?? ""} title={item.title} />
              ) : (
                currentUrl && (
                  <ImageWithSkeleton
                    key={currentUrl}
                    src={optimizedImageUrl(currentUrl, 1600)}
                    alt={item.title}
                    className="max-h-[80vh] w-full rounded-xl2 object-contain"
                  />
                )
              )}

              {canGoPrev && (
                <button
                  onClick={goPrev}
                  aria-label="Previous"
                  className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-parchment hover:bg-ink/70"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              {canGoNext && (
                <button
                  onClick={goNext}
                  aria-label="Next"
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-parchment hover:bg-ink/70"
                >
                  <ChevronRight size={20} />
                </button>
              )}
              {hasMultiplePhotos && (
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/60 px-2.5 py-1 text-xs font-semibold text-parchment">
                  {photoIndex + 1} / {photos.length}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-parchment/80">{item.title}</span>
              {item.mediaType === "PHOTO" && item.downloadable && currentUrl && (
                <a
                  href={currentUrl}
                  download
                  className="flex items-center gap-1.5 text-sm font-semibold text-gold-bright hover:underline"
                >
                  <Download size={16} /> Download
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
