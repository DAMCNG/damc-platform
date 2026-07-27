"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container, buttonVariants, cn } from "@damc/ui";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
        Error
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink dark:text-parchment sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-sm text-bronze dark:text-parchment/70">
        An unexpected error occurred while loading this page. Please try again.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button onClick={() => reset()} className={cn(buttonVariants())}>
          Try again
        </button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Back to home
        </Link>
      </div>
    </Container>
  );
}
