import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@damc/db";
import { auth } from "@/lib/auth";
import { isSuperAdmin } from "@/lib/permissions";
import { PageHeader } from "@/components/page-header";
import { FormField, inputClass } from "@/components/form-field";
import { ResetPasswordButton } from "@/components/team/reset-password-button";
import { updateTeamMember } from "../actions";

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isSuperAdmin(session!.user)) redirect("/");

  const { id } = await params;
  const member = await prisma.adminUser.findUnique({ where: { id } });
  if (!member) notFound();

  return (
    <div>
      <PageHeader title={`Edit ${member.name}`} description={member.email} />

      <form action={updateTeamMember} className="max-w-lg space-y-6">
        <input type="hidden" name="id" value={member.id} />

        <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
          <div className="space-y-4">
            <FormField label="Name" htmlFor="name">
              <input id="name" name="name" required defaultValue={member.name} className={inputClass} />
            </FormField>
            <FormField label="Phone" htmlFor="phone">
              <input id="phone" name="phone" defaultValue={member.phone ?? ""} className={inputClass} />
            </FormField>
            <FormField label="Role" htmlFor="role">
              <select id="role" name="role" defaultValue={member.role} className={inputClass}>
                <option value="CONTENT_MANAGER">Content Manager</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </FormField>
          </div>
        </div>

        <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
          <h2 className="mb-4 font-display text-base font-semibold text-ink dark:text-parchment">Permissions</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2.5 text-sm text-ink dark:text-parchment">
              <input type="checkbox" name="canPublishContent" defaultChecked={member.canPublishContent} className="h-4 w-4 rounded border-ink/20" />
              Can publish content
            </label>
            <label className="flex items-center gap-2.5 text-sm text-ink dark:text-parchment">
              <input type="checkbox" name="canViewEnquiries" defaultChecked={member.canViewEnquiries} className="h-4 w-4 rounded border-ink/20" />
              Can view enquiries
            </label>
            <label className="flex items-center gap-2.5 text-sm text-ink dark:text-parchment">
              <input type="checkbox" name="canAssignEnquiries" defaultChecked={member.canAssignEnquiries} className="h-4 w-4 rounded border-ink/20" />
              Can assign enquiries
            </label>
            <label className="flex items-center gap-2.5 text-sm text-ink dark:text-parchment">
              <input type="checkbox" name="canViewAnalytics" defaultChecked={member.canViewAnalytics} className="h-4 w-4 rounded border-ink/20" />
              Can view analytics
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright">
            Save changes
          </button>
          <Link href="/team" className="text-sm font-semibold text-bronze hover:text-ink dark:text-parchment/60 dark:hover:text-parchment">
            Cancel
          </Link>
        </div>
      </form>

      <div className="mt-8 max-w-lg rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <h2 className="mb-1 font-display text-base font-semibold text-ink dark:text-parchment">Password</h2>
        <p className="mb-4 text-xs text-bronze dark:text-parchment/60">
          Generates a new temporary password and invalidates the old one immediately.
        </p>
        <ResetPasswordButton memberId={member.id} />
      </div>
    </div>
  );
}
