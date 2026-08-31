"use client";

import * as React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@damc/ui";
import { extractYouTubeId, isYouTubeShort } from "@/lib/youtube";

export function AlbumVideoLightbox({
  videos,
  activeIndex,
  title,
  onClose,
}: {
  videos: { id: string; url: string }[];
  activeIndex: number | null;
  title: string;
  onClose: () => void;
}) {
  const open = activeIndex !== null;
  const [index, setIndex] = React.useState(activeIndex ?? 0);

  React.useEffect(() => {
    if (activeIndex !== null) setIndex(activeIndex);
  }, [activeIndex]);

  const goNext = React.useCallback(() => setIndex((i) => (i + 1) % videos.length), [videos.length]);
  const goPrev = React.useCallback(() => setIndex((i) => (i - 1 + videos.length) % videos.length), [videos.length]);

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

  const current = open ? videos[index] : null;
  const videoId = current ? extractYouTubeId(current.url) : null;
  const short = current ? isYouTubeShort(current.url) : false;
  const canStep = videos.length > 1;

  return (
    <AnimatePresence>
      {open && videoId && (
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
            className={cn("relative w-full", short ? "max-w-xs" : "max-w-3xl")}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} aria-label="Close" className="absolute -top-12 right-0 text-parchment hover:text-gold-bright">
              <X size={26} />
            </button>

            <div className={cn("relative overflow-hidden rounded-xl2 bg-ink", short ? "aspect-[9/16]" : "aspect-video")}>
              <iframe
                key={videoId}
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

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
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
