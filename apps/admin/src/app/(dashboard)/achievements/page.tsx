import { prisma } from "@damc/db";
import { PageHeader } from "@/components/page-header";
import { AdminTable, AdminTableHead, AdminTableBody, Th, Td, EmptyState } from "@/components/admin-table";
import { FormField, inputClass } from "@/components/form-field";
import { DeleteButton } from "@/components/delete-button";
import { SubmitButton } from "@/components/submit-button";
import { ImageUrlField } from "@/components/image-url-field";
import { createAchievement, deleteAchievement } from "./actions";

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({ orderBy: [{ year: "desc" }, { order: "asc" }] });

  return (
    <div>
      <PageHeader title="Achievements" description="Community impact and milestones shown on the public Achievements page." />

      <form action={createAchievement} className="mb-6 grid gap-4 rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <FormField label="Title" htmlFor="title">
            <input id="title" name="title" required className={inputClass} />
          </FormField>
        </div>
        <FormField label="Year" htmlFor="year">
          <input id="year" name="year" type="number" required className={inputClass} />
        </FormField>
        <ImageUrlField id="imageUrl" name="imageUrl" hint="Optional" />
        <div className="sm:col-span-4">
          <FormField label="Description" htmlFor="description">
            <textarea id="description" name="description" rows={2} className={inputClass} />
          </FormField>
        </div>
        <div className="sm:col-span-4">
          <SubmitButton pendingLabel="Adding…">Add achievement</SubmitButton>
        </div>
      </form>

      <AdminTable>
        <AdminTableHead>
          <Th>Title</Th>
          <Th>Year</Th>
          <Th>Description</Th>
          <Th className="text-right">Actions</Th>
        </AdminTableHead>
        <AdminTableBody>
          {achievements.length === 0 && <EmptyState message="No achievements yet." />}
          {achievements.map((item) => (
            <tr key={item.id}>
              <Td className="font-medium">{item.title}</Td>
              <Td className="text-bronze dark:text-parchment/60">{item.year}</Td>
              <Td className="max-w-sm truncate text-bronze dark:text-parchment/60">{item.description ?? "—"}</Td>
              <Td>
                <div className="flex justify-end">
                  <form action={deleteAchievement}>
                    <input type="hidden" name="id" value={item.id} />
                    <DeleteButton confirmMessage={`Delete "${item.title}"?`} />
                  </form>
                </div>
              </Td>
            </tr>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
