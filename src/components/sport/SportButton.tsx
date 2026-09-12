import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Unified button system: pill shaped, editorial typography, subtle motion.
 * `shape` is kept for API compatibility but both values are now rounded so the
 * whole site shares one consistent silhouette.
 */
export const sportButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-display text-[0.72rem] uppercase tracking-[0.18em] transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        primary: "bg-cyan text-accent-foreground hover:brightness-110",
        magenta:
          "bg-magenta text-primary-foreground hover:shadow-glow-magenta hover:brightness-110",
        cyan: "bg-cyan text-accent-foreground hover:shadow-glow-cyan hover:brightness-105",
        outline:
          "border border-input bg-transparent text-foreground hover:border-foreground/45 hover:bg-foreground/5",
        ghost: "bg-transparent text-muted-foreground hover:text-foreground",
        gradient:
          "bg-sport-gradient text-background hover:brightness-110 hover:shadow-glow-magenta",
      },
      size: {
        sm: "h-9 px-5",
        md: "h-11 px-7",
        lg: "h-14 px-9 text-[0.78rem]",
      },
      shape: {
        slant: "rounded-md",
        square: "rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md", shape: "slant" },
  },
);

type Variants = VariantProps<typeof sportButtonVariants>;

export function SportButton({
  className,
  variant,
  size,
  shape,
  ...props
}: ComponentProps<"button"> & Variants) {
  return (
    <button className={cn(sportButtonVariants({ variant, size, shape }), className)} {...props} />
  );
}

import { createLink } from "@tanstack/react-router";

export const SportLink = createLink(function SportLinkInner({
  className,
  variant,
  size,
  shape,
  ...props
}: ComponentProps<"a"> & Variants) {
  return <a className={cn(sportButtonVariants({ variant, size, shape }), className)} {...props} />;
});
