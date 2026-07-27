import Link from "next/link";
import { Plus, Search, Pencil } from "lucide-react";
import { prisma } from "@damc/db";
import { PageHeader } from "@/components/page-header";
import { AdminTable, AdminTableHead, AdminTableBody, Th, Td, EmptyState } from "@/components/admin-table";
import { Badge } from "@damc/ui";
import { formatMonthDay } from "@/lib/dates";
import { deleteMember } from "./actions";
import { DeleteButton } from "@/components/delete-button";

export const dynamic = "force-dynamic";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const members = await prisma.member.findMany({
    where: q
      ? {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            {
              businesses: {
                some: {
                  OR: [
                    { name: { contains: q, mode: "insensitive" } },
                    { category: { contains: q, mode: "insensitive" } },
                  ],
                },
              },
            },
          ],
        }
      : undefined,
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

      <form className="relative mb-5 max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bronze-soft" size={16} />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by name or business…"
          className="w-full rounded-full border border-ink/12 bg-white py-2 pl-10 pr-4 text-sm text-ink outline-none focus:border-gold-deep dark:border-parchment/15 dark:bg-ink-soft/40 dark:text-parchment"
        />
      </form>

      <AdminTable>
        <AdminTableHead>
          <Th>Member</Th>
          <Th>Business</Th>
          <Th>Birthday</Th>
          <Th>Status</Th>
          <Th className="text-right">Actions</Th>
        </AdminTableHead>
        <AdminTableBody>
          {members.length === 0 && <EmptyState message="No members found." />}
          {members.map((member) => (
            <tr key={member.id}>
              <Td>
                <div className="flex items-center gap-2.5">
                  <img
                    src={member.photoUrl ?? "/placeholders/member-avatar.svg"}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="font-medium">{member.firstName} {member.lastName}</span>
                </div>
              </Td>
              <Td className="text-bronze dark:text-parchment/60">
                {member.businesses.length > 0 ? member.businesses.map((b) => b.category).join(", ") : "—"}
              </Td>
              <Td className="text-bronze dark:text-parchment/60">
                {member.birthMonth && member.birthDay ? formatMonthDay(member.birthMonth, member.birthDay) : "—"}
              </Td>
              <Td>
                <Badge variant={member.isActive ? "success" : "ink"}>{member.isActive ? "Active" : "Inactive"}</Badge>
              </Td>
              <Td>
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/members/${member.id}`}
                    aria-label="Edit"
                    className="rounded-lg p-1.5 text-bronze transition-colors hover:bg-gold/10 hover:text-gold-deep dark:text-parchment/60 dark:hover:text-gold-bright"
                  >
                    <Pencil size={16} />
                  </Link>
                  <form action={deleteMember}>
                    <input type="hidden" name="id" value={member.id} />
                    <DeleteButton confirmMessage={`Remove ${member.firstName} ${member.lastName}? This cannot be undone.`} />
                  </form>
                </div>
              </Td>
            </tr>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
