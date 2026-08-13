import type { Metadata } from "next";
import { prisma } from "@damc/db";
import { Container, Reveal } from "@damc/ui";
import { BusinessDirectory, type BusinessCardData } from "@/components/directory/business-directory";

export const metadata: Metadata = {
  title: "Business Directory",
  description: "Search DAMC members' businesses by trade or industry and support a fellow member.",
};

export const revalidate = 1800;

export default async function DirectoryPage() {
  const businesses = await prisma.business.findMany({
    where: { member: { isActive: true } },
    orderBy: { category: "asc" },
    include: {
      member: {
        select: { firstName: true, lastName: true, photoUrl: true, whatsapp: true },
      },
    },
  });

  return (
    <>
      <section className="border-b border-ink/8 bg-parchment/60 py-20 dark:border-parchment/10 dark:bg-ink-soft/30 sm:py-28">
        <Container className="max-w-2xl text-center">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
              Support one another
            </span>
            <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-ink dark:text-parchment sm:text-5xl">
              Business Directory
            </h1>
            <p className="mt-5 text-lg text-bronze dark:text-parchment/70">
              Every listing here belongs to a DAMC member, and some members run more than
              one. Search by trade and patronize your brother first.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <BusinessDirectory businesses={businesses as BusinessCardData[]} />
        </Container>
      </section>
    </>
  );
}
