import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Globe } from "lucide-react";
import { prisma } from "@damc/db";
import { Container, Reveal, Badge, Card, CardContent } from "@damc/ui";
import { formatMonthDay } from "@/lib/dates";
import { formatMemberName } from "@/lib/member-name";
import { MARITAL_STATUS_LABELS } from "@/lib/labels";
import { MemberPhoto } from "@/components/members/member-photo";
import { FormattedText } from "@/components/formatted-text";
import { BackLink } from "@/components/back-link";

export const revalidate = 1800;

export async function generateStaticParams() {
  const members = await prisma.member.findMany({ where: { isActive: true }, select: { slug: true } });
  return members.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = await prisma.member.findUnique({ where: { slug } });
  if (!member) return {};

  const name = formatMemberName(member);
  return {
    title: name,
    description: member.bio ?? `${name}, Dignified Articulate Men's Club member profile.`,
    openGraph: {
      title: name,
      description: member.bio ?? undefined,
      images: member.photoUrl ? [member.photoUrl] : undefined,
    },
  };
}

export default async function MemberProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { slug } = await params;
  const { from } = await searchParams;
  const member = await prisma.member.findUnique({
    where: { slug },
    include: { businesses: true },
  });

  if (!member || !member.isActive) notFound();

  const back =
    from === "executives"
      ? { href: "/executives", label: "Back to executives", canGoBack: true }
      : { href: "/members", label: "Back to members", canGoBack: from === "members" };

  const details: { label: string; value: string }[] = [];
  if (member.membershipNumber) details.push({ label: "Membership no.", value: member.membershipNumber });
  if (member.occupation) details.push({ label: "Occupation", value: member.occupation });
  if (member.stateOfOrigin) details.push({ label: "State of origin", value: member.stateOfOrigin });
  if (member.yearJoined) details.push({ label: "Year joined", value: String(member.yearJoined) });
  if (member.maritalStatus) details.push({ label: "Marital status", value: MARITAL_STATUS_LABELS[member.maritalStatus] });
  if (member.birthMonth && member.birthDay) {
    details.push({ label: "Birthday", value: formatMonthDay(member.birthMonth, member.birthDay) });
  }

  return (
    <article className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <Reveal>
          <BackLink href={back.href} label={back.label} canGoBack={back.canGoBack} />

          <div className="mt-6 flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
            <MemberPhoto photoUrl={member.photoUrl} alt={formatMemberName(member)} />
            <div>
              {member.isLegalTeam && (
                <Badge variant="ink" className="mb-2">
                  {member.legalTeamTitle || "Legal Team"}
                </Badge>
              )}
              <h1 className="text-balance font-display text-3xl font-semibold text-ink dark:text-parchment sm:text-4xl">
                {formatMemberName(member)}
              </h1>
              {member.nickname && (
                <p className="mt-1 text-lg text-bronze dark:text-parchment/60">&ldquo;{member.nickname}&rdquo;</p>
              )}
            </div>
          </div>
        </Reveal>

        {member.bio && (
          <Reveal delay={0.1}>
            <div className="mt-8">
              <FormattedText text={member.bio} className="mb-4 leading-relaxed text-ink dark:text-parchment/90 last:mb-0" />
            </div>
          </Reveal>
        )}

        {details.length > 0 && (
          <Reveal delay={0.15}>
            <div className="mt-8 grid gap-x-6 gap-y-5 border-t border-ink/8 pt-8 dark:border-parchment/10 sm:grid-cols-3">
              {details.map((d) => (
                <div key={d.label}>
                  <div className="text-xs font-bold uppercase tracking-wide text-gold-deep dark:text-gold-bright">
                    {d.label}
                  </div>
                  <div className="mt-1 text-sm text-ink dark:text-parchment/90">{d.value}</div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {member.businesses.length > 0 && (
          <Reveal delay={0.2}>
            <div className="mt-10">
              <h2 className="font-display text-xl font-semibold text-ink dark:text-parchment">
                Business{member.businesses.length > 1 ? "es" : ""}
              </h2>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                {member.businesses.map((biz) => (
                  <Card key={biz.id} className="overflow-hidden">
                    <CardContent>
                      <Badge variant="gold" className="max-w-full whitespace-normal break-words">{biz.category}</Badge>
                      <h3 className="mt-2 font-display text-lg font-semibold text-ink dark:text-parchment">
                        {biz.name}
                      </h3>
                      {biz.description && (
                        <p className="mt-2 text-sm text-bronze dark:text-parchment/70">{biz.description}</p>
                      )}
                      {biz.website && (
                        <a
                          href={biz.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep hover:underline dark:text-gold-bright"
                        >
                          <Globe size={14} /> Visit website
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </Container>
    </article>
  );
}
