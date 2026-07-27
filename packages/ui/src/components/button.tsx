import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-tight transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-gold text-ink hover:bg-gold-bright active:scale-[0.98] shadow-card",
        outline: "border border-ink/15 text-ink hover:bg-ink/5 dark:border-parchment/20 dark:text-parchment dark:hover:bg-parchment/10",
        ghost: "text-ink hover:bg-ink/5 dark:text-parchment dark:hover:bg-parchment/10",
        dark: "bg-ink text-gold-bright hover:bg-ink-soft active:scale-[0.98]",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";

export { buttonVariants };
