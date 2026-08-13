import Link from "next/link";
import { Container, SectionHeading, Reveal, Card, ImageWithSkeleton, Badge } from "@damc/ui";
import { optimizedImageUrl } from "@/lib/cloudinary";
import { formatMemberName } from "@/lib/member-name";

export interface LegalTeamMemberData {
  id: string;
  slug: string;
  title: string | null;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  legalTeamTitle: string | null;
}

export function LegalTeamSection({ members }: { members: LegalTeamMemberData[] }) {
  if (members.length === 0) return null;

  return (
    <section className="border-b border-ink/8 bg-parchment/60 py-20 dark:border-parchment/10 dark:bg-ink-soft/30 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Counsel" title="Legal Team" align="center" />
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.05}>
              <Link href={`/members/${member.slug}`}>
                <Card className="overflow-hidden text-center transition-transform duration-300 hover:-translate-y-1">
                  <div className="relative aspect-square w-full overflow-hidden">
                    <ImageWithSkeleton
                      src={optimizedImageUrl(member.photoUrl ?? "/placeholders/member-avatar.svg", 700)}
                      alt={formatMemberName(member)}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <Badge variant="ink">{member.legalTeamTitle || "Legal Team"}</Badge>
                    <div className="mt-2 font-display text-lg font-semibold text-ink dark:text-parchment">
                      {formatMemberName(member)}
                    </div>
                  </div>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
