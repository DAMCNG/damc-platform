"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ImageWithSkeleton } from "@damc/ui";
import { optimizedImageUrl } from "@/lib/cloudinary";

const INTERVAL_MS = 3000;

export function AlbumCoverSlideshow({
  photoUrls,
  alt,
  startDelay = 0,
}: {
  photoUrls: string[];
  alt: string;
  // Offset in ms before this instance's first advance, so a grid of these
  // doesn't flip every card in lockstep - each one staggers in behind the
  // last instead of the whole page blinking at once.
  startDelay?: number;
}) {
  const [index, setIndex] = React.useState(0);
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (photoUrls.length < 2 || shouldReduceMotion) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      setIndex((i) => (i + 1) % photoUrls.length);
      interval = setInterval(() => setIndex((i) => (i + 1) % photoUrls.length), INTERVAL_MS);
    }, INTERVAL_MS + startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [photoUrls.length, shouldReduceMotion, startDelay]);

  const src = photoUrls[index] ?? "/placeholders/gallery-photo.svg";

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={index}
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <ImageWithSkeleton
            src={optimizedImageUrl(src, 600)}
            alt={alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
