import Link from "next/link";
import { Container, SectionHeading, Reveal, AutoScrollRow, ImageWithSkeleton } from "@damc/ui";
import { formatMonthDay } from "@/lib/dates";
import { optimizedImageUrl } from "@/lib/cloudinary";
import type { Member } from "@damc/db";

export function UpcomingBirthdays({
  birthdays,
}: {
  birthdays: { member: Member; daysUntil: number }[];
}) {
  if (birthdays.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Celebrating our own"
            title="Upcoming birthdays"
            description="A little advance notice so the club can celebrate together."
          />
        </Reveal>
      </Container>
      <div className="mt-10 px-6 lg:px-8">
        <AutoScrollRow ariaLabel="Upcoming birthdays" gapClassName="gap-6">
          {birthdays.map(({ member, daysUntil }) => (
            <Link key={member.id} href="/members" className="flex w-36 flex-shrink-0 flex-col items-center text-center">
              <div className="relative h-20 w-20 overflow-hidden rounded-full ring-4 ring-gold/25 transition-transform duration-300 hover:scale-105">
                <ImageWithSkeleton
                  src={optimizedImageUrl(member.photoUrl ?? "/placeholders/member-avatar.svg", 180)}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-3 text-sm font-semibold text-ink dark:text-parchment">
                {member.firstName} {member.lastName}
              </div>
              <div className="text-xs text-gold-deep dark:text-gold-bright">
                {formatMonthDay(member.birthMonth!, member.birthDay!)}
                {daysUntil === 0 ? " · Today" : ""}
              </div>
            </Link>
          ))}
        </AutoScrollRow>
      </div>
    </section>
  );
}
