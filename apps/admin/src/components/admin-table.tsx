import type { ReactNode } from "react";

export function AdminTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl2 border border-ink/8 bg-white shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function AdminTableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-ink/8 text-xs font-semibold uppercase tracking-wide text-bronze dark:border-parchment/10 dark:text-parchment/60">
      <tr>{children}</tr>
    </thead>
  );
}

export function AdminTableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-ink/8 dark:divide-parchment/10">{children}</tbody>;
}

export function Th({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-ink dark:text-parchment/90 ${className}`}>{children}</td>;
}

export function EmptyState({ message }: { message: string }) {
  return (
    <tr>
      <td colSpan={99} className="px-4 py-10 text-center text-sm text-bronze dark:text-parchment/60">
        {message}
      </td>
    </tr>
  );
}
