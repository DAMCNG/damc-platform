import Link from "next/link";
import { Container, buttonVariants, cn } from "@damc/ui";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
        404
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink dark:text-parchment sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-bronze dark:text-parchment/70">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link href="/" className={cn(buttonVariants(), "mt-8")}>
        Back to home
      </Link>
    </Container>
  );
}
