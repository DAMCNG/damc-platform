import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-lg border border-ink/12 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold-deep dark:border-parchment/15 dark:bg-ink-soft/40 dark:text-parchment";

export function FormField({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-bronze dark:text-parchment/60">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-bronze-soft dark:text-parchment/40">{hint}</p>}
    </div>
  );
}
