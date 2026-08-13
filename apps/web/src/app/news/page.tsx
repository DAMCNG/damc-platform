import type { Metadata } from "next";
import Link from "next/link";
import { Eye, Heart } from "lucide-react";
import { prisma } from "@damc/db";
import type { PostCategory } from "@damc/db";
import { Container, SectionHeading, Reveal, Card, Badge, cn, ImageWithSkeleton } from "@damc/ui";
import { UpcomingEvents } from "@/components/events/upcoming-events";
import { formatEventDate } from "@/lib/dates";
import { optimizedImageUrl } from "@/lib/cloudinary";
import { POST_CATEGORY_LABELS } from "@/lib/labels";
import { postCoverImage } from "@/lib/post-cover";
import { buildCalendarEntries } from "@/lib/calendar";

export const metadata: Metadata = {
  title: "News, Blog & Announcements",
  description: "Vital notices, announcements, editorials and the DAMC events calendar.",
};

export const revalidate = 900;

const CATEGORIES: PostCategory[] = ["NEWS", "ANNOUNCEMENT", "EDITORIAL", "NOTICE", "EVENTS"];

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = CATEGORIES.includes(category as PostCategory) ? (category as PostCategory) : undefined;

  const [events, members, eventPosts, posts] = await Promise.all([
    prisma.calendarEvent.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: "asc" },
    }),
    prisma.member.findMany({
      where: { isActive: true },
      select: { id: true, firstName: true, lastName: true, birthMonth: true, birthDay: true },
    }),
    prisma.post.findMany({
      where: { status: "PUBLISHED", eventDate: { gte: new Date() } },
      select: { id: true, slug: true, title: true, excerpt: true, eventDate: true },
    }),
    prisma.post.findMany({
      where: { status: "PUBLISHED", ...(activeCategory ? { category: activeCategory } : {}) },
      orderBy: { publishedAt: "desc" },
      include: { photos: { orderBy: { order: "asc" }, take: 1 } },
    }),
  ]);

  const calendarEntries = buildCalendarEntries({ events, members, posts: eventPosts }).slice(0, 6);

  return (
    <>
      <section className="border-b border-ink/8 bg-parchment/60 py-20 dark:border-parchment/10 dark:bg-ink-soft/30 sm:py-28">
        <Container className="max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
              Stay informed
            </span>
            <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-ink dark:text-parchment sm:text-5xl">
              News &amp; Announcements
            </h1>
            <p className="mt-5 text-lg text-bronze dark:text-parchment/70">
              Editorials, vital notices and the club's calendar, all in one place.
            </p>
          </Reveal>
        </Container>
      </section>

      <UpcomingEvents entries={calendarEntries} />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <SectionHeading eyebrow="The feed" title="Posts" />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/news"
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                    !activeCategory
                      ? "border-gold-deep bg-gold/15 text-gold-deep dark:border-gold-bright dark:bg-gold-bright/15 dark:text-gold-bright"
                      : "border-ink/12 text-bronze hover:border-gold-deep dark:border-parchment/15 dark:text-parchment/70"
                  )}
                >
                  All
                </Link>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/news?category=${cat}`}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                      activeCategory === cat
                        ? "border-gold-deep bg-gold/15 text-gold-deep dark:border-gold-bright dark:bg-gold-bright/15 dark:text-gold-bright"
                        : "border-ink/12 text-bronze hover:border-gold-deep dark:border-parchment/15 dark:text-parchment/70"
                    )}
                  >
                    {POST_CATEGORY_LABELS[cat]}
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>

          {posts.length === 0 ? (
            <p className="mt-12 text-center text-bronze dark:text-parchment/70">
              No posts in this category yet.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={Math.min(i, 6) * 0.06}>
                  <Link href={`/news/${post.slug}`}>
                    <Card className="h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                      <div className="relative h-44 w-full overflow-hidden">
                        <ImageWithSkeleton
                          src={optimizedImageUrl(postCoverImage(post), 700)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <Badge variant="gold">{POST_CATEGORY_LABELS[post.category]}</Badge>
                        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink dark:text-parchment">
                          {post.title}
                        </h3>
                        <p className="mt-1 text-xs text-bronze dark:text-parchment/60">
                          {post.authorName}
                          {post.publishedAt ? ` · ${formatEventDate(post.publishedAt)}` : ""}
                        </p>
                        <div className="mt-4 flex items-center gap-4 text-xs text-bronze dark:text-parchment/60">
                          <span className="flex items-center gap-1"><Eye size={14} /> {post.views}</span>
                          <span className="flex items-center gap-1"><Heart size={14} /> {post.likes}</span>
                        </div>
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
