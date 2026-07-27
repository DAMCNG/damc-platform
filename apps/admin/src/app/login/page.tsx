"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { BrandMark } from "@damc/ui";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [error, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment-paper px-6 dark:bg-ink">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <BrandMark size={60} className="mx-auto mb-4" />
          <h1 className="font-display text-xl font-semibold text-ink dark:text-parchment">DAMC Admin</h1>
          <p className="mt-1 text-sm text-bronze dark:text-parchment/60">Sign in to manage the club website</p>
        </div>

        <form action={formAction} className="space-y-4 rounded-xl2 border border-ink/8 bg-white p-7 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-bronze dark:text-parchment/60">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-lg border border-ink/12 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold-deep dark:border-parchment/15 dark:bg-ink-soft/40 dark:text-parchment"
              placeholder="you@damcng.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-bronze dark:text-parchment/60">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-ink/12 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold-deep dark:border-parchment/15 dark:bg-ink-soft/40 dark:text-parchment"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-all hover:bg-gold-bright disabled:opacity-60"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
