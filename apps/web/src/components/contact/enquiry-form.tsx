"use client";

import * as React from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@damc/ui";

type Status = "idle" | "submitting" | "success" | "error";

export function EnquiryForm() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    // Capture the form element now — React nulls out e.currentTarget once the
    // synchronous part of the event finishes, so it's unsafe to read after an await.
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone") || undefined,
      subject: form.get("subject") || undefined,
      message: form.get("message"),
    };

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      formEl.reset();
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again or reach us on WhatsApp.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl2 border border-ink/8 bg-white p-10 text-center shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
        <CheckCircle2 className="text-gold-deep dark:text-gold-bright" size={32} />
        <p className="font-display text-lg font-semibold text-ink dark:text-parchment">
          Thank you — your enquiry has been received.
        </p>
        <p className="text-sm text-bronze dark:text-parchment/70">
          A member of our team will get back to you shortly.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-ink/12 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold-deep dark:border-parchment/15 dark:bg-ink-soft/40 dark:text-parchment";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl2 border border-ink/8 bg-white p-8 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-bronze dark:text-parchment/60">
            Full name
          </label>
          <input id="name" name="name" required minLength={2} className={inputClass} placeholder="Adebayo Okonkwo" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-bronze dark:text-parchment/60">
            Email
          </label>
          <input id="email" name="email" type="email" required className={inputClass} placeholder="you@email.com" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-bronze dark:text-parchment/60">
            Phone (optional)
          </label>
          <input id="phone" name="phone" className={inputClass} placeholder="+234 800 000 0000" />
        </div>
        <div>
          <label htmlFor="subject" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-bronze dark:text-parchment/60">
            Subject
          </label>
          <input id="subject" name="subject" className={inputClass} placeholder="Membership enquiry" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-bronze dark:text-parchment/60">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          className={cn(inputClass, "resize-none")}
          placeholder="Tell us a little about yourself and why you'd like to connect…"
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-all hover:bg-gold-bright disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
        Send enquiry
      </button>
    </form>
  );
}
