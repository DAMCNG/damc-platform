import { prisma } from "@damc/db";
import { PageHeader } from "@/components/page-header";
import { inputClass } from "@/components/form-field";
import { DeleteButton } from "@/components/delete-button";
import { SubmitButton } from "@/components/submit-button";
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from "./actions";

export const dynamic = "force-dynamic";

const EVENT_TYPES = ["MEETING", "DUES", "HOLIDAY", "OTHER"] as const;

export default async function CalendarPage() {
  const events = await prisma.calendarEvent.findMany({ orderBy: { date: "asc" } });

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Meetings, dues deadlines, holidays and other one-off dates. Member birthdays are computed automatically and don't appear here."
      />

      <form action={createCalendarEvent} className="mb-6 grid gap-3 rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40 sm:grid-cols-4">
        <input name="title" required placeholder="Title" className={inputClass} />
        <select name="type" defaultValue="MEETING" className={inputClass}>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input name="date" type="date" required className={inputClass} />
        <input name="description" placeholder="Description (optional)" className={inputClass} />
        <SubmitButton pendingLabel="Adding…" className="sm:col-span-4">Add event</SubmitButton>
      </form>

      <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        {events.length === 0 ? (
          <p className="text-sm text-bronze dark:text-parchment/60">No calendar events yet — add one above.</p>
        ) : (
          <ul className="divide-y divide-ink/8 dark:divide-parchment/10">
            {events.map((event) => (
              <li key={event.id} className="flex flex-wrap items-center gap-3 py-3">
                <form action={updateCalendarEvent} className="flex flex-1 flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={event.id} />
                  <input name="title" defaultValue={event.title} required className={`${inputClass} min-w-[160px] flex-1`} />
                  <select name="type" defaultValue={event.type} className={`${inputClass} w-32`}>
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input
                    name="date"
                    type="date"
                    defaultValue={event.date.toISOString().slice(0, 10)}
                    required
                    className={`${inputClass} w-40`}
                  />
                  <input
                    name="description"
                    defaultValue={event.description ?? ""}
                    placeholder="Description (optional)"
                    className={`${inputClass} min-w-[160px] flex-1`}
                  />
                  <SubmitButton pendingLabel="Saving…">Save</SubmitButton>
                </form>
                <form action={deleteCalendarEvent}>
                  <input type="hidden" name="id" value={event.id} />
                  <DeleteButton confirmMessage={`Remove "${event.title}"?`} />
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
