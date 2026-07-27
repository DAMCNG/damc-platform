"use client";

import * as React from "react";

export function BrandMark({ size = 40, className }: { size?: number; className?: string }) {
  const [failed, setFailed] = React.useState(false);

  if (failed) {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={className}
        fill="none"
        aria-label="DAMC"
      >
        <circle cx="50" cy="38" r="20" fill="currentColor" opacity="0.9" />
        <path d="M18 92c2-18 14-30 32-30s30 12 32 30" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="DAMC"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain" }}
      onError={() => setFailed(true)}
    />
  );
}
