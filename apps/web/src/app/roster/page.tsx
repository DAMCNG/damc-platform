import type { Metadata } from "next";
import { prisma } from "@damc/db";
import { Container, Reveal, Badge, ImageWithSkeleton } from "@damc/ui";
import { formatEventDate } from "@/lib/dates";
import { optimizedImageUrl } from "@/lib/cloudinary";

export const metadata: Metadata = {
  title: "Roster of Meeting Hosts",
  description: "See who is hosting each upcoming DAMC general meeting.",
};

export const revalidate = 1800;

export default async function RosterPage() {
  const entries = await prisma.rosterEntry.findMany({
    where: { meetingDate: { gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } },
    include: { hosts: true },
    orderBy: { meetingDate: "asc" },
  });

  const today = new Date();
  const nextIndex = entries.findIndex((e) => e.meetingDate >= today);

  return (
    <>
      <section className="border-b border-ink/8 bg-parchment/60 py-20 dark:border-parchment/10 dark:bg-ink-soft/30 sm:py-28">
        <Container className="max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
              Meeting hosts
            </span>
            <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-ink dark:text-parchment sm:text-5xl">
              Roster of Meeting Hosts
            </h1>
            <p className="mt-5 text-lg text-bronze dark:text-parchment/70">
              Every member takes a turn hosting, with dates published well in advance.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="max-w-2xl">
          {entries.length === 0 ? (
            <p className="text-center text-bronze dark:text-parchment/70">
              The roster will appear here once dates are assigned in the admin dashboard.
            </p>
          ) : (
            <ol className="divide-y divide-ink/8 dark:divide-parchment/10">
              {entries.map((entry, i) => (
                <Reveal key={entry.id} delay={Math.min(i, 8) * 0.05}>
                  <li className="flex items-center justify-between gap-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-shrink-0 -space-x-3">
                        {entry.hosts.map((host) => (
                          <span
                            key={host.id}
                            className="relative block h-12 w-12 overflow-hidden rounded-full border-2 border-parchment-paper dark:border-ink"
                          >
                            <ImageWithSkeleton
                              src={optimizedImageUrl(host.photoUrl ?? "/placeholders/member-avatar.svg", 120)}
                              alt=""
                              title={`${host.firstName} ${host.lastName}`}
                              className="h-full w-full object-cover"
                            />
                          </span>
                        ))}
                      </div>
                      <div>
                        <div className="font-display font-semibold text-ink dark:text-parchment">
                          {entry.hosts.map((h) => `${h.firstName} ${h.lastName}`).join(", ")}
                        </div>
                        {entry.notes && (
                          <div className="text-xs text-bronze dark:text-parchment/60">{entry.notes}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-3">
                      {i === nextIndex && <Badge variant="gold">Next</Badge>}
                      <span className="text-sm font-medium text-ink dark:text-parchment/90">
                        {formatEventDate(entry.meetingDate)}
                      </span>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          )}
        </Container>
      </section>
    </>
  );
}
