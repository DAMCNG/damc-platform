import type { Metadata } from "next";
import { prisma } from "@damc/db";
import { Container, Reveal } from "@damc/ui";
import { MemberDirectory, type MemberCardData } from "@/components/members/member-directory";
import { LegalTeamSection, type LegalTeamMemberData } from "@/components/members/legal-team-section";

export const metadata: Metadata = {
  title: "Members",
  description: "Search the Dignified Articulate Men's Club membership directory by name or business.",
};

export const revalidate = 1800;

export default async function MembersPage() {
  const [legalTeam, members] = await Promise.all([
    prisma.member.findMany({
      where: { isActive: true, isLegalTeam: true },
      orderBy: { firstName: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        legalTeamTitle: true,
      },
    }),
    prisma.member.findMany({
      where: { isActive: true, isLegalTeam: false },
      orderBy: { firstName: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        birthMonth: true,
        birthDay: true,
        businesses: { select: { name: true, category: true } },
      },
    }),
  ]);

  const total = legalTeam.length + members.length;

  return (
    <>
      <section className="border-b border-ink/8 bg-parchment/60 py-20 dark:border-parchment/10 dark:bg-ink-soft/30 sm:py-28">
        <Container className="max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
              Our people
            </span>
            <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-ink dark:text-parchment sm:text-5xl">
              Members
            </h1>
            <p className="mt-5 text-lg text-bronze dark:text-parchment/70">
              {total} dignified, articulate men — search by name, trade or industry.
            </p>
          </Reveal>
        </Container>
      </section>

      <LegalTeamSection members={legalTeam as LegalTeamMemberData[]} />

      <section className="py-20 sm:py-28">
        <Container>
          <MemberDirectory members={members as MemberCardData[]} />
        </Container>
      </section>
    </>
  );
}
