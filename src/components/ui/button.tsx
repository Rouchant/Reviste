import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl text-sm font-bold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary: "bg-brand-pink text-white shadow-lg shadow-brand-pink/20 hover:bg-[#b02e68] hover:shadow-xl",
        outline: "border-2 border-brand-pink text-brand-pink bg-white hover:bg-brand-pink/5",
        ghost: "hover:bg-gray-100 text-gray-600",
        secondary: "bg-brand-green text-white shadow-lg shadow-brand-green/20 hover:bg-[#729379]",
        muted: "bg-gray-100 text-gray-500 hover:bg-gray-200",
      },
      size: {
        default: "h-12 px-8 py-4",
        sm: "h-9 px-4 py-2",
        lg: "h-14 px-10 py-5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
