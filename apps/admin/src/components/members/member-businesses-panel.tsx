import { Plus } from "lucide-react";
import { FormField, inputClass } from "@/components/form-field";
import { DeleteButton } from "@/components/delete-button";
import { SubmitButton } from "@/components/submit-button";
import type { Business } from "@damc/db";
import { createBusiness, updateBusiness, deleteBusiness } from "@/app/(dashboard)/members/actions";

export function MemberBusinessesPanel({ memberId, businesses }: { memberId: string; businesses: Business[] }) {
  return (
    <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
      <h2 className="mb-1 font-display text-base font-semibold text-ink dark:text-parchment">Businesses</h2>
      <p className="mb-4 text-xs text-bronze dark:text-parchment/60">
        A member can run more than one business — each shows up as its own listing on the public
        Business Directory, searchable by trade.
      </p>

      {businesses.length > 0 && (
        <ul className="mb-5 space-y-4">
          {businesses.map((biz) => (
            <li key={biz.id} className="rounded-lg border border-ink/10 p-4 dark:border-parchment/15">
              <form action={updateBusiness} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="id" value={biz.id} />
                <input type="hidden" name="memberId" value={memberId} />
                <FormField label="Business name" htmlFor={`name-${biz.id}`}>
                  <input id={`name-${biz.id}`} name="name" defaultValue={biz.name} required className={inputClass} />
                </FormField>
                <FormField label="Category / trade" htmlFor={`category-${biz.id}`}>
                  <input id={`category-${biz.id}`} name="category" defaultValue={biz.category} required className={inputClass} />
                </FormField>
                <FormField label="Phone (optional)" htmlFor={`phone-${biz.id}`}>
                  <input id={`phone-${biz.id}`} name="phone" defaultValue={biz.phone ?? ""} className={inputClass} />
                </FormField>
                <FormField label="Website (optional)" htmlFor={`website-${biz.id}`}>
                  <input id={`website-${biz.id}`} name="website" defaultValue={biz.website ?? ""} className={inputClass} />
                </FormField>
                <div className="sm:col-span-2">
                  <FormField label="Description (optional)" htmlFor={`description-${biz.id}`}>
                    <textarea id={`description-${biz.id}`} name="description" rows={2} defaultValue={biz.description ?? ""} className={inputClass} />
                  </FormField>
                </div>
                <div className="flex items-center gap-3 sm:col-span-2">
                  <SubmitButton pendingLabel="Saving…" className="px-4 py-2 text-xs">Save</SubmitButton>
                  <span className="flex-1" />
                </div>
              </form>
              <form action={deleteBusiness} className="mt-2 flex justify-end">
                <input type="hidden" name="id" value={biz.id} />
                <input type="hidden" name="memberId" value={memberId} />
                <DeleteButton confirmMessage={`Remove ${biz.name}?`} />
              </form>
            </li>
          ))}
        </ul>
      )}

      <form action={createBusiness} className="grid gap-3 border-t border-ink/8 pt-4 dark:border-parchment/10 sm:grid-cols-2">
        <input type="hidden" name="memberId" value={memberId} />
        <FormField label="Business name" htmlFor="businessName">
          <input id="businessName" name="name" required className={inputClass} />
        </FormField>
        <FormField label="Category / trade" htmlFor="businessCategory" hint="E.g. Car Dealer, Hotels, Catering">
          <input id="businessCategory" name="category" required className={inputClass} />
        </FormField>
        <FormField label="Phone (optional)" htmlFor="businessPhone">
          <input id="businessPhone" name="phone" className={inputClass} />
        </FormField>
        <FormField label="Website (optional)" htmlFor="businessWebsite">
          <input id="businessWebsite" name="website" className={inputClass} />
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Description (optional)" htmlFor="businessDescription">
            <textarea id="businessDescription" name="description" rows={2} className={inputClass} />
          </FormField>
        </div>
        <div className="sm:col-span-2">
          <SubmitButton pendingLabel="Adding…" className="px-4 py-2 text-xs">
            <Plus size={14} /> Add business
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
