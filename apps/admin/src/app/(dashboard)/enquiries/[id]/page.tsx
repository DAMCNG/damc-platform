import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { prisma } from "@damc/db";
import { auth } from "@/lib/auth";
import { canAssignEnquiries, canSeeEnquiries } from "@/lib/permissions";
import { PageHeader } from "@/components/page-header";
import { AutoSubmitSelect } from "@/components/auto-submit-select";
import { DeleteButton } from "@/components/delete-button";
import { MarkReadOnMount } from "@/components/enquiries/mark-read-on-mount";
import { formatDateTime } from "@/lib/dates";
import { updateEnquiryStatus, assignEnquiry, archiveEnquiry, deleteEnquiry } from "../actions";

const STATUSES = ["NEW", "IN_PROGRESS", "RESOLVED"] as const;

const selectClass =
  "rounded-lg border border-ink/12 bg-white px-3 py-2 text-sm text-ink outline-none dark:border-parchment/15 dark:bg-ink-soft/40 dark:text-parchment";

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = session!.user;
  if (!canSeeEnquiries(user)) redirect("/");
  const canAssign = canAssignEnquiries(user);

  const { id } = await params;
  const [enquiry, admins] = await Promise.all([
    prisma.enquiry.findUnique({ where: { id }, include: { assignedTo: true } }),
    prisma.adminUser.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" } }),
  ]);
  if (!enquiry) notFound();

  return (
    <div className="max-w-2xl">
      <MarkReadOnMount id={enquiry.id} alreadyRead={Boolean(enquiry.readAt)} />

      <Link href="/enquiries" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-bronze hover:text-ink dark:text-parchment/60 dark:hover:text-parchment">
        <ArrowLeft size={15} /> Back to enquiries
      </Link>

      <PageHeader title={enquiry.subject || "Enquiry"} description={formatDateTime(enquiry.createdAt)} />

      <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/8 pb-4 dark:border-parchment/10">
          <div>
            <div className="font-display text-lg font-semibold text-ink dark:text-parchment">{enquiry.name}</div>
            <a href={`mailto:${enquiry.email}`} className="flex items-center gap-1.5 text-sm text-gold-deep hover:underline dark:text-gold-bright">
              <Mail size={13} /> {enquiry.email}
            </a>
            {enquiry.phone && (
              <a href={`tel:${enquiry.phone}`} className="flex items-center gap-1.5 text-sm text-bronze hover:underline dark:text-parchment/60">
                <Phone size={13} /> {enquiry.phone}
              </a>
            )}
          </div>

          {canAssign && (
            <div className="flex gap-2">
              <form action={updateEnquiryStatus}>
                <input type="hidden" name="id" value={enquiry.id} />
                <AutoSubmitSelect name="status" defaultValue={enquiry.status} className={selectClass}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replace("_", " ")}</option>
                  ))}
                </AutoSubmitSelect>
              </form>
              <form action={assignEnquiry}>
                <input type="hidden" name="id" value={enquiry.id} />
                <AutoSubmitSelect name="assignedToId" defaultValue={enquiry.assignedToId ?? ""} className={selectClass}>
                  <option value="">Unassigned</option>
                  {admins.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </AutoSubmitSelect>
              </form>
            </div>
          )}
        </div>

        <p className="whitespace-pre-wrap py-6 text-sm leading-relaxed text-ink dark:text-parchment/90">
          {enquiry.message}
        </p>

        {canAssign && (
          <div className="flex items-center gap-3 border-t border-ink/8 pt-4 dark:border-parchment/10">
            <form action={archiveEnquiry}>
              <input type="hidden" name="id" value={enquiry.id} />
              <button
                type="submit"
                className="rounded-full border border-ink/12 px-4 py-2 text-xs font-semibold text-bronze transition-colors hover:border-gold-deep hover:text-gold-deep dark:border-parchment/15 dark:text-parchment/60"
              >
                Archive
              </button>
            </form>
            <form action={deleteEnquiry}>
              <input type="hidden" name="id" value={enquiry.id} />
              <DeleteButton confirmMessage={`Delete the enquiry from ${enquiry.name}?`} />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
