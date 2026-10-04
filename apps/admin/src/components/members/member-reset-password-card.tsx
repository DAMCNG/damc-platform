"use client";

import * as React from "react";
import { useActionState } from "react";
import { KeyRound, Copy, Check, Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import {
  resetMemberPassword,
  setMemberCustomPassword,
  type MemberActionResult,
} from "@/app/(dashboard)/members/actions";
import { formatArticulateNumber } from "@/lib/labels";

export function MemberResetPasswordCard({
  memberId,
  hasPassword,
  mustChangePassword,
  membershipNumber,
}: {
  memberId: string;
  hasPassword: boolean;
  mustChangePassword: boolean;
  membershipNumber: string | null;
}) {
  const [resetState, resetAction, isResetPending] = useActionState<MemberActionResult | undefined, FormData>(
    resetMemberPassword,
    undefined
  );

  const [customState, customAction, isCustomPending] = useActionState<MemberActionResult | undefined, FormData>(
    setMemberCustomPassword,
    undefined
  );

  const [copied, setCopied] = React.useState(false);
  const [showCustomInput, setShowCustomInput] = React.useState(false);

  const copyPassword = (pwd: string) => {
    navigator.clipboard.writeText(pwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="rounded-xl2 border border-ink/8 bg-white p-6 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-base font-semibold text-ink dark:text-parchment flex items-center gap-2">
            <KeyRound size={18} className="text-gold-deep dark:text-gold-bright" />
            Member Login &amp; Password
          </h2>
          <p className="mt-1 text-xs text-bronze dark:text-parchment/60">
            Members log in with their articulate number (
            <span className="font-mono font-semibold text-ink dark:text-parchment">
              {membershipNumber ? formatArticulateNumber(membershipNumber) : "Not assigned"}
            </span>
            ).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasPassword ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
              <ShieldCheck size={14} /> Password configured
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
              <ShieldAlert size={14} /> No password set
            </span>
          )}
          {mustChangePassword && (
            <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-medium text-gold-deep dark:bg-gold-bright/15 dark:text-gold-bright">
              Reset pending
            </span>
          )}
        </div>
      </div>

      {resetState?.success && resetState.tempPassword && (
        <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 dark:border-emerald-400/30 dark:bg-emerald-400/10">
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
            Temporary password generated successfully! Share this with the member:
          </p>
          <div className="mt-2 flex items-center gap-3">
            <code className="rounded bg-white px-3 py-1.5 font-mono text-base font-bold text-ink shadow-sm dark:bg-ink dark:text-parchment">
              {resetState.tempPassword}
            </code>
            <button
              type="button"
              onClick={() => copyPassword(resetState.tempPassword!)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:bg-ink dark:text-emerald-300 dark:hover:bg-ink-soft"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy password"}
            </button>
          </div>
          <p className="mt-2 text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
            The member will be prompted to choose their own personal password upon their next login.
          </p>
        </div>
      )}

      {resetState && !resetState.success && (
        <p className="mt-4 text-xs font-medium text-red-600 dark:text-red-400">{resetState.message}</p>
      )}

      {customState && (
        <p
          className={`mt-4 text-xs font-medium ${
            customState.success ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {customState.message}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-ink/8 pt-4 dark:border-parchment/10">
        <form action={resetAction}>
          <input type="hidden" name="id" value={memberId} />
          <button
            type="submit"
            disabled={isResetPending}
            className="inline-flex items-center gap-2 rounded-lg bg-gold-deep px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-gold-deep/90 disabled:opacity-60 dark:bg-gold-bright dark:text-ink dark:hover:bg-gold-bright/90"
          >
            {isResetPending ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
            {hasPassword ? "Reset password (generate temp)" : "Generate initial password"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setShowCustomInput((v) => !v)}
          className="text-xs font-semibold text-bronze hover:text-ink dark:text-parchment/60 dark:hover:text-parchment"
        >
          {showCustomInput ? "Hide manual entry" : "Or assign custom password"}
        </button>
      </div>

      {showCustomInput && (
        <form action={customAction} className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-ink/8 bg-parchment/40 p-3 dark:border-parchment/10 dark:bg-ink/30">
          <input type="hidden" name="id" value={memberId} />
          <input
            type="text"
            name="newPassword"
            placeholder="Enter new password (min 6 chars)"
            minLength={6}
            required
            className="min-w-[240px] flex-1 rounded-md border border-ink/12 bg-white px-3 py-1.5 text-xs text-ink outline-none transition focus:border-gold-deep dark:border-parchment/15 dark:bg-ink-soft dark:text-parchment"
          />
          <button
            type="submit"
            disabled={isCustomPending}
            className="inline-flex items-center gap-1.5 rounded-md border border-ink/12 bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-gold-deep disabled:opacity-60 dark:border-parchment/15 dark:bg-ink-soft dark:text-parchment"
          >
            {isCustomPending && <Loader2 size={12} className="animate-spin" />}
            Save custom password
          </button>
        </form>
      )}
    </div>
  );
}
