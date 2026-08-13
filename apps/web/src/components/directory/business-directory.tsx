"use client";

import * as React from "react";
import Fuse from "fuse.js";
import { Search, Globe } from "lucide-react";
import { FaPhone, FaWhatsapp } from "react-icons/fa6";
import { Card, CardContent, Badge, cn, ImageWithSkeleton } from "@damc/ui";
import { optimizedImageUrl } from "@/lib/cloudinary";

export interface BusinessCardData {
  id: string;
  name: string;
  category: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  member: {
    firstName: string;
    lastName: string;
    photoUrl: string | null;
    whatsapp: string | null;
  };
}

export function BusinessDirectory({ businesses }: { businesses: BusinessCardData[] }) {
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  const categories = React.useMemo(
    () => Array.from(new Set(businesses.map((b) => b.category))).sort(),
    [businesses]
  );

  const fuse = React.useMemo(
    () =>
      new Fuse(businesses, {
        keys: ["name", "category", "description", "member.firstName", "member.lastName"],
        threshold: 0.35,
      }),
    [businesses]
  );

  let results = query.trim() ? fuse.search(query).map((r) => r.item) : businesses;
  if (activeCategory) results = results.filter((b) => b.category === activeCategory);

  return (
    <div>
      <div className="relative mx-auto max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bronze-soft" size={18} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search e.g. &ldquo;car dealer&rdquo;, &ldquo;caterer&rdquo;…"
          className="w-full rounded-full border border-ink/12 bg-white py-3 pl-11 pr-4 text-sm text-ink outline-none transition-colors focus:border-gold-deep dark:border-parchment/15 dark:bg-ink-soft/40 dark:text-parchment"
        />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
            activeCategory === null
              ? "border-gold-deep bg-gold/15 text-gold-deep dark:border-gold-bright dark:bg-gold-bright/15 dark:text-gold-bright"
              : "border-ink/12 text-bronze hover:border-gold-deep dark:border-parchment/15 dark:text-parchment/70"
          )}
        >
          All categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              activeCategory === cat
                ? "border-gold-deep bg-gold/15 text-gold-deep dark:border-gold-bright dark:bg-gold-bright/15 dark:text-gold-bright"
                : "border-ink/12 text-bronze hover:border-gold-deep dark:border-parchment/15 dark:text-parchment/70"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-bronze dark:text-parchment/60">
        {results.length} business{results.length === 1 ? "" : "es"}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((biz) => (
          <Card key={biz.id} className="transition-transform duration-300 hover:-translate-y-1">
            <CardContent>
              <div className="flex items-center gap-3">
                <span className="relative block h-14 w-14 flex-shrink-0 overflow-hidden rounded-full">
                  <ImageWithSkeleton
                    src={optimizedImageUrl(biz.member.photoUrl ?? "/placeholders/member-avatar.svg", 150)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </span>
                <p className="text-sm text-bronze-soft dark:text-parchment/50">
                  {biz.member.firstName} {biz.member.lastName}
                </p>
              </div>
              <Badge variant="gold" className="mt-3">{biz.category}</Badge>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink dark:text-parchment">
                {biz.name}
              </h3>
              {biz.description && (
                <p className="mt-2 text-sm text-bronze dark:text-parchment/70">{biz.description}</p>
              )}
              <div className="mt-4 flex gap-3">
                {biz.phone && (
                  <a
                    href={`tel:${biz.phone}`}
                    aria-label="Call"
                    className="rounded-full border border-ink/10 p-2 text-ink transition-colors hover:border-gold-deep hover:text-gold-deep dark:border-parchment/15 dark:text-parchment dark:hover:text-gold-bright"
                  >
                    <FaPhone size={13} />
                  </a>
                )}
                {biz.member.whatsapp && (
                  <a
                    href={biz.member.whatsapp}
                    aria-label="WhatsApp"
                    className="rounded-full border border-ink/10 p-2 text-ink transition-colors hover:border-gold-deep hover:text-gold-deep dark:border-parchment/15 dark:text-parchment dark:hover:text-gold-bright"
                  >
                    <FaWhatsapp size={15} />
                  </a>
                )}
                {biz.website && (
                  <a
                    href={biz.website}
                    aria-label="Website"
                    className="rounded-full border border-ink/10 p-2 text-ink transition-colors hover:border-gold-deep hover:text-gold-deep dark:border-parchment/15 dark:text-parchment dark:hover:text-gold-bright"
                  >
                    <Globe size={15} />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <p className="mt-12 text-center text-bronze dark:text-parchment/60">
          No businesses match your search.
        </p>
      )}
    </div>
  );
}
