import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const inputVariants = cva(
  "flex w-full rounded-2xl border border-transparent px-6 py-4 text-sm transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gray-50 border-gray-300 placeholder:text-gray-300 focus:bg-white focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/5",
        standard: "bg-gray-50 border-gray-300 placeholder:text-gray-400 focus:bg-white focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/5",
        ghost: "bg-transparent border-none px-0",
      },
      size: {
        default: "h-14",
        sm: "h-11",
        lg: "h-16 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
