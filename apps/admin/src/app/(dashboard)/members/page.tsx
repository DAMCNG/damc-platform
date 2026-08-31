import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@damc/db";
import { PageHeader } from "@/components/page-header";
import { MembersTable, type MemberRowData } from "@/components/members/members-table";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const members = await prisma.member.findMany({
    orderBy: { firstName: "asc" },
    include: { businesses: true },
  });

  return (
    <div>
      <PageHeader
        title="Members"
        description={`${members.length} member${members.length === 1 ? "" : "s"}`}
        action={
          <Link
            href="/members/new"
            className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
          >
            <Plus size={16} /> Add member
          </Link>
        }
      />

      <MembersTable members={members as MemberRowData[]} />
    </div>
  );
}
