"use client";

import { Trash2 } from "lucide-react";

export function DeleteButton({ confirmMessage = "Delete this item? This cannot be undone." }: { confirmMessage?: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
      aria-label="Delete"
      className="rounded-lg p-1.5 text-bronze transition-colors hover:bg-red-50 hover:text-red-600 dark:text-parchment/60 dark:hover:bg-red-950/40 dark:hover:text-red-400"
    >
      <Trash2 size={16} />
    </button>
  );
}
