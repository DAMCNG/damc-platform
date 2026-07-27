import { BrandMark } from "./brand-mark";

export function LoadingLogo({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-gold/20 border-t-gold-deep dark:border-parchment/15 dark:border-t-gold-bright" />
        <BrandMark size={44} className="animate-pulse-glow" />
      </div>
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wide text-bronze dark:text-parchment/60">
          {label}
        </span>
      )}
    </div>
  );
}
