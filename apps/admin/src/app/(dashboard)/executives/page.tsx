import { prisma, type ExecutivePosition, type Member } from "@damc/db";
import { PageHeader } from "@/components/page-header";
import { AdminTable, AdminTableHead, AdminTableBody, Th, Td, EmptyState } from "@/components/admin-table";
import { DeleteButton } from "@/components/delete-button";
import { SubmitButton } from "@/components/submit-button";
import { inputClass } from "@/components/form-field";
import {
  createExecutiveCategory,
  updateExecutiveCategory,
  deleteExecutiveCategory,
  assignExecutive,
  removeExecutive,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function ExecutivesPage() {
  const [categories, positions, members] = await Promise.all([
    prisma.executiveCategory.findMany({ orderBy: { order: "asc" } }),
    prisma.executivePosition.findMany({ where: { isCurrent: true }, include: { member: true } }),
    prisma.member.findMany({ where: { isActive: true }, orderBy: { firstName: "asc" } }),
  ]);

  const positionsByCategory = new Map<string, (ExecutivePosition & { member: Member })[]>();
  for (const position of positions) {
    if (!position.categoryId) continue;
    const list = positionsByCategory.get(position.categoryId) ?? [];
    list.push(position);
    positionsByCategory.set(position.categoryId, list);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Executives"
        description="Manage the club's executive categories and who currently holds each one."
      />

      <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <h2 className="mb-1 font-display text-base font-semibold text-ink dark:text-parchment">Categories</h2>
        <p className="mb-4 text-xs text-bronze dark:text-parchment/60">
          Titles like &ldquo;Legal Adviser&rdquo; or &ldquo;Welfare&rdquo;. More than one member can hold the same
          category at once. Order controls where it appears on the public page &mdash; lower numbers sit higher up.
        </p>

        <form action={createExecutiveCategory} className="mb-5 flex gap-3">
          <input name="name" required placeholder="New category name" className={`${inputClass} flex-1`} />
          <SubmitButton pendingLabel="Adding…">Add category</SubmitButton>
        </form>

        {categories.length === 0 ? (
          <p className="text-sm text-bronze dark:text-parchment/60">No categories yet &mdash; add one above.</p>
        ) : (
          <ul className="divide-y divide-ink/8 dark:divide-parchment/10">
            {categories.map((category) => (
              <li key={category.id} className="flex flex-wrap items-center gap-3 py-3">
                <form action={updateExecutiveCategory} className="flex flex-1 flex-wrap items-center gap-3">
                  <input type="hidden" name="id" value={category.id} />
                  <input
                    name="name"
                    defaultValue={category.name}
                    required
                    className={`${inputClass} min-w-[180px] flex-1`}
                  />
                  <input
                    name="order"
                    type="number"
                    defaultValue={category.order}
                    title="Order (lower = higher up on the public page)"
                    className={`${inputClass} w-20`}
                  />
                  <SubmitButton pendingLabel="Saving…">Save</SubmitButton>
                </form>
                <form action={deleteExecutiveCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <DeleteButton confirmMessage={`Delete "${category.name}"? This also removes its position history.`} />
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AdminTable>
        <AdminTableHead>
          <Th>Category</Th>
          <Th>Current holders</Th>
          <Th className="text-right">Assign</Th>
        </AdminTableHead>
        <AdminTableBody>
          {categories.length === 0 && <EmptyState message="Add a category above to get started." />}
          {categories.map((category) => {
            const categoryPositions = positionsByCategory.get(category.id) ?? [];
            return (
              <tr key={category.id}>
                <Td className="font-medium">{category.name}</Td>
                <Td>
                  {categoryPositions.length === 0 ? (
                    <span className="text-bronze-soft dark:text-parchment/40">Vacant</span>
                  ) : (
                    <ul className="space-y-1.5">
                      {categoryPositions.map((position) => (
                        <li key={position.id} className="flex items-center gap-2">
                          <img
                            src={position.member.photoUrl ?? "/placeholders/member-avatar.svg"}
                            alt=""
                            className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
                          />
                          <span className="text-sm text-ink dark:text-parchment">
                            {position.member.firstName} {position.member.lastName}
                          </span>
                          <form action={removeExecutive}>
                            <input type="hidden" name="positionId" value={position.id} />
                            <button
                              type="submit"
                              className="text-xs font-semibold text-bronze transition-colors hover:text-red-600 dark:text-parchment/50 dark:hover:text-red-400"
                            >
                              Vacate
                            </button>
                          </form>
                        </li>
                      ))}
                    </ul>
                  )}
                </Td>
                <Td>
                  <form action={assignExecutive} className="flex items-center justify-end gap-2">
                    <input type="hidden" name="categoryId" value={category.id} />
                    <select
                      name="memberId"
                      required
                      defaultValue=""
                      className="rounded-lg border border-ink/12 bg-white px-2.5 py-1.5 text-xs text-ink outline-none dark:border-parchment/15 dark:bg-ink-soft/40 dark:text-parchment"
                    >
                      <option value="" disabled>
                        Select member…
                      </option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.firstName} {m.lastName}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-lg bg-gold px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-gold-bright"
                    >
                      Add
                    </button>
                  </form>
                </Td>
              </tr>
            );
          })}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
