import { prisma } from "@damc/db";
import { PageHeader } from "@/components/page-header";
import { AdminTable, AdminTableHead, AdminTableBody, Th, Td } from "@/components/admin-table";
import { ROLE_ORDER, ROLE_LABELS } from "@/lib/labels";
import { formatEventDate } from "@/lib/dates";
import { assignExecutive, removeExecutive } from "./actions";

export const dynamic = "force-dynamic";

export default async function ExecutivesPage() {
  const [positions, members] = await Promise.all([
    prisma.executivePosition.findMany({ where: { isCurrent: true }, include: { member: true } }),
    prisma.member.findMany({ where: { isActive: true }, orderBy: { firstName: "asc" } }),
  ]);

  const byRole = new Map(positions.map((p) => [p.role, p]));

  return (
    <div>
      <PageHeader
        title="Executives"
        description="Assign members to the club's 13 executive positions. Assigning a new holder automatically retires the previous one."
      />

      <AdminTable>
        <AdminTableHead>
          <Th>Role</Th>
          <Th>Current holder</Th>
          <Th>Since</Th>
          <Th className="text-right">Reassign</Th>
        </AdminTableHead>
        <AdminTableBody>
          {ROLE_ORDER.map((role) => {
            const position = byRole.get(role);
            return (
              <tr key={role}>
                <Td className="font-medium">{ROLE_LABELS[role]}</Td>
                <Td>
                  {position ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={position.member.photoUrl ?? "/placeholders/member-avatar.svg"}
                        alt=""
                        className="h-7 w-7 rounded-full object-cover"
                      />
                      {position.member.firstName} {position.member.lastName}
                    </div>
                  ) : (
                    <span className="text-bronze-soft dark:text-parchment/40">Vacant</span>
                  )}
                </Td>
                <Td className="text-bronze dark:text-parchment/60">
                  {position ? formatEventDate(position.termStart) : "—"}
                </Td>
                <Td>
                  <div className="flex items-center justify-end gap-2">
                    <form action={assignExecutive} className="flex items-center gap-2">
                      <input type="hidden" name="role" value={role} />
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
                        Assign
                      </button>
                    </form>
                    {position && (
                      <form action={removeExecutive}>
                        <input type="hidden" name="positionId" value={position.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-ink/12 px-3 py-1.5 text-xs font-semibold text-bronze transition-colors hover:border-red-300 hover:text-red-600 dark:border-parchment/15 dark:text-parchment/60"
                        >
                          Vacate
                        </button>
                      </form>
                    )}
                  </div>
                </Td>
              </tr>
            );
          })}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
