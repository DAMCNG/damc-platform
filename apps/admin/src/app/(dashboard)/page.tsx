import Link from "next/link";
import { Users, Inbox, Newspaper, Images, Eye, Heart, ArrowRight } from "lucide-react";
import { prisma } from "@damc/db";
import { Badge } from "@damc/ui";
import { auth } from "@/lib/auth";
import { canSeeAnalytics, canSeeEnquiries } from "@/lib/permissions";
import { MetricCard } from "@/components/metric-card";
import { formatEventDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

const ENQUIRY_BADGE: Record<string, "gold" | "warning" | "success"> = {
  NEW: "gold",
  IN_PROGRESS: "warning",
  RESOLVED: "success",
};

export default async function DashboardHomePage() {
  const session = await auth();
  const user = session!.user;

  const showAnalytics = canSeeAnalytics(user);
  const showEnquiries = canSeeEnquiries(user);

  const [memberCount, openEnquiryCount, publishedPostCount, galleryCount, topPosts, recentEnquiries] =
    await Promise.all([
      prisma.member.count({ where: { isActive: true } }),
      prisma.enquiry.count({ where: { status: { not: "RESOLVED" } } }),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.galleryItem.count(),
      showAnalytics
        ? prisma.post.findMany({ orderBy: { views: "desc" }, take: 5 })
        : Promise.resolve([]),
      showEnquiries
        ? prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
        : Promise.resolve([]),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-parchment">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-bronze dark:text-parchment/60">
          Here's what's happening on the DAMC website.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Active members" value={memberCount} icon={Users} />
        <MetricCard label="Open enquiries" value={openEnquiryCount} icon={Inbox} />
        <MetricCard label="Published posts" value={publishedPostCount} icon={Newspaper} />
        <MetricCard label="Gallery items" value={galleryCount} icon={Images} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {showAnalytics && (
          <div className="rounded-xl2 border border-ink/8 bg-white p-5 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-ink dark:text-parchment">Top posts</h2>
              <Link href="/news" className="flex items-center gap-1 text-xs font-semibold text-gold-deep hover:underline dark:text-gold-bright">
                Manage <ArrowRight size={12} />
              </Link>
            </div>
            {topPosts.length === 0 ? (
              <p className="text-sm text-bronze dark:text-parchment/60">No posts published yet.</p>
            ) : (
              <ul className="space-y-3">
                {topPosts.map((post) => (
                  <li key={post.id} className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm text-ink dark:text-parchment/90">{post.title}</span>
                    <span className="flex flex-shrink-0 items-center gap-3 text-xs text-bronze dark:text-parchment/60">
                      <span className="flex items-center gap-1"><Eye size={13} /> {post.views}</span>
                      <span className="flex items-center gap-1"><Heart size={13} /> {post.likes}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {showEnquiries && (
          <div className="rounded-xl2 border border-ink/8 bg-white p-5 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-ink dark:text-parchment">Recent enquiries</h2>
              <Link href="/enquiries" className="flex items-center gap-1 text-xs font-semibold text-gold-deep hover:underline dark:text-gold-bright">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {recentEnquiries.length === 0 ? (
              <p className="text-sm text-bronze dark:text-parchment/60">No enquiries yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentEnquiries.map((enquiry) => (
                  <li key={enquiry.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-ink dark:text-parchment/90">{enquiry.name}</div>
                      <div className="text-xs text-bronze dark:text-parchment/60">{formatEventDate(enquiry.createdAt)}</div>
                    </div>
                    <Badge variant={ENQUIRY_BADGE[enquiry.status]}>{enquiry.status.replace("_", " ")}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
