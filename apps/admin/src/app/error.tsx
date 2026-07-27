"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BrandMark } from "@damc/ui";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-parchment-paper px-6 text-center dark:bg-ink">
      <BrandMark size={56} className="mb-6" />
      <span className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
        Error
      </span>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink dark:text-parchment">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-bronze dark:text-parchment/60">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-7 flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex h-10 items-center justify-center rounded-full bg-gold px-5 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-full border border-ink/15 px-5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 dark:border-parchment/20 dark:text-parchment dark:hover:bg-parchment/10"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
