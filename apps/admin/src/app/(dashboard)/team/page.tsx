import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@damc/db";
import { Badge } from "@damc/ui";
import { auth } from "@/lib/auth";
import { isSuperAdmin } from "@/lib/permissions";
import { PageHeader } from "@/components/page-header";
import { AdminTable, AdminTableHead, AdminTableBody, Th, Td, EmptyState } from "@/components/admin-table";
import { formatEventDate } from "@/lib/dates";
import { toggleTeamMemberStatus } from "./actions";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const session = await auth();
  const currentUser = session!.user;
  if (!isSuperAdmin(currentUser)) redirect("/");

  const members = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <PageHeader
        title="Team"
        description="Manage who has access to this admin dashboard and what they can do."
        action={
          <Link href="/team/new" className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright">
            <Plus size={16} /> Add team member
          </Link>
        }
      />

      <AdminTable>
        <AdminTableHead>
          <Th>Name</Th>
          <Th>Email</Th>
          <Th>Role</Th>
          <Th>Last active</Th>
          <Th>Status</Th>
          <Th className="text-right">Actions</Th>
        </AdminTableHead>
        <AdminTableBody>
          {members.length === 0 && <EmptyState message="No team members yet." />}
          {members.map((member) => (
            <tr key={member.id}>
              <Td className="font-medium">
                {member.name}
                {member.id === currentUser.id && <span className="ml-1.5 text-xs text-bronze-soft dark:text-parchment/40">(you)</span>}
              </Td>
              <Td className="text-bronze dark:text-parchment/60">{member.email}</Td>
              <Td>
                <Badge variant={member.role === "SUPER_ADMIN" ? "gold" : "ink"}>
                  {member.role === "SUPER_ADMIN" ? "Super Admin" : "Content Manager"}
                </Badge>
              </Td>
              <Td className="text-bronze dark:text-parchment/60">
                {member.lastActiveAt ? formatEventDate(member.lastActiveAt) : "Never"}
              </Td>
              <Td>
                <Badge variant={member.status === "ACTIVE" ? "success" : "ink"}>{member.status}</Badge>
              </Td>
              <Td>
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/team/${member.id}`} aria-label="Edit" className="rounded-lg p-1.5 text-bronze transition-colors hover:bg-gold/10 hover:text-gold-deep dark:text-parchment/60 dark:hover:text-gold-bright">
                    <Pencil size={16} />
                  </Link>
                  {member.id !== currentUser.id && (
                    <form action={toggleTeamMemberStatus}>
                      <input type="hidden" name="id" value={member.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-ink/12 px-3 py-1.5 text-xs font-semibold text-bronze transition-colors hover:border-red-300 hover:text-red-600 dark:border-parchment/15 dark:text-parchment/60"
                      >
                        {member.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
