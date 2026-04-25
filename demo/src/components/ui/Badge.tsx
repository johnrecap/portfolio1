import * as React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "error";
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
        {
          "bg-primary text-on-primary": variant === "default",
          "bg-secondary-container text-on-secondary-container": variant === "secondary",
          "border border-[#E2E8F0] text-on-surface": variant === "outline",
          "bg-emerald-100 text-emerald-800": variant === "success",
          "bg-amber-100 text-amber-800": variant === "warning",
          "bg-error-container text-on-error-container": variant === "error",
        },
        className
      )}
      {...props}
    />
  );
}
