import Link from "next/link";
import { redirect } from "next/navigation";
import { Archive, ArchiveRestore } from "lucide-react";
import { prisma } from "@damc/db";
import { Badge, cn } from "@damc/ui";
import { auth } from "@/lib/auth";
import { canAssignEnquiries, canSeeEnquiries } from "@/lib/permissions";
import { PageHeader } from "@/components/page-header";
import { AdminTable, AdminTableHead, AdminTableBody, Th, Td, EmptyState } from "@/components/admin-table";
import { AutoSubmitSelect } from "@/components/auto-submit-select";
import { DeleteButton } from "@/components/delete-button";
import { formatDateTime } from "@/lib/dates";
import { updateEnquiryStatus, assignEnquiry, archiveEnquiry, unarchiveEnquiry, deleteEnquiry } from "./actions";

export const dynamic = "force-dynamic";

const STATUSES = ["NEW", "IN_PROGRESS", "RESOLVED"] as const;
const STATUS_BADGE: Record<string, "gold" | "warning" | "success"> = {
  NEW: "gold",
  IN_PROGRESS: "warning",
  RESOLVED: "success",
};

const selectClass =
  "rounded-lg border border-ink/12 bg-white px-2.5 py-1.5 text-xs text-ink outline-none dark:border-parchment/15 dark:bg-ink-soft/40 dark:text-parchment";

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const session = await auth();
  const user = session!.user;
  if (!canSeeEnquiries(user)) redirect("/");

  const canAssign = canAssignEnquiries(user);
  const { view } = await searchParams;
  const showArchived = view === "archived";

  const [enquiries, admins] = await Promise.all([
    prisma.enquiry.findMany({
      where: { archived: showArchived },
      include: { assignedTo: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.adminUser.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader title="Enquiries" description={`${enquiries.length} ${showArchived ? "archived" : "in inbox"}`} />

      <div className="mb-5 flex gap-2">
        <Link
          href="/enquiries"
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
            !showArchived
              ? "border-gold-deep bg-gold/15 text-gold-deep dark:border-gold-bright dark:bg-gold-bright/15 dark:text-gold-bright"
              : "border-ink/12 text-bronze hover:border-gold-deep dark:border-parchment/15 dark:text-parchment/70"
          )}
        >
          Inbox
        </Link>
        <Link
          href="/enquiries?view=archived"
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
            showArchived
              ? "border-gold-deep bg-gold/15 text-gold-deep dark:border-gold-bright dark:bg-gold-bright/15 dark:text-gold-bright"
              : "border-ink/12 text-bronze hover:border-gold-deep dark:border-parchment/15 dark:text-parchment/70"
          )}
        >
          Archived
        </Link>
      </div>

      <AdminTable>
        <AdminTableHead>
          <Th>From</Th>
          <Th>Message</Th>
          <Th>Received</Th>
          <Th>Status</Th>
          <Th>Assigned to</Th>
          <Th className="text-right">Actions</Th>
        </AdminTableHead>
        <AdminTableBody>
          {enquiries.length === 0 && <EmptyState message={showArchived ? "No archived enquiries." : "No enquiries yet."} />}
          {enquiries.map((enquiry) => {
            const unread = !enquiry.readAt;
            return (
              <tr key={enquiry.id}>
                <Td>
                  <Link href={`/enquiries/${enquiry.id}`} className="block hover:underline">
                    <div className={cn(unread ? "font-bold text-ink dark:text-parchment" : "font-medium text-bronze dark:text-parchment/70")}>
                      {enquiry.name}
                    </div>
                    <div className="text-xs text-bronze dark:text-parchment/60">{enquiry.email}</div>
                  </Link>
                </Td>
                <Td className="max-w-xs">
                  <Link href={`/enquiries/${enquiry.id}`} className="block hover:underline">
                    {enquiry.subject && (
                      <div className={unread ? "font-bold text-ink dark:text-parchment" : "font-medium text-bronze dark:text-parchment/80"}>
                        {enquiry.subject}
                      </div>
                    )}
                    <div className={cn("truncate", unread ? "text-ink/80 dark:text-parchment/80" : "text-bronze dark:text-parchment/50")}>
                      {enquiry.message}
                    </div>
                  </Link>
                </Td>
                <Td className="text-bronze dark:text-parchment/60">{formatDateTime(enquiry.createdAt)}</Td>
                <Td>
                  {canAssign ? (
                    <form action={updateEnquiryStatus}>
                      <input type="hidden" name="id" value={enquiry.id} />
                      <AutoSubmitSelect name="status" defaultValue={enquiry.status} className={selectClass}>
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s.replace("_", " ")}</option>
                        ))}
                      </AutoSubmitSelect>
                    </form>
                  ) : (
                    <Badge variant={STATUS_BADGE[enquiry.status]}>{enquiry.status.replace("_", " ")}</Badge>
                  )}
                </Td>
                <Td>
                  {canAssign ? (
                    <form action={assignEnquiry}>
                      <input type="hidden" name="id" value={enquiry.id} />
                      <AutoSubmitSelect name="assignedToId" defaultValue={enquiry.assignedToId ?? ""} className={selectClass}>
                        <option value="">Unassigned</option>
                        {admins.map((a) => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </AutoSubmitSelect>
                    </form>
                  ) : (
                    <span className="text-bronze dark:text-parchment/60">{enquiry.assignedTo?.name ?? "Unassigned"}</span>
                  )}
                </Td>
                <Td>
                  {canAssign && (
                    <div className="flex items-center justify-end gap-1">
                      <form action={showArchived ? unarchiveEnquiry : archiveEnquiry}>
                        <input type="hidden" name="id" value={enquiry.id} />
                        <button
                          type="submit"
                          aria-label={showArchived ? "Restore to inbox" : "Archive"}
                          className="rounded-lg p-1.5 text-bronze transition-colors hover:bg-gold/10 hover:text-gold-deep dark:text-parchment/60 dark:hover:text-gold-bright"
                        >
                          {showArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                        </button>
                      </form>
                      <form action={deleteEnquiry}>
                        <input type="hidden" name="id" value={enquiry.id} />
                        <input type="hidden" name="view" value={showArchived ? "archived" : ""} />
                        <DeleteButton confirmMessage={`Delete the enquiry from ${enquiry.name}?`} />
                      </form>
                    </div>
                  )}
                </Td>
              </tr>
            );
          })}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
