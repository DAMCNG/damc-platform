"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Check, KeyRound } from "lucide-react";
import { changeMemberPassword, type PasswordChangeResult } from "@/app/members/login/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-xl bg-gold-deep px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-gold-deep/90 disabled:opacity-60 dark:bg-gold-bright dark:text-ink dark:hover:bg-gold-bright/90"
    >
      {pending ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
      Save New Password
    </button>
  );
}

export function ChangePasswordForm({ mustChange }: { mustChange?: boolean }) {
  const [state, formAction] = useActionState<PasswordChangeResult | undefined, FormData>(
    changeMemberPassword,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      {mustChange && !state?.success && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs font-medium text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
          <p className="font-semibold">Password update required:</p>
          <p className="mt-0.5">Please set your chosen password below to secure your account.</p>
        </div>
      )}

      {state?.success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
          <Check size={16} />
          {state.message}
        </div>
      )}

      {state && !state.success && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-600 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-400">
          {state.message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="newPassword"
            className="block text-xs font-semibold uppercase tracking-wider text-ink/70 dark:text-parchment/70"
          >
            New Password (min. 6 characters)
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            className="mt-1.5 w-full rounded-xl border border-ink/12 bg-white px-4 py-2 text-sm text-ink outline-none transition-colors placeholder:text-bronze/40 focus:border-gold-deep focus:ring-1 focus:ring-gold-deep dark:border-parchment/15 dark:bg-ink-soft dark:text-parchment dark:placeholder:text-parchment/30 dark:focus:border-gold-bright"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold uppercase tracking-wider text-ink/70 dark:text-parchment/70"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            className="mt-1.5 w-full rounded-xl border border-ink/12 bg-white px-4 py-2 text-sm text-ink outline-none transition-colors placeholder:text-bronze/40 focus:border-gold-deep focus:ring-1 focus:ring-gold-deep dark:border-parchment/15 dark:bg-ink-soft dark:text-parchment dark:placeholder:text-parchment/30 dark:focus:border-gold-bright"
          />
        </div>
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
