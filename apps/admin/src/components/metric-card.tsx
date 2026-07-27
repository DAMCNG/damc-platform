import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl2 border border-ink/8 bg-white p-5 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-bronze dark:text-parchment/60">
          {label}
        </span>
        <Icon size={16} className="text-gold-deep dark:text-gold-bright" />
      </div>
      <div className="mt-2 font-display text-2xl font-semibold text-ink dark:text-parchment">{value}</div>
    </div>
  );
}
