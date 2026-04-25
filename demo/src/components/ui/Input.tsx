import * as React from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-1">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-[12px] border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-body-main file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-shadow",
            error && "border-error focus-visible:ring-error/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-[12px] font-medium text-error mt-0.5">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
