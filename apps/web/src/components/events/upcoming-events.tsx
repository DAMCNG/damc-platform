import Link from "next/link";
import { Calendar, PartyPopper, Wallet, Cake, Sparkles, Star, type LucideIcon } from "lucide-react";
import { Container, SectionHeading, Reveal, Card, CardContent, AutoScrollRow, buttonVariants } from "@damc/ui";
import { formatEventDate } from "@/lib/dates";
import type { CalendarEntry } from "@/lib/calendar";

const ICONS: Record<CalendarEntry["type"], LucideIcon> = {
  MEETING: Calendar,
  HOLIDAY: PartyPopper,
  DUES: Wallet,
  BIRTHDAY: Cake,
  OTHER: Star,
  EVENT: Sparkles,
};

export function UpcomingEvents({ entries }: { entries: CalendarEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <section className="bg-parchment/60 py-16 dark:bg-ink-soft/30 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading
              eyebrow="What's next"
              title="Upcoming on the club calendar"
              description="Meetings, dues deadlines and celebrations, planned well in advance so no member is caught unaware."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/news/calendar" className={buttonVariants({ variant: "outline", size: "sm" })}>
              View full calendar
            </Link>
          </Reveal>
        </div>
      </Container>
      <div className="mt-10 px-6 lg:px-8">
        <AutoScrollRow ariaLabel="Upcoming events">
          {entries.map((entry) => {
            const Icon = ICONS[entry.type] ?? Star;
            return (
              <Link key={entry.id} href={entry.href ?? "/news/calendar"} className="block w-72 flex-shrink-0">
                <Card className="h-full transition-transform duration-300 hover:-translate-y-1">
                  <CardContent className="flex h-full flex-col gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold-deep dark:bg-gold-bright/15 dark:text-gold-bright">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-gold-deep dark:text-gold-bright">
                        {formatEventDate(entry.date)}
                      </div>
                      <h3 className="mt-1.5 font-display text-lg font-semibold text-ink dark:text-parchment">
                        {entry.title}
                      </h3>
                      {entry.description && (
                        <p className="mt-1.5 text-sm text-bronze dark:text-parchment/70">{entry.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </AutoScrollRow>
      </div>
    </section>
  );
}
