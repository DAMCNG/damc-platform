import type { Metadata } from "next";
import { prisma } from "@damc/db";
import { Container, Reveal, Card, ImageWithSkeleton } from "@damc/ui";
import { optimizedImageUrl } from "@/lib/cloudinary";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Community impact and milestones achieved by the Dignified Articulate Men's Club.",
};

export const revalidate = 3600;

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    orderBy: [{ year: "desc" }, { order: "asc" }],
  });

  return (
    <>
      <section className="border-b border-ink/8 bg-parchment/60 py-20 dark:border-parchment/10 dark:bg-ink-soft/30 sm:py-28">
        <Container className="max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
              Giving back
            </span>
            <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-ink dark:text-parchment sm:text-5xl">
              Achievements
            </h1>
            <p className="mt-5 text-lg text-bronze dark:text-parchment/70">
              What the club has accomplished together, for our members and our community.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          {achievements.length === 0 ? (
            <p className="text-center text-bronze dark:text-parchment/70">
              Achievements will appear here once published in the admin dashboard.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((item, i) => (
                <Reveal key={item.id} delay={Math.min(i, 8) * 0.05}>
                  <Card className="h-full overflow-hidden">
                    <div className="relative h-48 w-full overflow-hidden">
                      <ImageWithSkeleton
                        src={optimizedImageUrl(item.imageUrl ?? "/placeholders/gallery-photo.svg", 700)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-xs font-bold uppercase tracking-wide text-gold-deep dark:text-gold-bright">
                        {item.year}
                      </div>
                      <h3 className="mt-1.5 font-display text-lg font-semibold text-ink dark:text-parchment">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-2 text-sm text-bronze dark:text-parchment/70">{item.description}</p>
                      )}
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
