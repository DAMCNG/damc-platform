"use client";

import * as React from "react";
import { Download, X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageWithSkeleton } from "@damc/ui";
import { optimizedImageUrl } from "@/lib/cloudinary";

export function AlbumPhotoLightbox({
  photoUrls,
  activeIndex,
  downloadable,
  onClose,
}: {
  photoUrls: string[];
  activeIndex: number | null;
  downloadable: boolean;
  onClose: () => void;
}) {
  const open = activeIndex !== null;
  const [index, setIndex] = React.useState(activeIndex ?? 0);

  React.useEffect(() => {
    if (activeIndex !== null) setIndex(activeIndex);
  }, [activeIndex]);

  const goNext = React.useCallback(() => setIndex((i) => (i + 1) % photoUrls.length), [photoUrls.length]);
  const goPrev = React.useCallback(() => setIndex((i) => (i - 1 + photoUrls.length) % photoUrls.length), [photoUrls.length]);

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

  const currentUrl = open ? photoUrls[index] : null;
  const canStep = photoUrls.length > 1;

  return (
    <AnimatePresence>
      {open && (
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
            <button onClick={onClose} aria-label="Close" className="absolute -top-12 right-0 text-parchment hover:text-gold-bright">
              <X size={26} />
            </button>

            <div className="relative min-h-[40vh]">
              {currentUrl && (
                <ImageWithSkeleton
                  key={currentUrl}
                  src={optimizedImageUrl(currentUrl, 1600)}
                  alt=""
                  className="max-h-[80vh] w-full rounded-xl2 object-contain"
                />
              )}

              {canStep && (
                <>
                  <button
                    onClick={goPrev}
                    aria-label="Previous"
                    className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-parchment hover:bg-ink/70"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={goNext}
                    aria-label="Next"
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-parchment hover:bg-ink/70"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/60 px-2.5 py-1 text-xs font-semibold text-parchment">
                    {index + 1} / {photoUrls.length}
                  </span>
                </>
              )}
            </div>

            {downloadable && currentUrl && (
              <div className="mt-4 flex justify-end">
                <a href={currentUrl} download className="flex items-center gap-1.5 text-sm font-semibold text-gold-bright hover:underline">
                  <Download size={16} /> Download
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
