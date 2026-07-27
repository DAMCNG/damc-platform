import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@damc/db";
import { PageHeader } from "@/components/page-header";
import { AdminTable, AdminTableHead, AdminTableBody, Th, Td, EmptyState } from "@/components/admin-table";
import { DeleteButton } from "@/components/delete-button";
import { RosterForm } from "@/components/roster/roster-form";
import { formatEventDate } from "@/lib/dates";
import { createRosterEntry, deleteRosterEntry } from "./actions";

export const dynamic = "force-dynamic";

export default async function RosterPage() {
  const [entries, members] = await Promise.all([
    prisma.rosterEntry.findMany({ include: { hosts: true }, orderBy: { meetingDate: "asc" } }),
    prisma.member.findMany({ where: { isActive: true }, orderBy: { firstName: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Roster of meeting hosts"
        description="Pick 3-4 members to co-host each meeting — chosen from the existing Members list, so there's nothing to re-upload."
      />

      <div className="mb-6">
        <RosterForm members={members} action={createRosterEntry} />
      </div>

      <AdminTable>
        <AdminTableHead>
          <Th>Date</Th>
          <Th>Hosts</Th>
          <Th>Notes</Th>
          <Th className="text-right">Actions</Th>
        </AdminTableHead>
        <AdminTableBody>
          {entries.length === 0 && <EmptyState message="No roster entries yet." />}
          {entries.map((entry) => (
            <tr key={entry.id}>
              <Td className="font-medium">{formatEventDate(entry.meetingDate)}</Td>
              <Td>{entry.hosts.map((h) => `${h.firstName} ${h.lastName}`).join(", ") || "—"}</Td>
              <Td className="text-bronze dark:text-parchment/60">{entry.notes ?? "—"}</Td>
              <Td>
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/roster/${entry.id}`}
                    aria-label="Edit"
                    className="rounded-lg p-1.5 text-bronze transition-colors hover:bg-gold/10 hover:text-gold-deep dark:text-parchment/60 dark:hover:text-gold-bright"
                  >
                    <Pencil size={16} />
                  </Link>
                  <form action={deleteRosterEntry}>
                    <input type="hidden" name="id" value={entry.id} />
                    <DeleteButton confirmMessage="Remove this roster entry?" />
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
