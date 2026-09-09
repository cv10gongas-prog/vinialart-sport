import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const sportButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-display text-xs uppercase tracking-[0.14em] transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        primary:
          "bg-magenta text-primary-foreground hover:shadow-glow-magenta hover:brightness-110",
        cyan: "bg-cyan text-accent-foreground hover:shadow-glow-cyan hover:brightness-110",
        outline:
          "border border-border bg-transparent text-foreground hover:border-cyan hover:text-cyan",
        ghost: "bg-transparent text-muted-foreground hover:text-foreground",
        gradient:
          "bg-sport-gradient text-background hover:brightness-110 hover:shadow-glow-magenta",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-14 px-8 text-sm",
      },
      shape: {
        slant: "[clip-path:polygon(10px_0,100%_0,calc(100%-10px)_100%,0_100%)]",
        square: "rounded-sm",
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
    <button
      className={cn(sportButtonVariants({ variant, size, shape }), className)}
      {...props}
    />
  );
}

export function SportLink({
  className,
  variant,
  size,
  shape,
  ...props
}: ComponentProps<typeof Link> & Variants) {
  return (
    <Link
      className={cn(sportButtonVariants({ variant, size, shape }), className)}
      {...props}
    />
  );
}
