import Link from "next/link";
import { prisma } from "@damc/db";
import { Hero } from "@/components/home/hero";
import { AboutTeaser } from "@/components/home/about-teaser";
import { UpcomingEvents } from "@/components/events/upcoming-events";
import { UpcomingBirthdays } from "@/components/home/upcoming-birthdays";
import { GalleryScroller } from "@/components/home/gallery-scroller";
import { LatestNews } from "@/components/home/latest-news";
import { JoinCta } from "@/components/home/join-cta";
import { withinNextDays } from "@/lib/dates";
import { buildTickerItems } from "@/lib/ticker";
import { buildCalendarEntries } from "@/lib/calendar";
import { Container, SectionHeading, Reveal, buttonVariants } from "@damc/ui";
import type { GalleryItemData } from "@/components/gallery/gallery-grid";

export const revalidate = 900;

interface HeroContent {
  heading: string;
  subheading: string;
  ctaLabel: string;
}

const FALLBACK_HERO: HeroContent = {
  heading: "Dignified Articulate Men's Club",
  subheading:
    "A private membership club in Lagos uniting accomplished men in fellowship, wealth creation and service to the community.",
  ctaLabel: "Enquire about membership",
};

interface WhoWeAreContent {
  heading: string;
  description: string;
  aims: string[];
}

const FALLBACK_WHO_WE_ARE: WhoWeAreContent = {
  heading: "A brotherhood built on dignity and purpose",
  description:
    "DAMC brings together accomplished, articulate men in Lagos for fellowship, mutual support and community impact — bound by a shared commitment to conduct, culture and each other's success.",
  aims: [
    "A non-profit making private membership organization",
    "Social and recreational facilities for all its members",
    "Co-operation with charitable organizations helping the needy and less fortunate",
    "Unity and common purpose by encouraging members on wealth creation",
    "A non-governmental organization and a pressure group",
  ],
};

export default async function HomePage() {
  const [heroContent, whoWeAreContent, heroSlides, events, members, posts, notices, eventPosts, galleryItems] =
    await Promise.all([
      prisma.siteContent.findUnique({ where: { page_section: { page: "HOME", section: "hero" } } }),
      prisma.siteContent.findUnique({ where: { page_section: { page: "HOME", section: "who-we-are" } } }),
      prisma.heroSlide.findMany({ orderBy: { order: "asc" } }),
      prisma.calendarEvent.findMany({
        where: { date: { gte: new Date() } },
        orderBy: { date: "asc" },
      }),
      prisma.member.findMany({ where: { isActive: true } }),
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 8,
      }),
      prisma.post.findMany({
        where: { status: "PUBLISHED", category: "NOTICE" },
        orderBy: { publishedAt: "desc" },
        take: 4,
      }),
      prisma.post.findMany({
        where: { status: "PUBLISHED", eventDate: { gte: new Date() } },
        select: { id: true, slug: true, title: true, excerpt: true, eventDate: true },
      }),
      prisma.galleryItem.findMany({
        orderBy: { createdAt: "desc" },
        take: 12,
        include: { photos: { orderBy: { order: "asc" } } },
      }),
    ]);

  const hero = (heroContent?.content as unknown as HeroContent) ?? FALLBACK_HERO;
  const whoWeAre = (whoWeAreContent?.content as unknown as WhoWeAreContent) ?? FALLBACK_WHO_WE_ARE;
  const birthdays = withinNextDays(members, 30).slice(0, 10);
  const calendarEntries = buildCalendarEntries({ events, members, posts: eventPosts });
  const tickerItems = buildTickerItems({ entries: calendarEntries.slice(0, 6), notices });

  return (
    <>
      <Hero
        heading={hero.heading}
        subheading={hero.subheading}
        ctaLabel={hero.ctaLabel}
        tickerItems={tickerItems}
        slides={heroSlides}
      />
      <AboutTeaser heading={whoWeAre.heading} description={whoWeAre.description} aims={whoWeAre.aims} />

      {galleryItems.length > 0 && (
        <section className="py-16 sm:py-24">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Reveal>
                <SectionHeading eyebrow="Moments" title="From our gallery" />
              </Reveal>
              <Reveal delay={0.1}>
                <Link href="/gallery" className={buttonVariants({ variant: "outline", size: "sm" })}>
                  View all
                </Link>
              </Reveal>
            </div>
          </Container>
          <div className="mt-10">
            <GalleryScroller items={galleryItems as GalleryItemData[]} />
          </div>
        </section>
      )}

      <UpcomingEvents entries={calendarEntries.slice(0, 6)} />
      <UpcomingBirthdays birthdays={birthdays} />
      <LatestNews posts={posts} />
      <JoinCta />
    </>
  );
}
