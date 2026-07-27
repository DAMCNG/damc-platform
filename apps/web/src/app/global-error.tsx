"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-parchment-paper px-6 text-center font-sans dark:bg-ink">
        <span className="text-sm font-semibold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
          Error
        </span>
        <h1 className="mt-3 text-3xl font-semibold text-ink dark:text-parchment sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-3 max-w-sm text-bronze dark:text-parchment/70">
          The site hit an unexpected error. Please try again.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex h-11 items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full border border-ink/15 px-6 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 dark:border-parchment/20 dark:text-parchment dark:hover:bg-parchment/10"
          >
            Back to home
          </a>
        </div>
      </body>
    </html>
  );
}
