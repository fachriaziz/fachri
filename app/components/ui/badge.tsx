import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background border-border/40",
        secondary:
          "bg-secondary text-secondary-foreground border-border/40",
        success:
          "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20",
        warning:
          "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
        info:
          "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
        destructive:
          "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
        outline:
          "border-border text-foreground bg-background/50 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
