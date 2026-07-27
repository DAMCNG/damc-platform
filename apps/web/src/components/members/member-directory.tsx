"use client";

import * as React from "react";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { Card, Badge, ImageWithSkeleton } from "@damc/ui";
import { formatMonthDay } from "@/lib/dates";
import { optimizedImageUrl } from "@/lib/cloudinary";

export interface MemberCardData {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  birthMonth: number | null;
  birthDay: number | null;
  businesses: { name: string; category: string }[];
}

export function MemberDirectory({ members }: { members: MemberCardData[] }) {
  const [query, setQuery] = React.useState("");

  const fuse = React.useMemo(
    () =>
      new Fuse(members, {
        keys: ["firstName", "lastName", "businesses.name", "businesses.category"],
        threshold: 0.35,
      }),
    [members]
  );

  const results = query.trim() ? fuse.search(query).map((r) => r.item) : members;

  return (
    <div>
      <div className="relative mx-auto max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bronze-soft" size={18} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or business…"
          className="w-full rounded-full border border-ink/12 bg-white py-3 pl-11 pr-4 text-sm text-ink outline-none transition-colors focus:border-gold-deep dark:border-parchment/15 dark:bg-ink-soft/40 dark:text-parchment"
        />
      </div>

      <p className="mt-4 text-center text-sm text-bronze dark:text-parchment/60">
        {results.length} member{results.length === 1 ? "" : "s"}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((member) => (
          <Card key={member.id} className="overflow-hidden text-center transition-transform duration-300 hover:-translate-y-1">
            <div className="relative h-44 w-full overflow-hidden">
              <ImageWithSkeleton
                src={optimizedImageUrl(member.photoUrl ?? "/placeholders/member-avatar.svg", 600)}
                alt={`${member.firstName} ${member.lastName}`}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-4">
              <div className="font-display font-semibold text-ink dark:text-parchment">
                {member.firstName} {member.lastName}
              </div>
              {member.businesses.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {member.businesses.map((biz) => (
                    <Badge key={biz.category + biz.name} variant="gold">
                      {biz.category}
                    </Badge>
                  ))}
                </div>
              )}
              {member.birthMonth && member.birthDay && (
                <div className="mt-2 text-xs text-bronze-soft dark:text-parchment/50">
                  {formatMonthDay(member.birthMonth, member.birthDay)}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <p className="mt-12 text-center text-bronze dark:text-parchment/60">
          No members match &ldquo;{query}&rdquo;.
        </p>
      )}
    </div>
  );
}
