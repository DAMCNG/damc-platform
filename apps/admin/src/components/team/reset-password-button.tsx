"use client";

import { useActionState } from "react";
import { Loader2, Copy, KeyRound } from "lucide-react";
import { resetTeamMemberPassword, type ActionResult } from "@/app/(dashboard)/team/actions";

export function ResetPasswordButton({ memberId }: { memberId: string }) {
  const [state, formAction, isPending] = useActionState<ActionResult | undefined, FormData>(
    resetTeamMemberPassword,
    undefined
  );

  if (state?.success && state.tempPassword) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-ink/12 bg-parchment-paper px-4 py-3 dark:border-parchment/15 dark:bg-ink">
        <code className="text-sm font-semibold text-ink dark:text-parchment">{state.tempPassword}</code>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(state.tempPassword!)}
          className="flex items-center gap-1 text-xs font-semibold text-gold-deep hover:underline dark:text-gold-bright"
        >
          <Copy size={13} /> Copy
        </button>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={memberId} />
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 rounded-lg border border-ink/12 px-3.5 py-2 text-xs font-semibold text-bronze transition-colors hover:border-gold-deep hover:text-gold-deep disabled:opacity-60 dark:border-parchment/15 dark:text-parchment/60"
      >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
        Reset password
      </button>
    </form>
  );
}
