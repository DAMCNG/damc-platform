"use client";

import * as React from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageWithSkeleton } from "@damc/ui";

export function ImageLightbox({
  src,
  alt,
  open,
  onClose,
}: {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

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
            className="relative max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-12 right-0 text-parchment hover:text-gold-bright"
            >
              <X size={26} />
            </button>
            <ImageWithSkeleton src={src} alt={alt} className="max-h-[80vh] w-full rounded-xl2 object-contain" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
