import Link from "next/link";
import { FormField, inputClass } from "@/components/form-field";
import { ImageUrlField } from "@/components/image-url-field";
import { SubmitButton } from "@/components/submit-button";
import type { Member } from "@damc/db";

export function MemberForm({
  member,
  action,
}: {
  member?: Member;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="space-y-6">
      {member && <input type="hidden" name="id" value={member.id} />}

      <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <h2 className="mb-4 font-display text-base font-semibold text-ink dark:text-parchment">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Title" htmlFor="title" hint="e.g. Eng., Dr., Chief, Amb., Mr.">
            <input id="title" name="title" defaultValue={member?.title ?? ""} className={inputClass} />
          </FormField>
          <FormField label="Nickname" htmlFor="nickname">
            <input id="nickname" name="nickname" defaultValue={member?.nickname ?? ""} className={inputClass} />
          </FormField>
          <FormField label="First name" htmlFor="firstName">
            <input id="firstName" name="firstName" required defaultValue={member?.firstName} className={inputClass} />
          </FormField>
          <FormField label="Last name" htmlFor="lastName">
            <input id="lastName" name="lastName" required defaultValue={member?.lastName} className={inputClass} />
          </FormField>
          <ImageUrlField id="photoUrl" name="photoUrl" label="Photo" defaultValue={member?.photoUrl} />
          <FormField label="Email" htmlFor="email">
            <input id="email" name="email" type="email" defaultValue={member?.email ?? ""} className={inputClass} />
          </FormField>
          <FormField label="Phone" htmlFor="phone">
            <input id="phone" name="phone" defaultValue={member?.phone ?? ""} className={inputClass} />
          </FormField>
          <FormField label="WhatsApp link" htmlFor="whatsapp">
            <input id="whatsapp" name="whatsapp" defaultValue={member?.whatsapp ?? ""} className={inputClass} placeholder="https://wa.me/234..." />
          </FormField>
        </div>
        <div className="mt-4">
          <FormField label="Bio" htmlFor="bio" hint="Leave a blank line between paragraphs. Use **bold** and *italic* for emphasis.">
            <textarea id="bio" name="bio" rows={3} defaultValue={member?.bio ?? ""} className={inputClass} />
          </FormField>
        </div>
      </div>

      {!member && (
        <div className="rounded-xl2 border border-gold/20 bg-gold/5 p-4 text-sm text-bronze dark:border-gold-bright/20 dark:bg-gold-bright/5 dark:text-parchment/70">
          Save this member first — you'll add their business(es) on the edit page that follows,
          since a business needs to belong to an existing member.
        </div>
      )}

      <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <h2 className="mb-4 font-display text-base font-semibold text-ink dark:text-parchment">Membership details</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Membership no." htmlFor="membershipNumber">
            <input id="membershipNumber" name="membershipNumber" defaultValue={member?.membershipNumber ?? ""} className={inputClass} />
          </FormField>
          <FormField label="Occupation" htmlFor="occupation">
            <input id="occupation" name="occupation" defaultValue={member?.occupation ?? ""} className={inputClass} />
          </FormField>
          <FormField label="State of origin" htmlFor="stateOfOrigin">
            <input id="stateOfOrigin" name="stateOfOrigin" defaultValue={member?.stateOfOrigin ?? ""} className={inputClass} />
          </FormField>
          <FormField label="Year joined" htmlFor="yearJoined">
            <input id="yearJoined" name="yearJoined" type="number" min={1950} max={2100} defaultValue={member?.yearJoined ?? ""} className={inputClass} />
          </FormField>
          <FormField label="Marital status" htmlFor="maritalStatus">
            <select id="maritalStatus" name="maritalStatus" defaultValue={member?.maritalStatus ?? ""} className={inputClass}>
              <option value="">—</option>
              <option value="SINGLE">Single</option>
              <option value="MARRIED">Married</option>
              <option value="DIVORCED">Divorced</option>
              <option value="WIDOWED">Widowed</option>
            </select>
          </FormField>
        </div>
      </div>

      <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <h2 className="mb-4 font-display text-base font-semibold text-ink dark:text-parchment">Birthday & status</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Birth month" htmlFor="birthMonth" hint="Month only, no year">
            <input id="birthMonth" name="birthMonth" type="number" min={1} max={12} defaultValue={member?.birthMonth ?? ""} className={inputClass} />
          </FormField>
          <FormField label="Birth day" htmlFor="birthDay">
            <input id="birthDay" name="birthDay" type="number" min={1} max={31} defaultValue={member?.birthDay ?? ""} className={inputClass} />
          </FormField>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm text-ink dark:text-parchment">
              <input type="checkbox" name="isActive" defaultChecked={member?.isActive ?? true} className="h-4 w-4 rounded border-ink/20" />
              Active member
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <h2 className="mb-1 font-display text-base font-semibold text-ink dark:text-parchment">Legal team</h2>
        <p className="mb-4 text-xs text-bronze dark:text-parchment/60">
          Shown in a distinct section above ordinary members on the public Members page.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center pb-2.5">
            <label className="flex items-center gap-2 text-sm text-ink dark:text-parchment">
              <input type="checkbox" name="isLegalTeam" defaultChecked={member?.isLegalTeam ?? false} className="h-4 w-4 rounded border-ink/20" />
              On the legal team
            </label>
          </div>
          <FormField label="Legal team title" htmlFor="legalTeamTitle" hint="e.g. Legal Adviser, Committee Chair (optional)">
            <input id="legalTeamTitle" name="legalTeamTitle" defaultValue={member?.legalTeamTitle ?? ""} className={inputClass} />
          </FormField>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton pendingLabel={member ? "Saving…" : "Adding…"}>
          {member ? "Save changes" : "Add member"}
        </SubmitButton>
        <Link href="/members" className="text-sm font-semibold text-bronze hover:text-ink dark:text-parchment/60 dark:hover:text-parchment">
          Cancel
        </Link>
      </div>
    </form>
  );
}
