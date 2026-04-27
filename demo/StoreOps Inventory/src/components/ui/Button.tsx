import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      className, 
      variant = 'primary', 
      size = 'md', 
      isLoading, 
      leftIcon, 
      rightIcon, 
      children, 
      disabled, 
      ...props 
    }, 
    ref
  ) => {
    const variants = {
      primary: 'bg-primary text-on-primary hover:bg-primary/90 focus-visible:ring-primary',
      secondary: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 focus-visible:ring-secondary',
      outline: 'border border-outline bg-transparent hover:bg-surface-container hover:text-on-surface focus-visible:ring-primary',
      ghost: 'bg-transparent hover:bg-surface-container hover:text-on-surface focus-visible:ring-primary',
      danger: 'bg-error text-on-error hover:bg-error/90 focus-visible:ring-error',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-8 text-base',
      icon: 'h-10 w-10 justify-center p-2'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-surface gap-2 whitespace-nowrap',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
Button.displayName = 'Button';
