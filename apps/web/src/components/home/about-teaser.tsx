import Link from "next/link";
import { Container, SectionHeading, Reveal, buttonVariants, cn } from "@damc/ui";

export function AboutTeaser({
  heading,
  description,
  aims,
}: {
  heading: string;
  description: string;
  aims: string[];
}) {
  return (
    <section className="py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <SectionHeading eyebrow="Who we are" title={heading} description={description} />
          <Link href="/about" className={cn(buttonVariants({ variant: "outline" }), "mt-8")}>
            Read our vision &amp; mission
          </Link>
        </Reveal>
        <Reveal delay={0.15}>
          <ul className="space-y-4 rounded-xl2 border border-ink/8 bg-white p-8 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
            {aims.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-ink dark:text-parchment/90">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-deep dark:bg-gold-bright" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
