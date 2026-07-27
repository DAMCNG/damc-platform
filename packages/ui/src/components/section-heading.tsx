import { cn } from "../lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn(align === "center" && "text-center")}>
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-2 text-balance font-display text-2xl font-semibold text-ink dark:text-parchment sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className={cn("mt-3 max-w-2xl text-bronze dark:text-parchment/70", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}
