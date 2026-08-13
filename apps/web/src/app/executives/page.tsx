import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@damc/db";
import { Container, Reveal, Card, ImageWithSkeleton } from "@damc/ui";
import { optimizedImageUrl } from "@/lib/cloudinary";
import { formatMemberName } from "@/lib/member-name";

export const metadata: Metadata = {
  title: "Executives & Board of Trustees",
  description: "Meet the elected executives and board of trustees of the Dignified Articulate Men's Club.",
};

export const revalidate = 3600;

export default async function ExecutivesPage() {
  const categories = await prisma.executiveCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      positions: {
        where: { isCurrent: true },
        include: { member: { include: { businesses: true } } },
      },
    },
  });

  const positions = categories.flatMap((category) =>
    category.positions.map((position) => ({ ...position, categoryName: category.name }))
  );

  return (
    <>
      <section className="border-b border-ink/8 bg-parchment/60 py-20 dark:border-parchment/10 dark:bg-ink-soft/30 sm:py-28">
        <Container className="max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
              Leadership
            </span>
            <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-ink dark:text-parchment sm:text-5xl">
              Executives &amp; Board of Trustees
            </h1>
            <p className="mt-5 text-lg text-bronze dark:text-parchment/70">
              The current executive council elected to steward the club's affairs.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          {positions.length === 0 ? (
            <p className="text-center text-bronze dark:text-parchment/70">
              Executive positions will appear here once assigned in the admin dashboard.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {positions.map((position, i) => (
                <Reveal key={position.id} delay={Math.min(i, 8) * 0.05}>
                  <Link href={`/members/${position.member.slug}?from=executives`}>
                    <Card className="overflow-hidden text-center transition-transform duration-300 hover:-translate-y-1">
                      <div className="relative aspect-square w-full overflow-hidden sm:h-56 sm:aspect-auto">
                        <ImageWithSkeleton
                          src={optimizedImageUrl(position.member.photoUrl ?? "/placeholders/member-avatar.svg", 700)}
                          alt={formatMemberName(position.member)}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <div className="text-xs font-bold uppercase tracking-wide text-gold-deep dark:text-gold-bright">
                          {position.categoryName}
                        </div>
                        <div className="mt-1.5 font-display text-lg font-semibold text-ink dark:text-parchment">
                          {formatMemberName(position.member)}
                        </div>
                        {position.member.businesses[0] && (
                          <div className="mt-1 text-sm text-bronze dark:text-parchment/60">
                            {position.member.businesses[0].category}
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
