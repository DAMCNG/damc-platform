"use client";

import * as React from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search, Pencil } from "lucide-react";
import { Badge } from "@damc/ui";
import { AdminTable, AdminTableHead, AdminTableBody, Th, Td, EmptyState } from "@/components/admin-table";
import { DeleteButton } from "@/components/delete-button";
import { formatMonthDay } from "@/lib/dates";
import { formatArticulateNumber } from "@/lib/labels";
import { deleteMember } from "@/app/(dashboard)/members/actions";

export interface MemberRowData {
  id: string;
  firstName: string;
  lastName: string;
  membershipNumber: string | null;
  photoUrl: string | null;
  birthMonth: number | null;
  birthDay: number | null;
  isActive: boolean;
  businesses: { name: string; category: string }[];
}

export function MembersTable({ members }: { members: MemberRowData[] }) {
  const [query, setQuery] = React.useState("");

  const fuse = React.useMemo(
    () =>
      new Fuse(members, {
        keys: ["firstName", "lastName", "membershipNumber", "businesses.name", "businesses.category"],
        threshold: 0.35,
      }),
    [members]
  );

  const results = query.trim() ? fuse.search(query).map((r) => r.item) : members;

  return (
    <div>
      <form className="relative mb-5 max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bronze-soft" size={16} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, articulate no. or business…"
          className="w-full rounded-full border border-ink/12 bg-white py-2 pl-10 pr-4 text-sm text-ink outline-none focus:border-gold-deep dark:border-parchment/15 dark:bg-ink-soft/40 dark:text-parchment"
        />
      </form>

      <AdminTable>
        <AdminTableHead>
          <Th>Member</Th>
          <Th>ARTICULATE NO.</Th>
          <Th>Business</Th>
          <Th>Birthday</Th>
          <Th>Status</Th>
          <Th className="text-right">Actions</Th>
        </AdminTableHead>
        <AdminTableBody>
          {results.length === 0 && <EmptyState message="No members found." />}
          {results.map((member) => (
            <tr key={member.id}>
              <Td>
                <div className="flex items-center gap-2.5">
                  <img
                    src={member.photoUrl ?? "/placeholders/member-avatar.svg"}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="font-medium">{member.firstName} {member.lastName}</span>
                </div>
              </Td>
              <Td className="font-mono text-xs font-semibold text-gold-deep dark:text-gold-bright">
                {member.membershipNumber ? formatArticulateNumber(member.membershipNumber) : "—"}
              </Td>
              <Td className="text-bronze dark:text-parchment/60">
                {member.businesses.length > 0 ? member.businesses.map((b) => b.category).join(", ") : "—"}
              </Td>
              <Td className="text-bronze dark:text-parchment/60">
                {member.birthMonth && member.birthDay ? formatMonthDay(member.birthMonth, member.birthDay) : "—"}
              </Td>
              <Td>
                <Badge variant={member.isActive ? "success" : "ink"}>{member.isActive ? "Active" : "Inactive"}</Badge>
              </Td>
              <Td>
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/members/${member.id}`}
                    aria-label="Edit"
                    className="rounded-lg p-1.5 text-bronze transition-colors hover:bg-gold/10 hover:text-gold-deep dark:text-parchment/60 dark:hover:text-gold-bright"
                  >
                    <Pencil size={16} />
                  </Link>
                  <form action={deleteMember}>
                    <input type="hidden" name="id" value={member.id} />
                    <DeleteButton confirmMessage={`Remove ${member.firstName} ${member.lastName}? This cannot be undone.`} />
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
