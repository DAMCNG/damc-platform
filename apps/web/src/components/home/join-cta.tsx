import Link from "next/link";
import { Container, Reveal, buttonVariants } from "@damc/ui";
import { cn } from "@damc/ui";

export function JoinCta() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="rounded-xl2 bg-ink px-8 py-16 text-center dark:bg-ink-soft/60">
            <h2 className="text-balance font-display text-3xl font-semibold text-parchment sm:text-4xl">
              Interested in joining DAMC?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-parchment/70">
              Membership is by referral and invitation. Reach out and a member of our
              welfare committee will guide you through the process.
            </p>
            <Link href="/contact" className={cn(buttonVariants({ size: "lg" }), "mt-8")}>
              Enquire about membership
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
