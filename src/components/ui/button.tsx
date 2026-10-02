import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-4 text-sm font-bold uppercase tracking-wider transition-[transform,box-shadow,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        imperial:
          "border border-primary/70 bg-primary text-primary-foreground shadow-[0_5px_0_var(--wax-shadow)] hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_7px_0_var(--wax-shadow),0_10px_28px_var(--gold-glow)] active:translate-y-1 active:shadow-none",
        outline:
          "border border-border bg-background/40 text-foreground hover:border-accent hover:bg-accent/10",
        ghost: "text-foreground hover:bg-secondary/60",
      },
      size: {
        default: "h-11",
        icon: "size-11 px-0",
      },
    },
    defaultVariants: { variant: "imperial", size: "default" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
