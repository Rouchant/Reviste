import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-pink text-white shadow shadow-brand-pink/20",
        secondary: "border-transparent bg-brand-green text-white shadow shadow-brand-green/20",
        destructive: "border-transparent bg-red-100 text-red-700",
        outline: "text-brand-pink border border-brand-pink bg-white/50 backdrop-blur-sm",
        success: "border-transparent bg-green-100 text-green-700",
        warning: "border-transparent bg-orange-100 text-orange-700",
        muted: "border-transparent bg-gray-100 text-gray-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
