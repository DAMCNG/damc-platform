import { notFound } from "next/navigation";
import { prisma } from "@damc/db";
import { PageHeader } from "@/components/page-header";
import { RosterForm } from "@/components/roster/roster-form";
import { updateRosterEntry } from "../actions";

export default async function EditRosterEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [entry, members] = await Promise.all([
    prisma.rosterEntry.findUnique({ where: { id }, include: { hosts: true } }),
    prisma.member.findMany({ where: { isActive: true }, orderBy: { firstName: "asc" } }),
  ]);
  if (!entry) notFound();

  return (
    <div>
      <PageHeader title="Edit roster entry" />
      <RosterForm entry={entry} members={members} action={updateRosterEntry} />
    </div>
  );
}
