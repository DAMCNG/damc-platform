import Link from "next/link";
import { BrandMark } from "@damc/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-parchment-paper px-6 text-center dark:bg-ink">
      <BrandMark size={56} className="mb-6" />
      <span className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
        404
      </span>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink dark:text-parchment">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-bronze dark:text-parchment/60">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-7 inline-flex h-10 items-center justify-center rounded-full bg-gold px-5 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
