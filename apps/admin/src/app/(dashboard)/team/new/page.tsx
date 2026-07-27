"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, Copy } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { FormField, inputClass } from "@/components/form-field";
import { createTeamMember, type ActionResult } from "../actions";

type Role = "SUPER_ADMIN" | "CONTENT_MANAGER";

const ROLE_DEFAULTS: Record<Role, { canPublishContent: boolean; canViewEnquiries: boolean; canAssignEnquiries: boolean; canViewAnalytics: boolean }> = {
  SUPER_ADMIN: { canPublishContent: true, canViewEnquiries: true, canAssignEnquiries: true, canViewAnalytics: true },
  CONTENT_MANAGER: { canPublishContent: true, canViewEnquiries: false, canAssignEnquiries: false, canViewAnalytics: false },
};

export default function NewTeamMemberPage() {
  const [state, formAction, isPending] = useActionState<ActionResult | undefined, FormData>(createTeamMember, undefined);
  const [role, setRole] = React.useState<Role>("CONTENT_MANAGER");
  const [permissions, setPermissions] = React.useState(ROLE_DEFAULTS.CONTENT_MANAGER);

  function handleRoleChange(next: Role) {
    setRole(next);
    setPermissions(ROLE_DEFAULTS[next]);
  }

  if (state?.success && state.tempPassword) {
    return (
      <div>
        <PageHeader title="Team member added" />
        <div className="max-w-md rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
          <div className="flex items-center gap-2 text-ink dark:text-parchment">
            <CheckCircle2 className="text-gold-deep dark:text-gold-bright" size={20} />
            <p className="font-medium">{state.message}</p>
          </div>
          <p className="mt-3 text-sm text-bronze dark:text-parchment/60">
            Share this temporary password with them directly — it won't be shown again. If email
            is configured, it was also sent to their inbox.
          </p>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-ink/12 bg-parchment-paper px-4 py-3 dark:border-parchment/15 dark:bg-ink">
            <code className="text-sm font-semibold text-ink dark:text-parchment">{state.tempPassword}</code>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(state.tempPassword!)}
              className="flex items-center gap-1 text-xs font-semibold text-gold-deep hover:underline dark:text-gold-bright"
            >
              <Copy size={13} /> Copy
            </button>
          </div>
          <Link href="/team" className="mt-6 inline-block text-sm font-semibold text-bronze hover:text-ink dark:text-parchment/60 dark:hover:text-parchment">
            Back to team
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Add team member" description="They'll receive a temporary password to sign in with." />

      <form action={formAction} className="max-w-lg space-y-6">
        <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
          <div className="space-y-4">
            <FormField label="Name" htmlFor="name">
              <input id="name" name="name" required className={inputClass} />
            </FormField>
            <FormField label="Email" htmlFor="email">
              <input id="email" name="email" type="email" required className={inputClass} />
            </FormField>
            <FormField label="Phone (optional)" htmlFor="phone">
              <input id="phone" name="phone" className={inputClass} />
            </FormField>
            <FormField label="Role" htmlFor="role">
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as Role)}
                className={inputClass}
              >
                <option value="CONTENT_MANAGER">Content Manager</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </FormField>
          </div>
        </div>

        <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
          <h2 className="mb-1 font-display text-base font-semibold text-ink dark:text-parchment">Permissions</h2>
          <p className="mb-4 text-xs text-bronze dark:text-parchment/60">Set automatically by role — override any of them below.</p>
          <div className="space-y-3">
            {(
              [
                ["canPublishContent", "Can publish content"],
                ["canViewEnquiries", "Can view enquiries"],
                ["canAssignEnquiries", "Can assign enquiries"],
                ["canViewAnalytics", "Can view analytics"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2.5 text-sm text-ink dark:text-parchment">
                <input
                  type="checkbox"
                  name={key}
                  checked={permissions[key]}
                  onChange={(e) => setPermissions((p) => ({ ...p, [key]: e.target.checked }))}
                  className="h-4 w-4 rounded border-ink/20"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {state && !state.success && <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright disabled:opacity-60"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            Add team member
          </button>
          <Link href="/team" className="text-sm font-semibold text-bronze hover:text-ink dark:text-parchment/60 dark:hover:text-parchment">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
