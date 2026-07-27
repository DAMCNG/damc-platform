"use client";

import * as React from "react";
import { cn } from "../lib/utils";

/**
 * Drop-in replacement for <img> that shows a pulsing skeleton until the image
 * finishes loading, then cross-fades it in. Renders as a fragment (skeleton +
 * img as siblings), so the nearest positioned ancestor must be `relative`
 * (and ideally `overflow-hidden`) — true of every gallery/card/avatar wrapper
 * already in this codebase.
 */
export function ImageWithSkeleton({
  className,
  onLoad,
  onError,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  // The server-rendered <img> can start (and for cached/local images, finish)
  // loading before React hydrates and attaches onLoad, so that event never
  // fires and the skeleton would spin forever. `.complete` catches that case
  // on mount — covers both the load-before-hydration race and images that
  // were already in the browser cache.
  React.useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <span className="absolute inset-0 animate-pulse bg-ink/10 dark:bg-parchment/10" aria-hidden="true" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        className={cn(className, "transition-opacity duration-500 ease-out", loaded ? "opacity-100" : "opacity-0")}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setLoaded(true);
          onError?.(e);
        }}
        {...props}
      />
    </>
  );
}
