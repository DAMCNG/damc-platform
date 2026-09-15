"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, ArrowRight } from "lucide-react";
import { loginMember, type LoginResult } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-deep py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gold-deep/95 hover:shadow disabled:opacity-60 dark:bg-gold-bright dark:text-ink dark:hover:bg-gold-bright/95"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Signing in…</span>
        </>
      ) : (
        <>
          <span>Sign into Members&rsquo; Area</span>
          <ArrowRight size={16} />
        </>
      )}
    </button>
  );
}

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction] = useActionState<LoginResult | undefined, FormData>(
    loginMember,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}

      {state && !state.success && state.message && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs font-medium text-red-600 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-400">
          {state.message}
        </div>
      )}

      <div>
        <label
          htmlFor="membershipNumber"
          className="block text-xs font-semibold uppercase tracking-wider text-ink/70 dark:text-parchment/70"
        >
          Membership Number
        </label>
        <input
          id="membershipNumber"
          name="membershipNumber"
          type="text"
          required
          autoComplete="username"
          placeholder="e.g. DAMC/001"
          className="mt-1.5 w-full rounded-xl border border-ink/12 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-bronze/40 focus:border-gold-deep focus:ring-1 focus:ring-gold-deep dark:border-parchment/15 dark:bg-ink-soft dark:text-parchment dark:placeholder:text-parchment/30 dark:focus:border-gold-bright"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-wider text-ink/70 dark:text-parchment/70"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="mt-1.5 w-full rounded-xl border border-ink/12 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-bronze/40 focus:border-gold-deep focus:ring-1 focus:ring-gold-deep dark:border-parchment/15 dark:bg-ink-soft dark:text-parchment dark:placeholder:text-parchment/30 dark:focus:border-gold-bright"
        />
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
