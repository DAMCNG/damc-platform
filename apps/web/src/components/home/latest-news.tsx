import Link from "next/link";
import { Eye, Heart } from "lucide-react";
import { Container, SectionHeading, Reveal, Card, Badge, buttonVariants, AutoScrollRow, ImageWithSkeleton } from "@damc/ui";
import { formatEventDate } from "@/lib/dates";
import { optimizedImageUrl } from "@/lib/cloudinary";
import type { Post } from "@damc/db";

export function LatestNews({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-parchment/60 py-16 dark:bg-ink-soft/30 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading
              eyebrow="Latest from the club"
              title="News, announcements & notices"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/news" className={buttonVariants({ variant: "outline", size: "sm" })}>
              View all
            </Link>
          </Reveal>
        </div>
      </Container>
      <div className="mt-10 px-6 lg:px-8">
        <AutoScrollRow ariaLabel="Latest news and announcements">
          {posts.map((post) => (
            <Link key={post.id} href={`/news/${post.slug}`} className="block w-72 flex-shrink-0">
              <Card className="h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                <div className="relative h-36 w-full overflow-hidden">
                  <ImageWithSkeleton
                    src={optimizedImageUrl(post.coverImageUrl ?? "/placeholders/post-cover.svg", 576)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <Badge variant="gold">{post.category}</Badge>
                  <h3 className="mt-2.5 font-display text-base font-semibold leading-snug text-ink dark:text-parchment">
                    {post.title}
                  </h3>
                  {post.publishedAt && (
                    <p className="mt-1 text-xs text-bronze dark:text-parchment/60">
                      {formatEventDate(post.publishedAt)}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-4 text-xs text-bronze dark:text-parchment/60">
                    <span className="flex items-center gap-1"><Eye size={13} /> {post.views}</span>
                    <span className="flex items-center gap-1"><Heart size={13} /> {post.likes}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </AutoScrollRow>
      </div>
    </section>
  );
}
