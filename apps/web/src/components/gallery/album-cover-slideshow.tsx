"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ImageWithSkeleton } from "@damc/ui";
import { optimizedImageUrl } from "@/lib/cloudinary";

export function AlbumCoverSlideshow({ photoUrls, alt }: { photoUrls: string[]; alt: string }) {
  const [index, setIndex] = React.useState(0);
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (photoUrls.length < 2 || shouldReduceMotion) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % photoUrls.length), 3000);
    return () => clearInterval(timer);
  }, [photoUrls.length, shouldReduceMotion]);

  const src = photoUrls[index] ?? "/placeholders/gallery-photo.svg";

  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="sync">
        <motion.div
          key={src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
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
