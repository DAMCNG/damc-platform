import type { Metadata } from "next";
import { prisma } from "@damc/db";
import { Container, SectionHeading, Reveal, Card, CardContent, ImageWithSkeleton } from "@damc/ui";
import { MilestonesTimeline } from "@/components/about/milestones-timeline";
import { squareAvatarUrl } from "@/lib/cloudinary";
import { FormattedText } from "@/components/formatted-text";

export const metadata: Metadata = {
  title: "About us",
  description:
    "The vision, mission, motto, founders and milestones of the Dignified Articulate Men's Club (DAMC).",
};

export const revalidate = 3600;

const AIMS = [
  "The Club shall be a non-profit making private membership organization.",
  "The Club shall exist to provide social and recreational facilities for all its members.",
  "The Club shall strive to co-operate with and contribute towards charitable and other such organizations aimed at helping the needy and less fortunate in the society.",
  "The Club shall foster unity and common purpose by encouraging members on wealth creation.",
  "The Club shall be a non-governmental organization and a pressure group.",
];

interface VisionMissionContent {
  vision: string;
  mission: string;
  motto: string;
}

const FALLBACK_VM: VisionMissionContent = {
  vision: "Placeholder: the club's long-term vision statement goes here.",
  mission: "Placeholder: the club's mission statement goes here.",
  motto: "Uplift. Unite. Prosper.",
};

export default async function AboutPage() {
  const [vmContent, founders, milestones] = await Promise.all([
    prisma.siteContent.findUnique({ where: { page_section: { page: "ABOUT", section: "vision-mission" } } }),
    prisma.founder.findMany({ orderBy: { order: "asc" } }),
    prisma.milestone.findMany({ orderBy: { year: "asc" } }),
  ]);

  const vm = (vmContent?.content as unknown as VisionMissionContent) ?? FALLBACK_VM;

  return (
    <>
      <section className="border-b border-ink/8 bg-parchment/60 py-20 dark:border-parchment/10 dark:bg-ink-soft/30 sm:py-28">
        <Container className="max-w-3xl text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
              About us
            </span>
            <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-ink dark:text-parchment sm:text-5xl">
              Who we are
            </h1>
            <p className="mt-5 text-lg text-bronze dark:text-parchment/70">
              Placeholder: a warm paragraph introducing the club's history, character and
              community in Lagos. Replace with the club's real founding story.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <Card className="h-full">
              <CardContent>
                <span className="text-xs font-bold uppercase tracking-wide text-gold-deep dark:text-gold-bright">Vision</span>
                <div className="mt-3">
                  <FormattedText text={vm.vision} className="mb-4 font-display text-xl leading-relaxed text-ink dark:text-parchment last:mb-0" />
                </div>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card className="h-full">
              <CardContent>
                <span className="text-xs font-bold uppercase tracking-wide text-gold-deep dark:text-gold-bright">Mission</span>
                <div className="mt-3">
                  <FormattedText text={vm.mission} className="mb-4 font-display text-xl leading-relaxed text-ink dark:text-parchment last:mb-0" />
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ink py-16 dark:bg-ink-soft/60">
        <Container className="text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-wide text-gold-bright">Our motto</span>
            <p className="mt-3 font-display text-3xl italic text-parchment sm:text-4xl">&ldquo;{vm.motto}&rdquo;</p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Our aims &amp; objectives" title="What DAMC stands for" align="center" />
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-3xl gap-4">
            {AIMS.map((aim, i) => (
              <Reveal key={aim} delay={i * 0.06}>
                <div className="flex gap-4 rounded-xl2 border border-ink/8 bg-white p-5 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold-deep dark:bg-gold-bright/15 dark:text-gold-bright">
                    {i + 1}
                  </span>
                  <p className="text-sm text-ink dark:text-parchment/90">{aim}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {founders.length > 0 && (
        <section className="bg-parchment/60 py-20 dark:bg-ink-soft/30 sm:py-28">
          <Container>
            <Reveal>
              <SectionHeading eyebrow="Founders" title="The men who started it all" align="center" />
            </Reveal>
            <div className="mx-auto mt-10 grid max-w-4xl gap-10 sm:grid-cols-3">
              {founders.map((f, i) => (
                <Reveal key={f.id} delay={i * 0.08}>
                  <div className="text-center">
                    <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-full ring-4 ring-gold/20">
                      <ImageWithSkeleton
                        src={squareAvatarUrl(f.photoUrl ?? "/placeholders/member-avatar.svg", 400)}
                        alt={f.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-4 font-display text-lg font-semibold text-ink dark:text-parchment">{f.name}</div>
                    {f.title && <div className="text-sm text-gold-deep dark:text-gold-bright">{f.title}</div>}
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {milestones.length > 0 && (
        <section className="py-20 sm:py-28">
          <Container className="max-w-2xl">
            <Reveal>
              <SectionHeading eyebrow="Our journey" title="Major milestones" />
            </Reveal>
            <div className="mt-10">
              <MilestonesTimeline milestones={milestones} />
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
