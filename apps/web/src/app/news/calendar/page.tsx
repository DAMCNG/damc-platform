import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@damc/db";
import { Container, Reveal, buttonVariants } from "@damc/ui";
import { CalendarList } from "@/components/news/calendar-list";
import { buildCalendarEntries } from "@/lib/calendar";

export const metadata: Metadata = {
  title: "Club Calendar",
  description: "Upcoming meetings, dues deadlines, holidays and member birthdays in chronological order.",
};

export const revalidate = 900;

export default async function NewsCalendarPage() {
  const [events, members] = await Promise.all([
    prisma.calendarEvent.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: "asc" },
    }),
    prisma.member.findMany({
      where: { isActive: true },
      select: { id: true, firstName: true, lastName: true, birthMonth: true, birthDay: true },
    }),
  ]);

  const entries = buildCalendarEntries({ events, members, daysAhead: 180 });

  return (
    <>
      <section className="border-b border-ink/8 bg-parchment/60 py-20 dark:border-parchment/10 dark:bg-ink-soft/30 sm:py-28">
        <Container className="max-w-2xl text-center">
          <Reveal>
            <Link href="/news" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              <ArrowLeft size={16} className="mr-1.5" /> Back to news
            </Link>
            <span className="mt-6 block text-xs font-bold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
              Plan ahead
            </span>
            <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-ink dark:text-parchment sm:text-5xl">
              Club Calendar
            </h1>
            <p className="mt-5 text-lg text-bronze dark:text-parchment/70">
              Every meeting, deadline, celebration and birthday coming up over the next six months.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="max-w-2xl">
          <CalendarList entries={entries} />
        </Container>
      </section>
    </>
  );
}
