import Link from "next/link";
import { FormField, inputClass } from "@/components/form-field";
import { MemberMultiSelect, type SelectableMember } from "@/components/member-multi-select";
import { SubmitButton } from "@/components/submit-button";
import type { Member, RosterEntry } from "@damc/db";

export function RosterForm({
  entry,
  members,
  action,
}: {
  entry?: RosterEntry & { hosts: Member[] };
  members: SelectableMember[];
  action: (formData: FormData) => void;
}) {
  const meetingDateValue = entry ? entry.meetingDate.toISOString().slice(0, 10) : undefined;

  return (
    <form action={action} className="grid gap-4 rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40 sm:grid-cols-2">
      {entry && <input type="hidden" name="id" value={entry.id} />}
      <FormField label="Hosts" htmlFor="hostIds">
        <MemberMultiSelect
          members={members}
          name="hostIds"
          defaultSelectedIds={entry?.hosts.map((h) => h.id)}
        />
      </FormField>
      <div className="flex flex-col gap-4">
        <FormField label="Meeting date" htmlFor="meetingDate">
          <input id="meetingDate" name="meetingDate" type="date" required defaultValue={meetingDateValue} className={inputClass} />
        </FormField>
        <FormField label="Notes (optional)" htmlFor="notes">
          <input id="notes" name="notes" defaultValue={entry?.notes ?? ""} className={inputClass} placeholder="Venue, theme, etc." />
        </FormField>
      </div>
      <div className="flex items-center gap-3 sm:col-span-2">
        <SubmitButton pendingLabel="Saving…">{entry ? "Save changes" : "Add to roster"}</SubmitButton>
        {entry && (
          <Link href="/roster" className="text-sm font-semibold text-bronze hover:text-ink dark:text-parchment/60 dark:hover:text-parchment">
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}
