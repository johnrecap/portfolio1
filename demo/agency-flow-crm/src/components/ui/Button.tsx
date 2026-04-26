import * as React from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[8px] font-label-bold text-label-bold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-primary text-on-primary hover:bg-primary/90 shadow-natural hover:shadow-lifted": variant === "primary",
            "bg-white border text-primary border-primary hover:bg-surface": variant === "secondary",
            "bg-transparent text-slate-600 hover:bg-slate-100": variant === "ghost",
            "bg-error text-on-error hover:bg-error/90 shadow-natural hover:shadow-lifted": variant === "danger",
            "h-8 px-3 text-[12px]": size === "sm",
            "h-10 px-4 py-2": size === "md",
            "h-12 px-6 py-3": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
