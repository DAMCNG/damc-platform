"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@damc/ui";

export function SubmitButton({
  children,
  className,
  pendingLabel,
}: {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright disabled:opacity-70",
        className
      )}
    >
      {pending && <Loader2 size={15} className="animate-spin" />}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
