"use client";

import * as React from "react";
import { Search } from "lucide-react";

export interface SelectableMember {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
}

/**
 * Lets an admin pick any number of existing members by reference (checked boxes
 * sharing one `name`) instead of re-entering their name/photo/details. Used by
 * the roster form today; reusable anywhere else a form needs "pick some members."
 */
export function MemberMultiSelect({
  members,
  name,
  defaultSelectedIds = [],
}: {
  members: SelectableMember[];
  name: string;
  defaultSelectedIds?: string[];
}) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Set<string>>(new Set(defaultSelectedIds));

  const filtered = members.filter((m) =>
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(query.toLowerCase())
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bronze-soft" size={15} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search members to add as hosts…"
          className="w-full rounded-lg border border-ink/12 bg-white py-2 pl-9 pr-3 text-sm text-ink outline-none focus:border-gold-deep dark:border-parchment/15 dark:bg-ink-soft/40 dark:text-parchment"
        />
      </div>

      <div className="mt-2 max-h-56 divide-y divide-ink/8 overflow-y-auto rounded-lg border border-ink/12 dark:divide-parchment/10 dark:border-parchment/15">
        {filtered.length === 0 && (
          <p className="px-3 py-4 text-center text-xs text-bronze dark:text-parchment/60">No members match.</p>
        )}
        {filtered.map((member) => (
          <label
            key={member.id}
            className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm hover:bg-gold/5 dark:hover:bg-parchment/5"
          >
            <input
              type="checkbox"
              name={name}
              value={member.id}
              checked={selected.has(member.id)}
              onChange={() => toggle(member.id)}
              className="h-4 w-4 rounded border-ink/20"
            />
            <img
              src={member.photoUrl ?? "/placeholders/member-avatar.svg"}
              alt=""
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="text-ink dark:text-parchment">
              {member.firstName} {member.lastName}
            </span>
          </label>
        ))}
      </div>

      <p className="mt-1.5 text-xs text-bronze dark:text-parchment/60">{selected.size} selected</p>
    </div>
  );
}
