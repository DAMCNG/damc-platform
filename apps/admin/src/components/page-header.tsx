import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-parchment">{title}</h1>
        {description && <p className="mt-1 text-sm text-bronze dark:text-parchment/60">{description}</p>}
      </div>
      {action}
    </div>
  );
}
