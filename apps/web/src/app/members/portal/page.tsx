import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Briefcase, Users, Calendar, Award, Shield, KeyRound, ExternalLink } from "lucide-react";
import { prisma } from "@damc/db";
import { Container, Reveal, Card, Badge, buttonVariants, cn } from "@damc/ui";
import { getMemberSession } from "@/lib/member-session";
import { logoutMember } from "@/app/members/login/actions";
import { formatMemberName, formatArticulateNumber } from "@/lib/member-name";
import { ChangePasswordForm } from "./change-password-form";

export const metadata: Metadata = {
  title: "Member Portal",
  description: "DAMC Member account area, private business directory access, and account settings.",
};

export default async function MemberPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ changePassword?: string }>;
}) {
  const session = await getMemberSession();
  if (!session) {
    redirect("/members/login?callbackUrl=/members/portal");
  }

  const { changePassword } = await searchParams;

  const member = await prisma.member.findUnique({
    where: { id: session.id },
    include: {
      businesses: true,
      executivePositions: {
        where: { isCurrent: true },
        include: { category: true },
      },
    },
  });

  if (!member || !member.isActive) {
    redirect("/members/login");
  }

  const mustChange = member.mustChangePassword || changePassword === "1";

  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-4xl">
        <Reveal>
          {/* Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/8 pb-8 dark:border-parchment/10">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="gold">DAMC Member Portal</Badge>
                {member.membershipNumber && (
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-bronze dark:text-parchment/60">
                    {formatArticulateNumber(member.membershipNumber)}
                  </span>
                )}
              </div>
              <h1 className="mt-2 font-display text-3xl font-semibold text-ink dark:text-parchment sm:text-4xl">
                Welcome, {formatMemberName(member)}
              </h1>
              <p className="mt-1 text-sm text-bronze dark:text-parchment/70">
                You have active access to the private members&rsquo; area and directory.
              </p>
            </div>

            <form action={logoutMember}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl border border-ink/12 px-4 py-2 text-xs font-semibold text-bronze transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-600 dark:border-parchment/15 dark:text-parchment/70 dark:hover:border-red-400/30 dark:hover:bg-red-400/10 dark:hover:text-red-400"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </form>
          </div>
        </Reveal>

        {/* Quick Links to Restricted / Member Content */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal delay={0.05}>
            <Link href="/directory" className="group block h-full">
              <Card className="h-full p-5 transition hover:-translate-y-1 hover:border-gold-deep/40 dark:hover:border-gold-bright/40">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15 text-gold-deep dark:bg-gold-bright/15 dark:text-gold-bright">
                    <Briefcase size={20} />
                  </div>
                  <ExternalLink size={16} className="text-bronze-soft opacity-0 transition group-hover:opacity-100" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-ink dark:text-parchment">
                  Business Directory
                </h3>
                <p className="mt-1 text-xs text-bronze dark:text-parchment/60">
                  Search fellow brothers&rsquo; registered companies and patronize member businesses.
                </p>
              </Card>
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <Link href="/members" className="group block h-full">
              <Card className="h-full p-5 transition hover:-translate-y-1 hover:border-gold-deep/40 dark:hover:border-gold-bright/40">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15 text-gold-deep dark:bg-gold-bright/15 dark:text-gold-bright">
                    <Users size={20} />
                  </div>
                  <ExternalLink size={16} className="text-bronze-soft opacity-0 transition group-hover:opacity-100" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-ink dark:text-parchment">
                  Club Members
                </h3>
                <p className="mt-1 text-xs text-bronze dark:text-parchment/60">
                  View your brothers and read full member bios now unlocked with your login.
                </p>
              </Card>
            </Link>
          </Reveal>

          <Reveal delay={0.15}>
            <Link href="/news/calendar" className="group block h-full">
              <Card className="h-full p-5 transition hover:-translate-y-1 hover:border-gold-deep/40 dark:hover:border-gold-bright/40">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15 text-gold-deep dark:bg-gold-bright/15 dark:text-gold-bright">
                    <Calendar size={20} />
                  </div>
                  <ExternalLink size={16} className="text-bronze-soft opacity-0 transition group-hover:opacity-100" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-ink dark:text-parchment">
                  Events &amp; Calendar
                </h3>
                <p className="mt-1 text-xs text-bronze dark:text-parchment/60">
                  View meetings, dues deadlines, and club celebrations.
                </p>
              </Card>
            </Link>
          </Reveal>
        </div>

        {/* Password Management Card */}
        <Reveal delay={0.2}>
          <div className="mt-10 rounded-2xl border border-ink/8 bg-white p-7 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
            <div className="flex items-center gap-2 text-ink dark:text-parchment">
              <KeyRound size={18} className="text-gold-deep dark:text-gold-bright" />
              <h2 className="font-display text-lg font-semibold">Account Security &amp; Password</h2>
            </div>
            <p className="mt-1 text-xs text-bronze dark:text-parchment/70">
              Update your chosen login password anytime. Passwords must be at least 6 characters.
            </p>

            <div className="mt-6 border-t border-ink/8 pt-6 dark:border-parchment/10">
              <ChangePasswordForm mustChange={mustChange} />
            </div>
          </div>
        </Reveal>

        {/* Public Profile View Link */}
        <Reveal delay={0.25}>
          <div className="mt-8 flex items-center justify-between rounded-xl border border-ink/8 bg-parchment/40 px-5 py-4 dark:border-parchment/10 dark:bg-ink-soft/20">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gold-deep dark:text-gold-bright">
                Your Public Profile
              </p>
              <p className="text-sm font-semibold text-ink dark:text-parchment">
                View how your profile appears to fellow members
              </p>
            </div>
            <Link
              href={`/members/${member.slug}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              View Profile &rarr;
            </Link>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
