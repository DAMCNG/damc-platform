import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      gold: "bg-gold/15 text-gold-deep dark:bg-gold-bright/15 dark:text-gold-bright",
      success: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-400",
      warning: "bg-amber-500/15 text-amber-700 dark:bg-amber-400/15 dark:text-amber-400",
      ink: "bg-ink/8 text-ink dark:bg-parchment/10 dark:text-parchment",
    },
  },
  defaultVariants: {
    variant: "gold",
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
